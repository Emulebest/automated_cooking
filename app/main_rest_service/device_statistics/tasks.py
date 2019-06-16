import json

from background_task import background
from django.contrib.auth.models import User
import redis
import time
import traceback

from device_statistics.models import Metric


def redis_get_device_info():
    r = redis.StrictRedis(host='localhost', port=6379)  # Connect to local Redis instance
    try:

        p = r.pubsub()
        p.subscribe('sous-vide')

        while True:
            message = p.get_message()  # Checks for message
            if message:
                msg = message['data']  # Get data from message
                msg = msg.decode("utf-8").replace("'", '"')
                redis_msg = json.loads(msg)
                print(redis_msg, flush=True)
                msg_type = redis_msg.get("type", None)
                user = redis_msg.get('user', None)
                device = redis_msg.get("device", None)
                if msg_type is not None and msg_type == "show_temp" and user is not None and device is not None:
                    Metric.objects.create(device=device, user_id=user, value=redis_msg["temp"], type=msg_type)
                    
            time.sleep(1)

    except Exception as e:
        print(e, flush=True)


@background
def update_stats():
    redis_get_device_info()

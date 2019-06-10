import jwt
from jwt import DecodeError
from starlette.authentication import AuthenticationBackend, SimpleUser, AuthCredentials, AuthenticationError

from settings import SECRET, ALGORITHM


class BasicAuthBackend(AuthenticationBackend):
    async def authenticate(self, request):
        if request.url.path == "/ws":
            return
        if "Authorization" not in request.headers:
            raise AuthenticationError('No JWT token provided')

        auth = request.headers["Authorization"]
        try:
            token = auth.split(" ")[1]
            payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
            return AuthCredentials(["authenticated"]), SimpleUser(payload["user_id"])
        except DecodeError as e:
            print(e, flush=True)
            raise AuthenticationError('Invalid JWT token')
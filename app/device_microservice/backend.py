import jwt
from jwt import DecodeError
from starlette.authentication import AuthenticationBackend, SimpleUser, AuthCredentials, AuthenticationError

from settings import SECRET, ALGORITHM


class BasicAuthBackend(AuthenticationBackend):
    async def authenticate(self, request):
        if "Authorization" not in request.headers:
            return

        auth = request.headers["Authorization"]
        try:
            token = auth.split(" ")[1]
            payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
            return AuthCredentials(["authenticated"]), SimpleUser(payload["user_id"])
        except DecodeError as e:
            print(e, flush=True)
            raise AuthenticationError('Invalid JWT token')
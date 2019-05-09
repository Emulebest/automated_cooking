from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import *


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Registers user to the server. Input should be in the format:
    {"username": "username", "password": "1234abcd"}
    """
    serializer = CreateUserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        })
    return Response(serializer.errors)
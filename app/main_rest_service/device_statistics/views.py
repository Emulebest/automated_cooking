from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import *
from .tasks import *


class MetricsListView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = MetricSerializer

    def get_queryset(self):
        return Metric.objects.filter(user=self.request.user).order_by('dt')[:20]


class LtsMetricsListView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = MetricSerializer

    def get_queryset(self):
        return Metric.objects.filter(user=self.request.user).order_by('dt')[:1]


class ProcessStartupView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        update_stats()
        return Response(data={"success": "ok"}, status=200)

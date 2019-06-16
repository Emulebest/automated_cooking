from django.urls import path

from . import views

urlpatterns = [
    path('start_task/,', views.ProcessStartupView.as_view()),
    path('', views.MetricsListView),
]

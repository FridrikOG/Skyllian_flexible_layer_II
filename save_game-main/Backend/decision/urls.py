# from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path
from .views import DecisionAPIVIEW
from . import views

# Pattern matching
urlpatterns = [
    # Used to register user
    path('', DecisionAPIVIEW.as_view(), name='the game itself'),
    # Used to login user
]

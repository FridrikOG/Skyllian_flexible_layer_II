# from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path
from .views import CryptoAPIVIEW
from . import views

# Pattern matching
urlpatterns = [
    # Used to register user
    path('', CryptoAPIVIEW.as_view(), name='the game itself'),
]

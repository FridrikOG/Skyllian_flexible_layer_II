# from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path
from .views import WalletUserAPIVIEW
from . import views

# Pattern matching
urlpatterns = [
    # Used to register user
    path('', WalletUserAPIVIEW.as_view(), name='the game itself'),
]

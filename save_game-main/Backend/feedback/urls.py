# from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path
from .views import FeedbackAPIVIEW
from . import views

# Pattern matching
urlpatterns = [
    # Used to register user
    path('', FeedbackAPIVIEW.as_view(), name='the game itself'),
    # Used to login user
]

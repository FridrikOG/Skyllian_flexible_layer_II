# from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path
from .views import CharacterAPIVIEW, CharacterAdminAPIVIEW
from . import views

# Pattern matching
urlpatterns = [
    # Used to register user
    path('', CharacterAPIVIEW.as_view(), name='the game itself'),
    path('admin/', CharacterAdminAPIVIEW.as_view(), name='the game itself'),

    # Used to login user
]

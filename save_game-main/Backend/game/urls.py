# from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path
from .views import JOINGameAPIVIEW, ADMINGameAPIVIEW, ADMINGameStatAPIVIEW
from . import views

# Pattern matching
urlpatterns = [
    # Used to register user
    path('join/', JOINGameAPIVIEW.as_view(), name='the game itself'),
    path('admin/', ADMINGameAPIVIEW.as_view(), name='JoinableGames'),
    path('leaderboard/<str:gameId>/',
         ADMINGameStatAPIVIEW.as_view(), name='StatForGame')
]

# from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path
from .views import UserStatAPIVIEW, UserStatHistoryAPIVIEW, UserStatHistoryIndividualAPIVIEW, UserStatRippleAPIVIEW
from . import views

# Pattern matching
urlpatterns = [
    # Used to register user
    path('', UserStatAPIVIEW.as_view(), name='getUserStat'),
    path('makeRippleTransaction/',
         UserStatRippleAPIVIEW.as_view(), name='getUserStat'),
    path('history/', UserStatHistoryAPIVIEW.as_view(), name='getUserStat'),
    path('history/<str:gameId>/',
         UserStatHistoryIndividualAPIVIEW.as_view(), name='getUserStat'),
    # Used to login user
]

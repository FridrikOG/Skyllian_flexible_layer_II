from re import S
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import generics
from rest_framework.decorators import permission_classes
from rest_framework.permissions import *
from datetime import datetime
from game.models import Game
from user.models import User
from userStat.models import User
from userStatCharacter.models import UserStatCharacter

from user.views import getUserId
from userStat.models import UserStat
from userStat.views import *
from game.views import *
from rest_framework.parsers import JSONParser
from rest_framework import serializers
from rest_framework.authentication import get_authorization_header
from rest_framework import status
import jwt
from django.conf import settings
from django.utils import timezone
from django.utils.timezone import make_aware

from django.utils.timezone import timedelta


def getCharacterId(request):
    try:
        return request.data['characterId']
    except:
        return False


class CharacterAPIVIEW(generics.GenericAPIView):
    def __init__(self):
        self.serialiser = 0

    @permission_classes([IsAuthenticated])
    def get(self, request):
        '''
        PRE-CONDITION: user has to be in a game to use this endpoint, meaning joining a game is required beforehand.
        '''

        # TODO fix make sure has character works
        # Get character for the specific game
        dict = getAllGameInfo(request)
        # If the user does not actually belong to the game
        if not dict:
            return JsonResponse(dict, safe=False, status=status.HTTP_400_BAD_REQUEST)
        else:
            return JsonResponse(dict, safe=False, status=status.HTTP_200_OK)

    @permission_classes([IsAuthenticated])
    def post(self, request):
        # CHOOSE character for the specific game
        characterId = getCharacterId(request)
        if not characterId:
            return JsonResponse({"error": "Missing characterId"}, safe=False, status=status.HTTP_400_BAD_REQUEST)

        gameId = getGameId(request)
        if not gameId:
            return JsonResponse({"error": "Missing gameId"}, safe=False, status=status.HTTP_400_BAD_REQUEST)

        # Get the user stat belonging to that game
        userStat = getUserStat(request)
        if not userStat:
            return JsonResponse({"error": "Not in an active game"}, safe=False, status=status.HTTP_400_BAD_REQUEST)

        # Success case
        character = Character.objects.get(id=characterId)
        userStatChar = UserStatCharacter(
            character=character, userStat=userStat)
        userStatChar.save()

        return JsonResponse({"game": getAllGameInfo(request)}, safe=False, status=status.HTTP_200_OK)


class CharacterAdminAPIVIEW(generics.GenericAPIView):
    def __init__(self):
        self.serialiser = 0

    @permission_classes([IsAuthenticated])
    def post(self, request):
        print("Here")
        hereJson = {}
        # here = Character(1, "Joel", """Welcome Joel to a place that makes your life easier! We here at LIFEASIERtm are here to make your life easier by putting a microchip into your brain and taking care of important choices that come every ten years! You might be wondering: “Why every ten years ?” Well that’s because our top scientist at our top science department said that all of our important decisions come in waves of 10 years. That totally makes sense, right? ((I really hope no scientists play this game)). AnywAY we really hope you enjoy the extra help we´ll be giving you until you die. Me and my staff will take great care of you and your money, both the 2 million dollars you gave us for this operation and the money we will help you save, OhOhOho!
        # The first choice we will help you with will happen in the next few days, so feel free to take it easy and let us handle it…
        # """, """Loves rock music –- Is studying at a cook college — dreams to be a great chef,
        # Is introverted –- gets addicted to things easily –- doesn’t know how to let things go
        # doesn’t consume alcohol — is terrible with money
        # Welcome to Joel’s first hard decision we need to solve for him
        # He has been invited to a party by kids from the college he just started in but has also been invited to go hiking with his family over the weekend. He does not have a lot of friends so this party might be perfect for him to meet new people but he has also not seen his family properly for a while and it might be good to reconnect a bit.
        # """).save()
        here = Character(2, "Anna", """Welcome to Anna’s first hard decision we need to solve for her
    So Anna Is sort of having a crisis. Anna has been struggling a lot about planning the future recently and really wants to grow as an artist, but at the same time she could really use the money.""", """Loves animals – Works at a souvenir shop — Loves art—
    Loves making friends — Watches way too much TV  — Is not attracted to people
    — Loves technology  —  Lives in Iceland — Is american
    """).save()

        # hereJson = here.getJson()
    # here.save()
    # characters = Character.objects.filter().all()
    # for y in characters:
    #     y.delete()

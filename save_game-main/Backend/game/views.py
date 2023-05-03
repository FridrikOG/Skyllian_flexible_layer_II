from re import S
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import generics
from rest_framework.decorators import permission_classes
from rest_framework.permissions import *
from datetime import datetime
from game.models import Game
from user.models import User
from user.views import getUserId
from userStat.views import getUserStat
from userStat.models import UserStat
from rest_framework.parsers import JSONParser
# @permission_classes([AllowAny])
from rest_framework import serializers
from rest_framework.authentication import get_authorization_header
from rest_framework import status
import jwt
from django.conf import settings
from django.utils import timezone
from django.utils.timezone import make_aware
from decision.models import Decision
from django.utils.timezone import timedelta


def getGameId(request):
    userId = getUserId(request)
    user = User.objects.get(id=userId)

    try:
        userStat = UserStat.objects.filter(user=user, isPlaying=True).first()
        userStat = userStat.getJson()
        gameId = userStat['game']['id']
        return gameId
    # User not part of any active games
    except:

        return False


def getGamesPartOf(request):
    userId = getUserId(request)
    user = User.objects.get(id=userId)
    game = UserStat.objects.filter(user=user, isPlaying=True)
    ids = []
    userStat = game.getJson()
    for x in game:
        ids.append(UserStat)


def canJoinGame(gameLis, game):
    for gameId in gameLis:

        if gameId == game['id']:
            return False
    return True


def getJoinableGamesByUserId(request):
    userId = getUserId(request)
    user = User.objects.get(id=userId)
    game = getGameId(request)
    # Gets the available games for the user, all the id's of games the user is not a part of
    userStatsUserIsPartOf = UserStat.objects.filter(
        user=user, isPlaying=False)
    print("Games user is a part of ", userStatsUserIsPartOf)
    print("user id of ", userId)
    if len(userStatsUserIsPartOf) <= 0:
        print("user not part of any games ")
    currentActive = getUserStat(request)
    gameLis = Game.objects.filter()

    gamesUserHasPlayed = []

    for userStat in userStatsUserIsPartOf:
        game = userStat.game
        game = game.getJson()
        print("Game ", game)

        gamesUserHasPlayed.append(game['id'])

    print("user has played ", gamesUserHasPlayed)
    currentOpenGames = []
    for x in gameLis:
        naive_datetime = datetime.now()
        naive_datetime.tzinfo
        naive_datetime = make_aware(naive_datetime)
        naive_datetime.tzinfo
        if x.gameStartDate > naive_datetime:
            print("Game is not started yet")
        # elif x.gameEndDate < naive_datetime:
        #     print("Game is already finished")
        else:
            print("Game has started and not ended yet")
            game = x.getJson()

            # Figure out if player is in an active game
            if currentActive:
                if currentActive.game.id == game['id']:
                    print("User already part of game ")
                    # User is playing in this game
                    game['isPlaying'] = True
                    # Already part of the game
                    game['isJoinable'] = False
                    # Already finished the game
                    game['isFinished'] = False
                else:
                    # user is in an active game, but not this one
                    game['isPlaying'] = False

                    game['isJoinable'] = False
                    # Already finished the game
                    if not canJoinGame(gamesUserHasPlayed, game):
                        game['isFinished'] = True
            else:
                # USER IS NOT PART OF ANY GAME
                # DEFAULT
                game['isPlaying'] = False
                game['isJoinable'] = True
                # Already finished the game
                game['isFinished'] = False

                # If I cannot join the game
                if not canJoinGame(gamesUserHasPlayed, game):
                    print("cannot join that game")
                    game['isPlaying'] = False
                    game['isJoinable'] = False
                    game['isFinished'] = True

            currentOpenGames.append(game)

    return currentOpenGames


class GameSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=20, default='Jeff')

    class Meta:
        model = Game
        fields = ['name', 'gameStartDate']

    def create(self, validatedData):
        return Game.objects.create(**validatedData)

# Gets all games the user can join


class ADMINGameAPIVIEW(generics.GenericAPIView):
    def __init__(self):
        self.serialiser = 0

    # Create a game
    # TODO: make admin only be able to access this endpoint
    @ permission_classes([IsAuthenticated])
    def post(self, request):
        ENDTIMEDAYS = 180
        name = request.data['name']
        startDate = int(request.data['gameStartDate'])

        endDate = startDate + (3600*ENDTIMEDAYS)
        newGame = Game(name, str(startDate), endDate)

        game = Game(name=name, gameStartDate=startDate,
                    gameEndDate=endDate)
        dict = {
            "name": str(name),
            "gameStartDate": str(startDate),
            "gameEndDate": str(endDate)
        }
        value = startDate
        startDate = make_aware(datetime.fromtimestamp(value))
        value = endDate
        endDate = timedelta(days=ENDTIMEDAYS) + startDate
        # As long as we have a validated user and a game we can create a game
        game = Game(name=name, gameStartDate=startDate, gameEndDate=endDate)
        # Save to database
        game.save()
        return JsonResponse(dict, status=status.HTTP_200_OK)

    # Here the user should be able to join
    # an eligible game


class JOINGameAPIVIEW(generics.GenericAPIView):
    @ permission_classes([IsAuthenticated])
    def get(self, request):
        userId = getUserId(request)

        game = getGameId(request)

        dict = {
            "lis": [],
            "isEmpty": True,
        }

        gamesUserNotPartOf = UserStat.objects.filter(
            user_id=userId)

        # Get the list of all current open games
        currentOpenGames = getJoinableGamesByUserId(request)
        # Current open games
        dict['lis'] = currentOpenGames
        # Returns true if currentOpenGames is empty
        dict['isEmpty'] = not currentOpenGames
        return JsonResponse(dict, status=status.HTTP_200_OK)

    @ permission_classes([IsAuthenticated])
    def post(self, request):
        userId = getUserId(request)
        try:
            gameId = request.data['gameId']
        except:
            return JsonResponse({"error": "Missing gameId in body"}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.get(id=userId)
        game = Game.objects.get(id=gameId)
        dict = {
            "isSuccess": False,
            "game": {}
        }
        game = Game.objects.get(id=gameId)
        # If there is a game with that ID
        userSta = UserStat.objects.filter(
            game=game, user=user, isPlaying=True)
        if userSta:
            return JsonResponse({"userStat": userSta[0].getJson()}, status=status.HTTP_200_OK)
        else:
            newUserStat = UserStat(game=game, user=user)
            newUserStat.save()
        return JsonResponse({"userStat": newUserStat.getJson()}, status=status.HTTP_200_OK)


class ADMINGameStatAPIVIEW(generics.GenericAPIView):
    @ permission_classes([IsAuthenticated])
    def get(self, request, gameId):
        userId = getUserId(request)

        gamesUserNotPartOf = UserStat.objects.filter(
            game=gameId, isPlaying=False, isDead=False).order_by('score').reverse()[:10]

        dict = {}
        dict['userStats'] = []
        for userStat in gamesUserNotPartOf:
            health = userStat.getHealth()
            money = userStat.getMoney()
            userStat = userStat.getJson()

            if userStat['health'] != '100' and userStat['money'] != '100':

                dict['userStats'].append(userStat)
        dict['game'] = dict['userStats'][0]['game']
        # sprint(userStat)
        print("How many on leaderboard ", len(dict['userStats']))
        return JsonResponse(dict, status=status.HTTP_200_OK)

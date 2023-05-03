import os
from django.http import HttpResponsePermanentRedirect
from django.shortcuts import redirect
from random import randint
from django.urls import reverse
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMessage
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
from character.models import Character
from user.views import getUserId
from userStat.models import UserStat
from userStat.models import User
from userStatCharacter.models import UserStatCharacter
from user.views import getUserId
from userStat.models import UserStat
from decision.models import Decision
from reward.models import Reward
from userStat.views import *
from game.views import *
from rest_framework import status
from datetime import datetime
from django.utils.encoding import smart_str, force_str, force_bytes,  smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from user.utils import Util
from asgiref.sync import sync_to_async
from userStat.sendXRP import makeTransaction
import asyncio
from rewarduser.models import Rewarduser


DECISIONTIME = 3


def getTimeStamp(date):
    return datetime.timestamp(date)


def getDecisionDict(whichDict):
    if whichDict == 1 or whichDict == 2 or whichDict == 3:
        return {"QA": {
            "question1": """Welcome to Joel's first hard decision we need to solve for him
    He has been invited to a party by kids from the college he just started in but has also been invited to go hiking with his family over the weekend. He does not have a lot of friends so this party might be perfect for him to meet new people but he has also not seen his family properly for a while and it might be good to reconnect a bit.
    """,
            "answer1": ["Do you go to your friend's party", "Do you go hiking with your family for the weekend?"],
            "actualAnswer1": 0,
            "actualAnswerText1": ["""Things are not looking good… You attended the party and got a panic attack the moment
            you stepped into a room full of people. A guy named
            Ryan comes up to you to check on you and
            knows how you feel. He told you that what
            helps him calm down is alcohol and pours
            you a mug of vodka. It helped you a lot
            there but did not help your future. """,
                                  """You end up going hiking with your family
            and meet some of your parents’ friends and
            they end up getting you the job of your dreams!
            A head chef at a fancy restaurant downtown.
            When you heard this news you got so excited
            you tripped and fell but thereby broke your
            hand. Nothing a little trip to the hospital
            can’t fix."""],
            "question2": """10 years have passed and it would seem that he’s close to starting to consume alcohol on a daily basis now and life just isn’t the same for him anymore. He lives alone and has been working at the same place for 10 years now which is fine since he gets well paid but it would appear that he’s still missing a chunk of happiness. Maybe he’s lonely? Maybe he's tired of drinking? Or maybe he’s lonely because he’s drinking or drinking because he’s lonely?
    Dude this is getting confusing…
    """,
            "answer2": ["Get help for your alcohol addiction", "Start using dating sites"],
            "actualAnswer2": 0,
            "actualAnswerText2": ["""You decide to turn things around for you and go to a local AA center and you get help there from people that have gone through the same things as you have. There’s even a girl there that seems to really like you. It looks like you hit two birds with one stone considering you were looking for someone to date. The future is looking promising… but maybe not your wallet… """, """But of course! Dating ! It would have been stupid of you to think that alcohol has ever harmed anyone in the world. You set up your profile and get 5 matches in 2 months, wow! You ended up going on a date with a girl that drinks and loves to party, a perfect match. After 5 months she moves in with you and helps you pay rent. """],
            "question3": """Another 10 years pass and a lot has happened, as expected. Joel has a girlfriend that gets him but we’re certain he’s getting tired of his job and the payment just isn’t enough anymore. He’s been thinking about two things recently and is struggling with choosing between them. He’s been thinking of opening his own restaurant or asking for a raise in payment… He doesn't seem to know which option is safer… Help him choose the better option.""",
            "answer3": ["Quit your job and open your own restaurant", "Ask for a raise"],
            "actualAnswer3": 0,
            "actualAnswerText3": ["""You decide to take out your savings and get a loan from the bank and quit the same day. Your girlfriend doesn’t think that was such a good idea but you’re hoping it will be successful. You buy a place and start refurbishing it and turning it into a restaurant of your dreams. You open the restaurant and… it becomes a great SUCCESS! Critics and locals are amazed by the food. The restaurant will only grow in popularity from this point on.""", """You ask your boss for a raise at your job and end up getting fired because he’s furious that you’d ask for a raise when you haven’t been doing your job properly for 10 years. You get too scared to quit your job now and just feel ashamed. You really want to improve your image to the boss so you decide to be a complete try hard every time he’s around you. The boss isnt impressed."""],
            "question4": """Happy 50 years to Joel ! and happy 30 years to LIFEASIER tm. Joel is feeling pretty alright at this time of his life. 9 years ago he married his girlfriend and had twins! A girl named Stephany and a boy named Robert just like Joel’s brother. He now shares a house with his wife and kids and has a stable job as an owner. Talking about his brother Robert tho… He used to live with them for a while because he needed a place to stay until he bought a house of his own with bitcoin.
    He has been sending you multiple emails and messages on all platforms and is telling Joel to invest in “crypto currency” to get richer really easily. So what’s it gonna be? Make him shut up about it or invest in it?
    """,
            "answer4": [" Invest in crypto currency", "Buy him a hot dog so that he shuts up about it"],
            "actualAnswer4": 0,
            "actualAnswerText4": ["""You decide to invest in crypto currency and boy was it a mistake. The crypto currency market crashed 3 weeks after you invested thousands of dollars. This was one of the worst things to happen to you in years. You are mad at your brother and you want to buy a hot dog to throw it at him but you can’t afford it.  What the future holds is unclear from this point but you can only hope it’s something good.""", """He is really proud of the hot dog you bought him and successfully shuts up about it. I’d  be happy with the choice you made because the crypto currency market crashed 3 weeks after this event and millions of people lost their money."""],
            "question5": """It would appear that the chip that has been installed into Joel’s brain has stopped working properly for quite some time so this is going to be the last question you’ll help him with. It’s been amazing to see time pass and see him change into the man he is today. I’m amazed he’s still alive to be honest. Back to the question tho, Joel has been thinking about retiring and giving his kids the restaurant but has also been thinking on expanding the restaurant and turning it into a chain. These choices aren’t easy and I would try and choose wisely.""",
            "answer5": ["Retire and give the business to your children", "Try and expand the restaurant and turn it into a chain"],
            "actualAnswerText5": ["""You decide to retire and give the business to your children. This was one of the best choices you’ve made so far because the restaurant wasn’t doing that well at that point and they completely turned things around for you. They changed the restaurant for the better and made sure to give you your legacy. You can finally rest and live an easy life. You have a wife, two amazing kids and everything seems to be going into the right direction. You live happily for the last years of your life and LIFEASIERtm was happy to serve you.
    """, """You decide to buy multiple places to have your restaurant at and try to turn the restaurant into a chain. This might have seemed like a good idea at first but it didn’t turn out so well for you. All of the places were shutdown after critics claimed the restaurants were using toxic chemicals to make the food. You get sent to court and decide to blame it on your kids to try and get away with it. You thereby lose contact with all of your family, go to prison for a year and that makes you realise that you haven’t really been making the choices yourself… the minute you get out of prison you hire a lawyer and get help with suing LIFEASIERtm. You end up winning the lawsuit and get back in touch with your family. You should never have made someone else do the choices for you… and you then decided it would be best to remove the LIFEASIER tm chip out of your brain."""],
            "actualAnswer5": 0,
        },
            "canMakeDecision": True,
            "isGameDone": False,
            "questionToAnswer": 1,
            "timeUntil": 0,
            "story": 1
        }

    return {"QA": {
            "question1": """Welcome to Anna’s first hard decision we need to solve for her
So Anna Is sort of having a crisis. Anna has been struggling a lot about planning the future recently and really wants to grow as an artist, but at the same time she could really use the money.


    """,
            "answer1": ["Go to art school", "Continue working at the souvenir shop"],
            "actualAnswer1": 0,
            "actualAnswerText1": ["""You decide to go straight to applying for art school in hopes of getting in but… YOU ACTUALLY GOT IN! Wow, I was not expecting that, your art sucks. You go straight to the bank to get loans for the school and look for a good place to stay. You go to the school and things are looking good until you realize that you’re in crippling debt because loans suck, but atleast school was fun. """,
                                  """You pick to continue working instead of going to art school which was probably for the best because who says you can’t apply next year when you actually have the money? You did that and are now living a great life in school with no stress over money or anything like that."""],
            "question2": """
Aaah yes, the magic of being 30, seeing everyone around you bloom, all your friends becoming parents and no one has time for you anymore. Beautiful, isn’t it ?
Anyway, 10 years have passed since Anna went to art school, she made it into multiple art communities and always has something going on. The only problem now is money. Artists and money are never a good idea especially when the artist collects action figures. She checked available jobs and saw one job that caught her eye.
“Help some guys in college make a video game”
She thought that it could be fun and it would be cool to collaborate with people, but another thought crossed your mind and that was NFTs. Anna recently saw a youtube video about NFT artists getting rich over a horrible stupid monkey drawing.

    """,
            "answer2": ["Start making and selling NFTs", "Help some guys in college make a video game"],
            "actualAnswer2": 0,
            "actualAnswerText2": ["""You went with making and selling NFTs and it might have just been the worst idea you’ve ever had. The stock market for all the NFTs crashed rapidly with thousands of people losing their money, including you. You really shouldn’t have bought those NFTs… Nor sell them, you became a really controversial artist and NFTs can be really bad for the environment. Selling NFTs is always a bad idea. """, """You decided to help some guys make a video game and you’re even getting well payed, which is a surprise! The only problem is that you already have a lot going on and your stress levels with deadlines are slowly killing you, but eh you’ll survive. Enjoy dah ca$h ;D … I’m sorry I don't know why I said that."""],
            "question3": """Another 10 years pass and Anna’s been doing alright but it feels like something is missing in your life. She  doesn't want a partner/lover cause that’s just a waste of time and it would mess up her artistic vision but still, she feels lonely. She currently lives alone with a cat and an AI friend on her computer. Anna has been thinking alot now that she is 40. She still feels like she’s 19 and her life is kinda of a blur so she really wants to do something to remember.
She’s been thinking of either moving to Germany or buying a studio space for artists to use with her. All she knows is that she could really use some friends before she turns into one of those cat grandmas. (no offense cat grandmas, we love you)
""",
            "answer3": ["Move to Germany", "Buy a studio space where she can work on stuff with people"],
            "actualAnswer3": 0,
            "actualAnswerText3": ["""Germany! The country you decided to move to! This was a great choice for your health and social life. You meet some great people in Germany and slowly become an icon in Germany. You might have lost some money from moving to Germany but hopefully you’ll get paid after some art shows here and there.""", """ Dude, did you forget that she lives in Iceland ? Renting is so expensive… Nah just kidding, you find a great studio place to make art in and a fresh start to meet new and diverse people.
You quickly get paid money for art you made and even art critics loved the pieces but… they for some reason criticized you as a person more than the pieces. They called you weird. People suck sometimes…
"""],
            "question4": """50 years. You’ve lived 50 years. That’s impressive. Alright let’s just get to the point.
You’re bored on a sunday and you’re getting old, you want to do stuff before you’re too old for it. You already have back pain and are starting to lose more and more hair, hecc, you’ve already gotten quite a lot of gray hair already.

    """,
            "answer4": [" Try bungee-jumping", "Try skiing"],
            "actualAnswer4": 0,
            "actualAnswerText4": [""" WEE! You chose bungee-jumping. You’re starting to get second choices as you’re standing in line on a bridge with a bunch of people. It’s your turn and you can’t help but shake looking down. You don’t want to do it anymore until the guy working there says he’ll give you 20$ if you jump. Dude hell yeah 20$? You decide to jump. It was scary at first but it was a crazy experience and you’re really happy you did it. You feel alive and got 20$ now.""", """Skiing seemed like a great idea!... until you went the wrong path and broke your leg. Now you gotta go to the hospital and spend money to fix your leg. """],
            "question5": """10 years later and it’s time for what might be the final question that LIFEASIERtm will help Anna with. All the chips that were put into all of those people’s brains only really seem to go to age 60, which is weird but eh whatever, just make this question count. Anna wants to leave a mark on this world. She’s afraid that she will be forgotten as soon as she dies and that is a thought she can’t handle. Two thoughts come to mind and those are to either run for president or write a life story.""",
            "answer5": ["Run for President", "Write a life story"],
            "actualAnswerText5": ["""You decide to run for president in the United States of America and what a success that idea was! You win 73% of the votes and people seem to love you as the president. You honestly have no idea how you won the election and you’re kinda worried because you know that you can barely take care of yourself. The first few days of being president are fun and when it comes to decision making there’s already a guy that has done it for you. Thank god, cause you really suck at making decisions. The government is a weird subject and you slowly start to realize that you aren’t in control. You never were.
THE END?""", """You get some paper and a pen and get right to writing a life story. You have a lot to write about and have a lot of decisions to do but in the end you did it. You finished your whole life story in 6months. You go to publishing houses and try to get them to approve the book, no one wants to publish it…until one company approves it!
The book was a major success, winning multiple awards, getting great reviews and being so good that it even gets turned into a movie. The book’s title is “how to not f**k up” and you think it really describes your life… after all, you’ve come this far.
THE END.
"""],
            "actualAnswer5": 0,
            },
            "canMakeDecision": True,
            "isGameDone": False,
            "questionToAnswer": 1,
            "timeUntil": 0,
            "story": 2
            }
    return dict


def getCurrentDate():
    return datetime.now()


def getScore(userStat):
    return round(113.11 * (int(userStat.health) + int(userStat.money)))


def getAllGameInfo(request):
    # TODO fix make sure has character works
    # Get character for the specific game

    # Get user stat for the game
    userStat = getUserStat(request)
    # If the user does not actually belong to a game
    if not userStat:
        return False
    else:
        # Get character, this returns two objects in a json, character and userStat of game
        try:
            userStatCharacter = (UserStatCharacter.objects.filter(
                userStat=userStat.id))[0]
        except:
            userStatCharacter = (UserStatCharacter.objects.filter(
                userStat=userStat.id))
            # If the user has a character
        if userStatCharacter:
            userStatCharacter = userStatCharacter.getJson()
            userStatCharacter['hasCharacter'] = True
            #
            return userStatCharacter
        # User has not selected a character for the game
        else:

            characters = Character.objects.get(
                id=userStat.getJson()['game']['story'])
            listOfChar = []

            # for y in characters:
            #     listOfChar.append(y.getJson())
            dict = {}
            dict['hasCharacter'] = False

            dict['character'] = characters.getJson()
            return dict


def getUserStat(request):
    userId = getUserId(request)
    user = User.objects.get(id=userId)
    try:
        # Order by descending order i.e. newest
        userStat = UserStat.objects.filter(
            user=user, isPlaying=True).order_by('-id')[0]
    except:
        return False

    return userStat


def getTimeBasedDecisionDict(decisionDict):
    pass


def getAnswer(decisionDict, userDecisions, amountOfQuestionsAnswered=1):

    listOfAnswer = ['actualAnswer1', 'actualAnswer2', 'actualAnswer3',
                    'actualAnswer4', 'actualAnswer5']
    for i in range(amountOfQuestionsAnswered):
        act = listOfAnswer[i]
        decisionDict['QA'][act] = userDecisions[i].getJson()[
            'choice']
    return decisionDict


def getDecision(userStat):

    # Get decisions made by the user for that game
    userDecisions = Decision.objects.filter(userStat=userStat.id)

    # Get the decision dict, already a default dictionary
    # that will be returned

    decisionDict = getDecisionDict(userStat.getJson()['game']['id'])

    if userDecisions:
        dec = userDecisions.last()
        dec = dec.getJson()
        timeDecisionMade = getTimeStamp(dec['timeDecisionMade']) + DECISIONTIME
        whenCanMake = getTimeStamp(datetime.now())
        timeUntilCanMakeDecision = timeDecisionMade - whenCanMake
        decisionDict['timeUntil'] = round(timeUntilCanMakeDecision)

        if decisionDict['timeUntil'] <= 0:
            print("User can make a decisio ")
            decisionDict['timeUntil'] = 0
        else:
            decisionDict['canMakeDecision'] = False
            decisionDict['questionToAnswer'] = 100
        if len(userDecisions) >= 5 or userStat.isDead:
            # One decision has been made
            decisionDict = getAnswer(
                decisionDict, userDecisions, len(userDecisions))
            decisionDict['canMakeDecision'] = False
            decisionDict['questionToAnswer'] = 100
            decisionDict['isGameDone'] = True
            if not userStat.isDead:
                userStat.didWin = True
                userStat.score = getScore(userStat)
                userStat.dayFinished = getCurrentDate()

                userStat.save()

        elif len(userDecisions) == 1:
            # One decision has been made
            decisionDict['questionToAnswer'] = 2
            decisionDict = getAnswer(decisionDict, userDecisions, 1)
        elif len(userDecisions) == 2:
            # One decision has been made
            decisionDict['questionToAnswer'] = 3
            decisionDict = getAnswer(decisionDict, userDecisions, 2)
        elif len(userDecisions) == 3:
            # One decision has been made
            print("tres ")
            decisionDict = getAnswer(decisionDict, userDecisions, 3)
            decisionDict['questionToAnswer'] = 4
        elif len(userDecisions) == 4:

            decisionDict = getAnswer(decisionDict, userDecisions, 4)
            # One decision has been made
            decisionDict['questionToAnswer'] = 5

    return decisionDict


def makeAllGamesInactive(request):
    userId = getUserId(request)
    user = User.objects.get(id=userId)
    userStats = UserStat.objects.filter(user=user, isPlaying=True)
    for userStat in userStats:
        userStat.isPlaying = False
        userStat.save()


def changeDecisionAnna(userStat, theDecision):
    choice = int(theDecision.choice)
    variHigh = randint(21, 29)
    variLow = randint(13, 18)
    if theDecision.question == 1:
        if choice <= 1:
            # Gain health from art school
            userStat.health = str(int(userStat.health) + variLow)
            # but lose a ton of money
            userStat.money = str(int(userStat.money) - variHigh)
        else:
            # Make money from working
            userStat.money = str(int(userStat.money) + (variHigh - 3))
            # No stress
            userStat.health = str(int(userStat.health) + (variLow - 3))

    elif theDecision.question == 2:
        if choice == 2:
            # Stress
            userStat.health = str(int(userStat.health) - variHigh)
            userStat.money = str(int(userStat.money) - variLow)
        else:
            # Dating and party
            userStat.money = str(int(userStat.money) + variHigh)
            # Mental health gain.. but
            userStat.health = str(int(userStat.health) - variHigh)
    elif theDecision.question == 3:
        if choice == 1:
            # Move to germany
            userStat.health = str(int(userStat.health) + variHigh)
            userStat.money = str(int(userStat.money) - variLow+10)
        else:
            # Money loss is greater
            userStat.money = str(int(userStat.money) - (variHigh + 15))
            # Health loss is greater
            userStat.health = str(int(userStat.health) - (variLow + 3))
    elif theDecision.question == 4:
        # Bungee jumping
        if choice == 1:
            outcome = randint(0, 50)
            userStat.health = str(int(userStat.health) + variHigh - 5)
            userStat.money = str(int(userStat.money) + 20)
        else:
            # Don't lose any money
            userStat.money = str(int(userStat.money) - 2)
            # Gain small amount of health from the relief
            userStat.health = str(int(userStat.health) - variLow + 25)
    elif theDecision.question == 5:
        # Final gut punch because you've gotten old
        if choice == 1:
            userStat.health = str(int(userStat.health) + variHigh)
            userStat.money = str(int(userStat.money) + variLow)
        else:

            userStat.money = str(int(userStat.money) + variHigh)
            userStat.health = str(int(userStat.health) + variLow)
    return userStat


def changeDecisionJoe(userStat, theDecision):
    choice = int(theDecision.choice)
    variHigh = randint(21, 29)
    variLow = randint(13, 18)
    if theDecision.question == 1:
        if choice <= 1:
            # Lose health
            userStat.health = str(int(userStat.health) - variHigh)
            # Lose money
            userStat.money = str(int(userStat.money) - variLow)
        else:
            # Make money from job
            userStat.money = str(int(userStat.money) + (variHigh - 3))
            # Health lose health from breaking hand
            userStat.health = str(int(userStat.health) - (variLow - 3))

    elif theDecision.question == 2:
        if choice == 2:
            # Turn health around
            userStat.health = str(int(userStat.health) - variHigh)
            userStat.money = str(int(userStat.money) + variLow)
        else:
            # Dating and party
            userStat.money = str(int(userStat.money) + variHigh)
            # Mental health gain.. but
            userStat.health = str(int(userStat.health) - variLow)
    elif theDecision.question == 3:
        if choice == 1:
            # lose small amount of health from working your ass off
            userStat.health = str(int(userStat.health) - variHigh)
            userStat.money = str(int(userStat.money) + variLow+10)
        else:
            # Money loss is greater
            userStat.money = str(int(userStat.money) - (variHigh + 15))
            # Health loss is greater
            userStat.health = str(int(userStat.health) - (variLow + 3))
    elif theDecision.question == 4:
        # GAMBLE IN CRYPTOCURRENCY
        if choice == 1:
            outcome = randint(0, 50)
            userStat.health = str(int(userStat.health) - variHigh)
            userStat.money = str(int(userStat.money) -
                                 (variLow+outcome))
        else:
            # Don't lose any money
            userStat.money = str(int(userStat.money) + 2)
            # Gain small amount of health from the relief
            userStat.health = str(int(userStat.health) + variLow)
    elif theDecision.question == 5:
        # Final gut punch because you've gotten old
        if choice == 1:
            userStat.health = str(int(userStat.health) - variHigh)
            userStat.money = str(int(userStat.money) - variLow)
        else:

            userStat.money = str(int(userStat.money) - variHigh)
            userStat.health = str(int(userStat.health) - variLow)
    return userStat


def decisionAffect(theDecision, userStat):

    choice = int(theDecision.choice)

    userStatJson = userStat.getJson()
    story = userStatJson['game']['story']
    if (story == 1):
        userStat = changeDecisionJoe(userStat, theDecision)
    elif (story == 2):
        userStat = changeDecisionAnna(userStat, theDecision)
    print("Here we go ")
    print("User stat ", userStatJson)
    if int(userStat.health) <= 0 or int(userStat.money) <= 0:
        userStat.isDead = True
        userStat.didWin = False
        userStat.isPlaying = False
        userStat.score = getScore(userStat)
        userStat.dayDeadOn = getCurrentDate()
        userStat.dayFinished = getCurrentDate()
    if int(userStat.money) < 0:
        userStat.money = 0
    if int(userStat.health) < 0:
        userStat.health = 0
    # Make a transaction
    print("User stat ", userStat)
    userStat.save()
    print("decision affected ", theDecision.getJson())


def sendRewardToEmail(email, userStat):
    if User.objects.filter(email=email).exists():
        user = User.objects.get(email=email)
        rewards = Reward.objects.filter(used=False)
        if rewards.exists():
            reward = rewards.last()
            rewardJson = reward.getJson()
            email_body = 'Hello, thank you for playing! \n Below you will find your code  \n' + \
                str(rewardJson['code'])

            data = {'email_body': email_body, 'to_email': user.email,
                    'email_subject': 'Free coffee card!'}

            Util.send_email(data)
            # Change the reward to used
            reward.used = True
            # Save the reward as used
            reward.save()
            try:
                rewardUser = Rewarduser(userStat=userStat, reward=reward)
                rewardUser.save()
            except:
                print("Failed to save who won")


class UserStatRippleAPIVIEW(generics.GenericAPIView):
    def __init__(self):
        pass

    # async def post(self, request):
    #     await asyncio.gather(makeTransaction())
    #     return JsonResponse({"hello": "lol"}, safe=False, content_type='application/json')

    def post(self, request):
        makeTransaction()
        return JsonResponse({"hello": "lol"}, safe=False, content_type='application/json')


class UserStatAPIVIEW(generics.GenericAPIView):
    def __init__(self):
        self.serialiser = 0

    @ permission_classes([IsAuthenticated])
    def get(self, request):
        # Always returns all the questions
        userStat = getUserStat(request)
        print("Userstattttt ", userStat)
        if not userStat:
            return JsonResponse({"error": "user not in an active game"}, safe=False, status=status.HTTP_403_FORBIDDEN,  content_type='application/json')
        info = getAllGameInfo(request)
        if not info['hasCharacter']:
            return JsonResponse({"error": "Does not have character"}, safe=False, status=status.HTTP_403_FORBIDDEN,  content_type='application/json')
        dict = getDecision(userStat)
        if dict['isGameDone']:
            if dict['questionToAnswer'] == 100:
                makeAllGamesInactive(request)
            return JsonResponse({"error": "user not in an active game"}, safe=False, status=status.HTTP_403_FORBIDDEN,  content_type='application/json')
        dict['game'] = userStat.getJson()
        return JsonResponse(dict, safe=False, content_type='application/json')

   #  @sync_to_async
    @ permission_classes([AllowAny])
    def post(self, request):

        userStat = getUserStat(request)
        # If the user is not in a game
        if not userStat:
            return JsonResponse({"error": "user not in an active game"}, safe=False, status=status.HTTP_403_FORBIDDEN,  content_type='application/json')
        info = getAllGameInfo(request)
        # If the user has no character
        if not info['hasCharacter']:
            return JsonResponse({"error": "Does not have character"}, safe=False, status=status.HTTP_403_FORBIDDEN,  content_type='application/json')
        # Get the choice made
        choice = request.data['choice']
        # Get all decisions made until nows

        dict = getDecision(userStat)
        if not dict:
            return JsonResponse({"error": "user not active"}, safe=False, status=status.HTTP_403_FORBIDDEN,  content_type='application/json')
        decision = Decision(userStat=userStat, choice=choice,
                            question=int(dict['questionToAnswer']))
        if dict['canMakeDecision'] and not dict['isGameDone'] and not userStat.isDead:
            decision.save()
            # makeTransaction()
            userStatJson = decisionAffect(decision, userStat)

        dict = getDecision(userStat)
        userStatJson = userStat.getJson()
        email = userStatJson['user']['email']
        # Send code to their email if they qualify
        if dict['isGameDone'] and not userStatJson['isDead']:
            if dict['questionToAnswer'] == 100:

                email = userStatJson['user']['email']
                # Send code to their email if they qualify
                sendRewardToEmail(email, userStat)

                makeAllGamesInactive(request)
        if userStatJson['isDead']:
            makeAllGamesInactive(request)

        dict['game'] = userStatJson
        return JsonResponse(dict, safe=False, status=status.HTTP_200_OK, content_type='application/json')


class UserStatHistoryAPIVIEW(generics.GenericAPIView):
    @ permission_classes([IsAuthenticated])
    def get(self, request):
        # Returns all completed games for the user
        # Always returns all the questions
        userId = getUserId(request)

        user = User.objects.get(id=userId)
        userStat = UserStat.objects.filter(user=user, isPlaying=False)
        userStatLis = []
        for stat in userStat:
            userStatJson = stat.getJson()

            userStatLis.append(userStatJson)
        return JsonResponse(userStatLis, safe=False, content_type='application/json')


class UserStatHistoryIndividualAPIVIEW(generics.GenericAPIView):
    @ permission_classes([IsAuthenticated])
    def get(self, request, gameId):
        # Returns a game the user participated in
        # Always returns all the questions
        userId = getUserId(request)
        user = User.objects.get(id=userId)

        try:
            game = Game.objects.get(id=gameId)
        except:
            return JsonResponse("Error: Game not found", safe=False,
                                status=status.HTTP_400_BAD_REQUEST, content_type='application/json')
        try:
            userStat = UserStat.objects.filter(
                user=user, isPlaying=False, game=game)
            lis = []
            for stat in userStat:
                statJson = stat.getJson()
                print("Works ")
                statJson['decisionStat'] = getDecision(stat)
                print("Works")
                lis.append(statJson)
        except:
            return JsonResponse("Error: User stat not found", safe=False,
                                status=status.HTTP_400_BAD_REQUEST, content_type='application/json')

        return JsonResponse(lis, safe=False, content_type='application/json')

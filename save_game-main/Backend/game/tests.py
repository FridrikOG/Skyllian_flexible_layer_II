from user.models import User
from .models import Game
from django.test import TestCase, SimpleTestCase, Client


class GameTestCase(SimpleTestCase):
    databases = "__all__"

    def setUp(self):
        """
        Necessary definition that need to exist before running all the defined tests
        :return:
        """
        # necessary for tearDown() to work
        self.user = {"id": 0}

        self.headers = ''

        # client-stub
        self.client = Client()

        # register (new user testing )
        self.login_uri = '/api/user/login/'
        self.register_uri = '/api/user/register/'
        self.logout_uri = '/api/user/logout/'
        self.update_uri = "/api/user/update/"

        self.getGame_uri = "/api/game/join/"

    def test_game(self):
        body = {
            "email": "test120@gmail.com",
            "password": "test1234",
            "password2": "test1234",
            "username": "test120",
            "firstname": "test12s",
            "lastname": "test12",
            "imgURL": "IMAGE_URL"
        }
        self.login_body = {
            "email": "test1234@gmail.com",
            "password": "test123456789"
        }

        # user_reg = self.client.post(self.register_uri, self.login_body)
        user_res = self.client.post(self.login_uri, self.login_body)
        self.user = user_res.data
        print("THE USER ITSELF ", self.user)
        bearer_token = self.user['tokens']['access']
        self.headers = {"Authorization": f"Bearer {bearer_token}"}

        game = self.client.get(self.getGame_uri, self.headers)
        game = game.data

        print("game DATA ", game)
        for y in game:
            self.assertEqual(False, game['isPlaying'])
            self.assertEqual(True, game['isJoinable'])
            self.assertEqual(False, game['isFinished'])

        print("Game ", game)

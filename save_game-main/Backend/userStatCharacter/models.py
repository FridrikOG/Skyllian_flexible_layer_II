from django.db import models
from userStat.models import UserStat
from game.models import Game
from character.models import Character
# from Character.models import Character
# Create your models here.


class UserStatCharacter(models.Model):
    userStat = models.ForeignKey(UserStat, on_delete=models.CASCADE)
    character = models.ForeignKey(Character, on_delete=models.CASCADE)

    def getJson(self):
        json = {
            "userStat": self.userStat.getJson(),
            "character": self.character.getJson()
        }
        return json

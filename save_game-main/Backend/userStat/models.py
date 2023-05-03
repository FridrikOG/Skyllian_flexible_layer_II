from django.db import models
from user.models import User
from game.models import Game
# Create your models here.
from datetime import datetime


def getTimeStamp(date):
    return datetime.timestamp(date)


class UserStat(models.Model):
    # User that made the decision
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # Game that the decision belongs to
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    health = models.CharField(max_length=20, default=100)
    money = models.CharField(max_length=20, default=100)
    dayDeadOn = models.DateField(
        null=True, blank=True)
    dayFinished = models.DateField(
        null=True, blank=True)
    position = models.CharField(max_length=20, default=0)
    isDead = models.BooleanField(null=True, blank=True, default=False)
    isPlaying = models.BooleanField(null=True, blank=True, default=True)
    didWin = models.BooleanField(null=True, blank=True)
    score = models.IntegerField(null=True, default=None)

    def getJson(self):
        # if self.dayDeadOn is not None:
        #     dayDead = getTimeStamp(self.dayDeadOn)
        # else:
        #     dayDead = self.dayDeadOn
        daydead = self.dayDeadOn
        json = {
            "id": self.id,
            "user": self.user.getJson(),
            "game": self.game.getJson(),
            "health": self.health,
            "money": self.money,
            "dayDeadOn": daydead,
            "position": self.position,
            "isDead": self.isDead,
            "isPlaying": self.isPlaying,
            "didWin": self.didWin,
            "score": self.score,
            "dayFinished" : self.dayFinished

        }
        return json

    def getMoney(self):
        return int(self.money)

    def getHealth(self):
        return int(self.health)

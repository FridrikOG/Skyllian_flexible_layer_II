from django.db import models
from userStat.models import UserStat
# Create your models here.
from datetime import date


class Decision(models.Model):
    userStat = models.ForeignKey(UserStat, on_delete=models.CASCADE)
    choice = models.IntegerField()
    timeDecisionMade = models.DateTimeField(auto_now=True)
    day = models.CharField(max_length=256, default='1')
    # Question number 1,2,3 etc.
    question = models.IntegerField()

    def getJson(self):
        return {
            "userStat": self.userStat.getJson(),
            "choice": self.choice,
            "timeDecisionMade": self.timeDecisionMade,
            "day": self.day,
            "question": self.question
        }

    def getTimeDecisionMade(self):
        return self.timeDecisionMade

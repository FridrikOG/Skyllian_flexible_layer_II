from django.db import models
from user.models import User
# Create your models here.
from datetime import date


class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    timeFeedbackCreated = models.DateTimeField(auto_now=True)
    description = models.CharField(max_length=500)

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

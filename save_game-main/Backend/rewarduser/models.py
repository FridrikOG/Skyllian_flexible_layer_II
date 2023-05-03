from django.db import models
from user.models import User
from userStat.models import UserStat
from reward.models import Reward
# Create your models here.


# Change this
class Rewarduser(models.Model):
    userStat = models.ForeignKey(UserStat, on_delete=models.CASCADE)
    reward = models.ForeignKey(Reward, on_delete=models.CASCADE)
    timeFeedbackCreated = models.DateTimeField(auto_now=True)

    def getJson(self):
        return {
            'code': self.code,
            'used': self.used
        }

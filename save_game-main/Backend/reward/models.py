from django.db import models

# Create your models here.


# Change this
class Reward(models.Model):
    code = models.CharField(max_length=200)
    used = models.BooleanField(default=False)

    def getJson(self):
        return {
            'code': self.code,
            'used': self.used
        }

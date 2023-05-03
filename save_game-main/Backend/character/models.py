from django.db import models

# Create your models here.
from django.db import models
# Create your models here.
from datetime import date


class Character(models.Model):
    name = models.CharField(max_length=256, default='silly')
    detail1 = models.CharField(max_length=1024, default='large')
    detail2 = models.CharField(max_length=1024, default='smoker')

    def getJson(self):
        return {
            'id': self.id,
            'name': self.name,
            'detail1': self.detail1,
            'detail2': self.detail2
        }

from django.db import models

# Create your models here.


#

# Change this
class Game(models.Model):
    name = models.CharField(max_length=60, default='Jeff')
    gameStartDate = models.DateTimeField()
    gameEndDate = models.DateTimeField()
    isJoinable = models.BooleanField(default=True)

    def getJson(self):
        if self.id <= 3:
            # This is Joe's game
            story = 1
        elif self.id > 3:
            # This is Anna's game
            print("Anna ")
            story = 2
        return {
            'id': self.id,
            'name': self.name,
            'gameStartDate': self.gameStartDate,
            'gameEndDate': self.gameEndDate,
            'isJoinable': self.isJoinable,
            'story': story
        }

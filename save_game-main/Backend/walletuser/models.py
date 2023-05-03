from django.db import models
# import crypto.models from crypto
# Create your models here.
from user.models import User

# This is the type of cryptocurrency we are using


class Walletuser(models.Model):
    # Bitcoin
    address = models.CharField(max_length=1024)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(
        null=True, blank=True)

import datetime
from os import stat
from random import randint

# Save game algo
health = 100
money = 100


class Save():
    def __init__(self):
        self.money = 100
        self.health = 100
        self.round = 0

    def logic_three_leans(self):

        # 3 levels
        # leaning money loss, even split, leaning health loss
        # Runs 5 time
        for i in range(0, 5):
            leaning = randint(0, 2)
            # leaning money loss
            if leaning == 0:
                pivotMoney = randint(24, 32)
                pivotHealth = randint(8, 16)
                choice = randint(0, 1)
            # no lean
            elif leaning == 1:
                pivotMoney = randint(16, 22)
                pivotHealth = randint(16, 22)
                choice = randint(0, 1)
            # lean health loss
            else:
                pivotMoney = randint(8, 16)
                pivotHealth = randint(24, 32)
                choice = randint(0, 1)
            if self.money > 0 and self.health > 0:
                self.round += 1

                self.money -= pivotMoney
                self.health -= pivotHealth
            else:
                return

    # The logic we are sticking with
    def logic_two_leans(self):

        # 2 leans
        # leaning money loss, leaning health loss
        # Runs 5 time
        for i in range(0, 5):
            leaning = randint(0, 1)
            # leaning money loss
            if leaning == 0:
                pivotMoney = randint(24, 32)
                pivotHealth = randint(8, 16)
                choice = randint(0, 1)
            # lean health loss
            else:
                pivotMoney = randint(8, 16)
                pivotHealth = randint(24, 32)
                choice = randint(0, 1)
            if self.money > 0 and self.health > 0:
                self.round += 1

                self.money -= pivotMoney
                self.health -= pivotHealth
            else:
                return

    def createAverageRun(self):
        countLoss = 0
        moneyLis = []
        healthLis = []
        roundLis = []

        for i in range(0, 10000):
            countLoss += 1
            self.logic_two_leans()
            moneyLis.append(self.money)
            healthLis.append(self.health)
            roundLis.append(self.round)
            self.wipeStats()
        return moneyLis, healthLis, roundLis

    def generateReport(self):
        moneyLis, healthLis, roundLis = self.createAverageRun()
        print("Average money", sum(moneyLis)/len(moneyLis))
        print("Average health ", sum(healthLis)/len(healthLis))
        print("Average round ", sum(roundLis)/len(roundLis))

        amountFives = roundLis.count(5)
        print("Amount 5's ", amountFives)
        print("Percentage of survivors ", amountFives/100)
        # print("remaining money ", self.money)
        # print("remaining health ", self.health)
        # print("Made it to round ", self.round)

    def wipeStats(self):
        self.money = 100
        self.health = 100
        self.round = 0


kek = datetime.date.today()
print("Here ", kek)

stat = Save()
stat.generateReport()

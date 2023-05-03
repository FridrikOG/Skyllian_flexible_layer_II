
# Code executes when a specified condition is met.
def printme():
    print("Yes we love to be alive")
    
def oneplustwo():
    return 1 + 2

def twoplustwo():
    return 2 + 2
def printme():
    print("Yes we love to be alive")
    
def print_two_variables(params = None):
    if not params:
        raise Exception("Params necessary")
    if len(params) != 2:
        raise Exception("Params have to be at least 2")
    var1 = params[0]
    var2 = params[1]
    return var1 + var2


def multiply(one, two):
    return one * two

def add(one, two):
    return one + two
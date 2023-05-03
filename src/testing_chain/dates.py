from datetime import datetime, timedelta


def get_date_by_delta(frmt='%Y-%m-%d', string=True, time_delta = 0):
    '''
    frmt : specifies the format you want the date to be returned in
    string: specifies if you want a string to be returned or datetime format
    time_delta  timedelta 1 is yesterday, 0 is today, and -1 time_delta is tomorrow
    '''
    yesterday = datetime.now() - timedelta(time_delta)
    if string:
        return yesterday.strftime(frmt)
    return yesterday


def get_yesterday(frmt='%Y-%m-%d', string=True):
    ''' Get yesterday'''
    yesterday = datetime.now() - timedelta(1)
    if string:
        return yesterday.strftime(frmt)
    return yesterday

def get_ereyesterday(frmt='%Y-%m-%d', string=True):
    ''' Get the day before yesterday'''
    yesterday = datetime.now() - timedelta(2)
    if string:
        return yesterday.strftime(frmt)
    return yesterday

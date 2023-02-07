from os import environ
from pymongo import MongoClient
from http import HTTPStatus
from datetime import datetime, timezone, timedelta
import jwt


SECRET_KEY = environ['SECRET_KEY']
MONGO_CONNECTION_STRING = environ['MONGO_CONNECTION_STRING']

def main(args):
    headers = {'Content-Type': 'application/json'}
    username = args.get('username')
    password = args.get('password')
    if username is None or password is None:
        return {
            'statusCode': HTTPStatus.BAD_REQUEST,
            'headers': headers,
            'body': {
                "result": "no credentials",
            }
        }

    client = MongoClient(MONGO_CONNECTION_STRING, connectTimeoutMS=200)
    database = client.get_database('diplomantky')
    users = database.get_collection('users')

    user = users.find_one({'username': username}, max_time_ms=100)
    if user is None:
        return {
            'statusCode': HTTPStatus.BAD_REQUEST,
            'headers': headers,
            'body': {
                "result": "user does not exist",
            }
        }

    if password != user.get('password'):
        return {
            'statusCode': HTTPStatus.BAD_REQUEST,
            'headers': headers,
            'body': {
                "result": "wrong password",
            }
        }

    data = {
        'username': username,
        "exp": datetime.now(tz=timezone.utc) + timedelta(days=30),
    }
    token = jwt.encode(data, SECRET_KEY, algorithm='HS256')

    return {
        'statusCode': HTTPStatus.OK,
        'headers': headers,
        'body': {
            "result": "ok",
            "token": token,
        }
    }


    #claims = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])

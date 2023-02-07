from os import environ
from pymongo import MongoClient
from http import HTTPStatus
from datetime import datetime, timezone, timedelta
import jwt


SECRET_KEY = environ['SECRET_KEY']
MONGO_CONNECTION_STRING = environ['MONGO_CONNECTION_STRING']

def main(args):
    response = {
        'statusCode': HTTPStatus.BAD_REQUEST,
        'headers': {'Content-Type': 'application/json'},
        'body': {},
    }
    username = args.get('username')
    password = args.get('password')
    if username is None or password is None:
        response['body'] = {"result": "no credentials"}
        return response

    client = MongoClient(MONGO_CONNECTION_STRING, connectTimeoutMS=200)
    database = client.get_database('diplomantky')
    users = database.get_collection('users')

    user = users.find_one({'username': username}, max_time_ms=100)
    if user is None:
        response['body'] = {"result": "user does not exist"}
        return response

    if password != user.get('password'):
        response['body'] = {"result": "wrong credentials"}
        return response

    data = {
        'username': username,
        "exp": datetime.now(tz=timezone.utc) + timedelta(days=30),
    }
    token = jwt.encode(data, SECRET_KEY, 'HS256')

    response['body'] = {"result": "ok", "token": token}
    response['statusCode'] = HTTPStatus.OK
    return response

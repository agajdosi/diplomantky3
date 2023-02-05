from os import environ
from pymongo import MongoClient
from http import HTTPStatus

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

    db = get_database()
    users = db.get_collection('users')

    print("finding one")
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

    return {
        'statusCode': HTTPStatus.OK,
        'headers': headers,
        'body': {
            "result": "fakin ok",
        }
    }


def get_database():
    MONGO_CONNECTION_STRING = environ.get('MONGO_CONNECTION_STRING')
    if MONGO_CONNECTION_STRING is None:
        raise Exception('MONGO_CONNECTION_STRING is not set')
    client = MongoClient(MONGO_CONNECTION_STRING)
    return client['diplomantky']


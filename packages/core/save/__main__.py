from os import environ
from pymongo import MongoClient
from http import HTTPStatus
import jwt


SECRET_KEY = environ['SECRET_KEY']
MONGO_CONNECTION_STRING = environ['MONGO_CONNECTION_STRING']

def main(args):
    headers = {'Content-Type': 'application/json'}
    token = args.get('token')
    if token is None:
        return {
            'statusCode': HTTPStatus.BAD_REQUEST,
            'headers': headers,
            'body': {
                "result": "no token",
            }
        }

    try:
        claims = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    except Exception as e:
        print(e)
        return {
            'statusCode': HTTPStatus.BAD_REQUEST,
            'headers': headers,
            'body': {
                "result": "invalid token",
            }
        }
    
    print(f'claims: {claims}')
    
    return {
        'statusCode': HTTPStatus.OK,
        'headers': headers,
        'body': {
            "result": "token ok",
        }
    }
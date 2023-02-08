from os import environ
from http import HTTPStatus
import jwt


SECRET_KEY = environ['SECRET_KEY']
MONGO_CONNECTION_STRING = environ['MONGO_CONNECTION_STRING']


def main(args):
    response = {
        'statusCode': HTTPStatus.BAD_REQUEST,
        'headers': {'Content-Type': 'application/json'},
        'body': {},
    }

    token = args.get('token')
    if token is None:
        response['body'] = {"result": "no token"}
        return response

    try:
        options = {"require": ["exp"]}
        claims = jwt.decode(token, SECRET_KEY, algorithms=['HS256'], options=options)
    except jwt.exceptions.ExpiredSignatureError as e:
        response['body'] = {"result": "token expired", "message": str(e)}
        return response
    except jwt.exceptions.InvalidTokenError as e:
        response['body'] = {"result": "invalid token", "message": str(e)}
        return response  
    except Exception as e:
        response['body'] = {"result": "token error", "message": str(e)}
        return response

    username = claims.get('username')
    if username is None:
        response['body'] = {"result": "missing username in token"}
        return response
    
    ok = save()
    if not ok:
        response['body'] = {"result": "save failed"}
        return response

    response['statusCode'] = HTTPStatus.OK
    response['body'] = {"result": "ok"}
    return response

def save():
    """Here we will save the data."""
    return True

from os import environ
from http import HTTPStatus
from datetime import datetime, timezone, timedelta
import jwt
from pyairtable import api
from pyairtable.formulas import match

SECRET_KEY = environ["SECRET_KEY"]
AIRTABLE_TOKEN = environ["AIRTABLE_TOKEN"]
AIRTABLE_APP_ID = environ["AIRTABLE_APP_ID"]
AIRTABLE_TABLE_NAME = "users"

def main(args):
    response = {
        "statusCode": HTTPStatus.BAD_REQUEST,
        "headers": {"Content-Type": "application/json"},
        "body": {},
    }
    username = args.get("username")
    password = args.get("password")
    if username is None or password is None:
        response["body"] = {"result": "no credentials"}
        return response

    # Create a Table instance
    table = api.Table(AIRTABLE_TOKEN, AIRTABLE_APP_ID, AIRTABLE_TABLE_NAME)

    # Fetch user data from Airtable
    formula = match({"username": username})
    user = table.first(formula=formula)
    if user is None:
        response["body"] = {"result": "wrong credentials - user not found"}
        return response

    fields = user.get("fields")
    if fields is None:
        response["body"] = {"result": "wrong credentials - fields not found"}
        return response

    db_password = fields.get("password")
    if db_password is None:
        response["body"] = {"result": "wrong credentials - db_password not found"}
        return response

    if password != db_password:
        response["body"] = {"result": "wrong credentials - passwords does not match"}
        return response

    user_role = fields.get("role", "user")
    redirect_url = fields.get("url")

    data = {
        "username": username,
        "exp": datetime.now(tz=timezone.utc) + timedelta(days=30),
    }
    token = jwt.encode(data, SECRET_KEY, "HS256")
    response["statusCode"] = HTTPStatus.OK
    response["body"] = {
        "result": "ok",
        "token": token,
        "loggedAs": username,
        "userRole": user_role,
        "redirectUrl": redirect_url,
    }
    return response

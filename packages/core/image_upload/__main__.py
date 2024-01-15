from os import environ
from http import HTTPStatus
from jwt import decode, exceptions
from requests import put
import uuid


ORG = "agajdosi"
REPO = "diplomantky3"
SECRET_KEY = environ["SECRET_KEY"]
GH_TOKEN = environ["GH_TOKEN"]
SPLITTER = "<!-- SECTION BREAK -->"


def main(args):
    response = {
        "statusCode": HTTPStatus.BAD_REQUEST,
        "headers": {"Content-Type": "application/json"},
        "body": {},
    }

    token = args.get("token")
    if token is None:
        response["body"] = {"result": "no token"}
        return response
    try:
        options = {"require": ["exp"]}
        claims = decode(token, SECRET_KEY, algorithms=["HS256"], options=options)
    except exceptions.ExpiredSignatureError as e:
        response["body"] = {"result": "token expired", "message": str(e)}
        return response
    except exceptions.InvalidTokenError as e:
        response["body"] = {"result": "invalid token", "message": str(e)}
        return response
    except Exception as e:
        response["body"] = {"result": "token error", "message": str(e)}
        return response

    username = claims.get("username")
    if username is None:
        response["body"] = {"result": "missing username in token"}
        return response

    source_dir = args.get("source_dir")
    if source_dir is None:
        response["body"] = {"result": "no source_dir"}
        return response
    
    filename = args.get("filename")
    if filename is None:
        response["body"] = {"result": "no filename"}
        return response

    base64_img = args.get("blob")
    if base64_img is None:
        response["body"] = {
            "result": "no image content",
            }
        return response

    prepend = uuid.uuid4()
    filename = f"{prepend}_{filename}"   
    try:
        ok, message = upload_image(base64_img, username, f"{source_dir}{filename}")
    except Exception as e:
        response["body"] = {
            "result": "error while uploading image",
            "message": str(e),
            }
        return response
    if not ok:
        response["body"] = {
            "result": "upload failed",
            "message": message,
            }
        return response

    public_url = "https://raw.githubusercontent.com/agajdosi/diplomantky3/main/web/content"
    location = f"{public_url}/{source_dir}{filename}"
    response["statusCode"] = HTTPStatus.OK
    response["body"] = {
        "result": "ok",
        "location": location,
        }
    return response


def upload_image(img_data, username, location):
    url = f"https://api.github.com/repos/{ORG}/{REPO}/contents/web/content/{location}"
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {GH_TOKEN}",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    data = {
        "message": f"{username} uploading {location}",
        "committer": {
            "name": "Fakulta Vytvarna",
            "email": "andreas.gajdosik+diplomantkycz@gmail.com",
        },
        "content": img_data,
    }

    resp = put(url, headers=headers, json=data)
    if resp.status_code not in (200,201):
        return False, f"POST file update failed ({resp.status_code}): {resp.text}"
    return True, "ok"

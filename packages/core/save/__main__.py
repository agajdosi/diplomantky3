from os import environ
from http import HTTPStatus
from jwt import decode, exceptions
from requests import get, put
from base64 import b64encode
from hashlib import sha1


ORG = 'agajdosi'
REPO = 'diplomantky3'
SECRET_KEY = environ['SECRET_KEY']
MONGO_CONNECTION_STRING = environ['MONGO_CONNECTION_STRING']
GH_TOKEN = environ['GH_TOKEN']

def main(args):
    response = {
        'statusCode': HTTPStatus.BAD_REQUEST,
        'headers': {'Content-Type': 'application/json'},
        'body': {},
    }
    token = args.get('token')
    content = args.get('content')
    if token is None:
        response['body'] = {"result": "no token"}
        return response
    if content is None:
        response['body'] = {"result": "no content"}
        return response

    try:
        options = {"require": ["exp"]}
        claims = decode(token, SECRET_KEY, algorithms=['HS256'], options=options)
    except exceptions.ExpiredSignatureError as e:
        response['body'] = {"result": "token expired", "message": str(e)}
        return response
    except exceptions.InvalidTokenError as e:
        response['body'] = {"result": "invalid token", "message": str(e)}
        return response  
    except Exception as e:
        response['body'] = {"result": "token error", "message": str(e)}
        return response

    username = claims.get('username')
    if username is None:
        response['body'] = {"result": "missing username in token"}
        return response

    ok, msg = save(content)
    if not ok:
        response['body'] = {"result": "save failed", "message": msg}
        return response

    response['statusCode'] = HTTPStatus.OK
    response['body'] = {"result": "ok"}
    return response

def githash(data: bytes) -> str:
    """Unused right now. Compute the git hash of a blob of data. 
    Call like:  sha = githash(prev_string.encode('utf-8'))
    """
    s = sha1()
    s.update((f"blob {len(data)}\0").encode('utf-8'))
    s.update(data)
    return s.hexdigest()

def save(content:str):
    """Here we will save the data."""
    year = "2020"
    surname = "gajdosik"
    url = f"https://api.github.com/repos/{ORG}/{REPO}/contents/web/content/{year}/{surname}/{surname}.md"
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {GH_TOKEN}",
        "X-GitHub-Api-Version": "2022-11-28",
        }
  
    resp = get(url, headers=headers)
    if resp.status_code != 200:
        return False, f"GET file failed: {resp.text}"
    
    try:
        data = resp.json()
    except Exception as e:
        return False, str(e)

    prev_sha = data.get('sha')
    if prev_sha is None:
        return False, "Missing previous SHA"
    
    file = f"""---
title: "Andreas Gajdosik"
date: 2020-08-17T15:02:56+02:00
description: "Série vypráví fragmenty příběhů odehrávajících se v kulisách romantických fantasy scenerií a kombinovaných se současnými subkulturními a volnočasovými motivy."
draft: false
url: "andreas-gajdosik"
owner: "xvgajdosik"

name: "Andreas"
surname: "Gajdosik"
artwork: "You Must Gather Your Party Before Venturing Forth"
medium: "olejomalba na plátně"
dimensions: ""
year: "{year}"
study: "mga"
location: "kanal"
---
{{{{< raw_html >}}}}
{content}
{{{{< /raw_html >}}}}
"""

    byte_file = bytes(file, 'utf-8')
    encoded_file = b64encode(byte_file).decode('utf-8')

    data = {
        "message":"update",
        "committer": {
            "name":"Fakulta Vytvarna",
            "email":"andreas.gajdosik+diplomantkycz@gmail.com",
            },
        "content": encoded_file,
        "sha": prev_sha,
        }


    resp = put(url, headers=headers, json=data)
    if resp.status_code != 200:
        return False, f"POST file update failed: {resp.text}"

    return True, "ok"


#year = "2020"
#surname = "gajdosik"    
#content = "lololo"
#results = save(content, year, surname)
#print(results)


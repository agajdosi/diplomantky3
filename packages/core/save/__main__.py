from os import environ
from http import HTTPStatus
from jwt import decode, exceptions
from requests import get, put
from base64 import b64encode, b64decode
from hashlib import sha1
from collections import OrderedDict


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
    sourceFilePath = args.get('sourceFile')
    if token is None:
        response['body'] = {"result": "no token"}
        return response
    if content is None:
        response['body'] = {"result": "no content"}
        return response
    if sourceFilePath is None:
        response['body'] = {"result": "no sourceFilePath"}
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

    ok, msg = save(sourceFilePath, content, username)
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


def save(sourceFilePath: str, content: str, username: str):
    """Here we will save the data."""
    url = f"https://api.github.com/repos/{ORG}/{REPO}/contents/web/content/{sourceFilePath}"
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
    data = data.get('content')
    if prev_sha is None:
        return False, "Missing previous SHA"
    if data is None:
        return False, "Missing content"

    prev_content = b64decode(data).decode('utf-8')
    metadata = parseMarkdownMetadata(prev_content)
    owner = metadata.get('owner')
    if owner != username:
        return False, f"Authenticated user is not owner of this file: {username} != {owner}"

    result = "---\n"
    for key, value in metadata.items():
        result += f"{key}: {value}\n"
    result += "---\n"
    result += "{{< raw_html >}}\n"
    result += content + "\n"
    result += "{{< /raw_html >}}\n"

    byte_result = bytes(result, 'utf-8')
    encoded_file = b64encode(byte_result).decode('utf-8')
    data = {
        "message":f"{username} updating {sourceFilePath}",
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


def parseMarkdownMetadata(content: str):
    """Parse the metadata from the markdown string."""
    heading = content.split("---", 2)[1].strip()
    lines = heading.splitlines()
    metadata = OrderedDict()
    for line in lines:
        parts = line.split(": ")
        if len(parts) != 2:
            continue
        key = parts[0].strip()
        value = parts[1].strip()
        metadata[key] = value
    return metadata

#ok, results = save("2020/gajdosik/gajdosik.md", "dasdad", '"xvgajdosik"')
#print(results)


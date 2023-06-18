from os import environ
from http import HTTPStatus
from jwt import decode, exceptions
from requests import get, put
from base64 import b64encode, b64decode
from hashlib import sha1
from collections import OrderedDict
from pymongo import MongoClient


ORG = "agajdosi"
REPO = "diplomantky3"
SECRET_KEY = environ["SECRET_KEY"]
MONGO_CONNECTION_STRING = environ["MONGO_CONNECTION_STRING"]
GH_TOKEN = environ["GH_TOKEN"]
SPLITTER = "<!-- SECTION BREAK -->"


def main(args):
    response = {
        "statusCode": HTTPStatus.BAD_REQUEST,
        "headers": {"Content-Type": "application/json"},
        "body": {},
    }
    token = args.get("token")
    content = args.get("content")
    sourceFilePath = args.get("sourceFile")
    if token is None:
        response["body"] = {"result": "no token"}
        return response
    if content is None:
        response["body"] = {"result": "no content"}
        return response
    if sourceFilePath is None:
        response["body"] = {"result": "no sourceFilePath"}
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

    ok, msg = save(sourceFilePath, content, username, artwork=args.get("artwork"))
    if not ok:
        response["body"] = {"result": "save failed", "message": msg}
        return response

    response["statusCode"] = HTTPStatus.OK
    response["body"] = {"result": "ok"}
    return response


def githash(data: bytes) -> str:
    """Unused right now. Compute the git hash of a blob of data.
    Call like:  sha = githash(prev_string.encode('utf-8'))
    """
    s = sha1()
    s.update((f"blob {len(data)}\0").encode("utf-8"))
    s.update(data)
    return s.hexdigest()


def verifyAdmin(username: str) -> bool:
    client = MongoClient(MONGO_CONNECTION_STRING, connectTimeoutMS=200)
    database = client.get_database("diplomantky")
    users = database.get_collection("users")
    user = users.find_one({"username": username})
    if user is None:
        return False
    if user.get("role") != "admin":
        return False
    return True


def save(sourceFilePath: str, bio: str, username: str, artwork: str):
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

    prev_sha = data.get("sha")
    data = data.get("content")
    if prev_sha is None:
        return False, "Missing previous SHA"
    if data is None:
        return False, "Missing content"

    text = b64decode(data).decode("utf-8")
    header, content = separate_header_content(text)
    if header is None or content is None:
        return False, f"Could not separate header and content from: {text}"

    metadata = parse_markdown_metadata(header)
    owner = metadata.get("owner")
    if owner != username:
        if not verifyAdmin(username):
            return (
                False,
                f"Authenticated user is not admin or owner of this file: {username} != {owner}",
            )

    content_parts = content.split(SPLITTER)
    if len(content_parts) != 2:
        return False, f"Could not split by {SPLITTER} in content: {content}"
    
    if bio == None:
        bio = content_parts[0]
    
    if artwork == None:
        artwork = content_parts[1]

    final_file = f"""---
{header}
---
{{{{< raw_html >}}}}
{bio}
{{{{< /raw_html >\}}}}
{SPLITTER}
{artwork}
"""
    byte_result = bytes(final_file, "utf-8")
    encoded_file = b64encode(byte_result).decode("utf-8")
    data = {
        "message": f"{username} updating {sourceFilePath}",
        "committer": {
            "name": "Fakulta Vytvarna",
            "email": "andreas.gajdosik+diplomantkycz@gmail.com",
        },
        "content": encoded_file,
        "sha": prev_sha,
    }

    resp = put(url, headers=headers, json=data)
    if resp.status_code != 200:
        return False, f"POST file update failed: {resp.text}"
    return True, "ok"


def separate_header_content(text: str):
    """Separate header and content from the text of the .md file."""
    delimiter = "---"
    parts = text.split(delimiter)
    if len(parts) != 3:
        return None, None
    header = parts[1].strip()
    content = parts[2].strip()
    return header, content


def parse_markdown_metadata(header: str) -> OrderedDict:
    """Parse the metadata from the markdown string."""
    lines = header.splitlines()
    metadata = OrderedDict()
    for line in lines:
        parts = line.split(": ")
        if len(parts) != 2:
            continue
        key = parts[0].strip()
        value = parts[1].strip()
        metadata[key] = value
    return metadata

"""PoC script for commiting a file to a repo using the GitHub API v3.
TODO: allow update of file by implementing sha of the current file version
"""


import requests
import base64
from os import environ



GH_TOKEN = environ['GH_TOKEN']

headers = {
    "Accept": "application/vnd.github+json",
    "Authorization": f"Bearer {GH_TOKEN}",
    "X-GitHub-Api-Version": "2022-11-28",
    }


url = "https://api.github.com/repos/agajdosi/diplomantky3/contents/.do/hello.md"


content = base64.b64encode(bytes('Hele oprava, Ahoj svete!', 'utf-8')).decode('utf-8')

data = {
    "message":"my another message",
    "committer": {
        "name":"Andreas Gajdosik",
        "email":"andreas@gajdosik.org",
        },
    "content": content,
    }


resp = requests.put(url, headers=headers, json=data)
print(resp.status_code, resp.text)


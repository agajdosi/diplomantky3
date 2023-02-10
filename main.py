"""PoC script for updating a file in a repo using the GitHub API v3.
It can confirm by calculating sha without need to download it from GH.
"""


import requests
import base64
from os import environ
from hashlib import sha1


GH_TOKEN = environ['GH_TOKEN']


def githash(data):
    s = sha1()
    s.update((f"blob {len(data)}\0").encode('utf-8'))
    s.update(data)
    return s.hexdigest()


headers = {
    "Accept": "application/vnd.github+json",
    "Authorization": f"Bearer {GH_TOKEN}",
    "X-GitHub-Api-Version": "2022-11-28",
    }


url = "https://api.github.com/repos/agajdosi/diplomantky3/contents/.do/hello-new.md"


prev_string = "HELLO NEW WORLD!"
sha = githash(prev_string.encode('utf-8'))

new_string = "HELLO VERY NEW WORLD!"
bytes = base64.b64encode(bytes(new_string, 'utf-8'))
content = bytes.decode('utf-8')

data = {
    "message":"my another message",
    "committer": {
        "name":"Andreas Gajdosik",
        "email":"andreas@gajdosik.org",
        },
    "content": content,
    "sha": sha,
    }


resp = requests.put(url, headers=headers, json=data)
print(resp.status_code, resp.text)


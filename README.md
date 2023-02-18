## Structure

- `./packages`: contains functions
- `./web`: source files for Hugo generator
- `./web/build`: output file with built HTMLs - this gets uploaded into spaces


## Developing function

Functions are stored at `packages/<packaga_name>/<function_name>`.

Build the functions: `doctl serverless deploy . --remote-build`
Warning: use the `--remote-build` flag as otherwise the dependencies will not be installed properly.


get URL of function: `doctl sls fn get core/login --url`  
run function: `doctl serverless functions invoke core/login`


```json
{
  "__ow_headers": {
    "accept": "*/*",
    "accept-encoding": "gzip",
    "cdn-loop": "cloudflare",
    "cf-connecting-ip": "123.123.123.123",
    "cf-ipcountry": "US",
    "cf-ray": "someidhere-SOF",
    "cf-visitor": "{\"scheme\":\"https\"}",
    "content-type": "application/json",
    "host": "ccontroller",
    "user-agent": "curl/7.79.1",
    "x-forwarded-for": "123.123.123.123",
    "x-forwarded-proto": "https",
    "x-request-id": "some_request_here"
  },
  "__ow_method": "post",
  "__ow_path": "",
  "name": "Bobby"
}
```

## CONFIGURATION

### project.yml

Pomoci neho asi DO pozna, ze jde o repo s funkcema, ale dost mozna pozdeji uz nebude treba?

### .do/app.yaml

Tohle je app-spec, ktery urcuje, jak bude appka deploynute poprve.
Dal ale nema zadnej vliv AFAIK.

```
doct auth init
doctl apps list
doctl apps spec get 3adf38e8-ed0c-418f-9a57-53be79f3dacb


doctl apps spec validate .do/app.yaml
doctl apps update --spec .do/app.yaml 3adf38e8-ed0c-418f-9a57-53be79f3dacb
```

# HOW TO

```
cd web
hugo serve
```

## Zmena portfolia - perspektiva diplomantky
1. diplomantka klikne na LOGIN na homepage a logne se
2. uspesne lognuti ji presmeruje na jeji profil
3. v momente, kdy je uzivatelka prihlasena, tak se na profilu zobrazi tlacitko EDIT
4. pri kliku na EDIT se portfolio nacte do editoru, objevi se tlacitko PREVIEW
5. pri kliku na PREVIEW skryje editor a zobrazi se portfolio, nyni je moznost dat SAVE anebo opet EDIT
6. pri kliku na SAVE se vse ulozi, hotovo!


### Nevyhody
- portfolio se uklada na Github, trva to asi 2-5 minut, nez se to zmeni na webu (po refreshi, musime to zminit)

### TODO
- zatim neni funkce na nahrani obrazku
- zatim neni moznost editovat Nazev dila, description (zobrazuje se v title a v preview na FB)
- zatim neni moznost editovat URL a dalsi metadata
- zatim neni moznost zmenit heslo, zmenit email

## Pridani rocniku - perspektiva admina
Zatim to nejde pres webove rozhrani, ale jde to pres CLI - pocita se s ucasti Andrease, ktery to bude delat.
Nemelo by to zabrat dele nez 30 minut.


## Administrator perspective


# NERD STUFF

## Structure

- `./packages`: contains functions
- `./web`: source files for Hugo generator
- `./web/build`: output file with built HTMLs - this gets uploaded into spaces



## CONFIGURATION

### project.yml

Pomoci neho asi DO pozna, ze jde o repo s funkcema, ale dost mozna pozdeji uz nebude treba?

### .do/app.yaml

Tohle je app-spec, ktery urcuje, jak bude appka deploynute poprve.
Dal ale nema zadnej vliv AFAIK.

```
doctl auth init
doctl apps list
doctl apps spec get 3adf38e8-ed0c-418f-9a57-53be79f3dacb


doctl apps spec validate .do/app.yaml
doctl apps update --spec .do/app.yaml 3adf38e8-ed0c-418f-9a57-53be79f3dacb
```

## Developing function

Provide env variables in `.env` file.
Functions are stored at `packages/<packaga_name>/<function_name>`.

### Build the functions
Build the functions: `doctl serverless deploy . --remote-build`
Warning: use the `--remote-build` flag as otherwise the dependencies will not be installed properly.


### Try functions
Get URL of function: `doctl sls fn get core/login --url`.
Paste this into `web/config/development/params.yaml` so that Hugo can use it.

To run function: `doctl serverless functions invoke core/login`.


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
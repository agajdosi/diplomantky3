


### project.yml

Pomoci neho asi DO pozna, ze jde o repo s funkcema, ale dost mozna pozdeji uz nebude treba?


### .do/app.yaml

Tohle je app-spec, ktery urcuje, jak bude appka deploynute poprve.
Dal ale nema zadnej vliv AFAIK.

```
doct auth init
doctl apps list
doctl apps spec get 3adf38e8-ed0c-418f-9a57-53be79f3dacb


doctl apps spec validate app-spec.yaml
doctl apps update --spec app-spec.yaml
```

const environments = [
    {
        "id": "local",
        "label": "Local",
        "url": "http://formio.lodev.xyz",
        "description": "local development environment",
        "service": {
            "formio": {
                "username": "me@lodev.xyz",
                "password": "secret"
            },
            "keycloak" : {
                "tokenUrl" : "http://keycloak.lodev.xyz/auth/realms/dev/protocol/openid-connect/token",
                "clientId": "service-account",
                "secret" : "ed041195-fdf8-424b-a061-2081ea5067f1",
            }
        },
        "editable": true,
        "promotion-preconditions": [

        ],
        "variable-replacements" : [
            {
              "{$.environmentContext.platformDataUrl}" : "http://www.google.co.uk"
            },
            {
                "{$.staffDetailsContext.staffId}" : "{{guid}}"
            },
            {
                "{$.keycloakContext.givenName}" : "{{firstName}}"
            },
            {
                "{$.keycloakContext.familyName}" : "{{lastName}}"
            }
        ]
    },
    {
        "id": "demo",
        "label" : "Demo",
        "url": "http://formio.lodev.xyz",
        "description": "UAT environment",
        "service": {
            "formio": {
                "username": "me@lodev.xyz",
                "password": "secret"
            },
            "keycloak" : {
                "username": "me@lodev.xyz",
                "password": "secret"
            }
        },
        "editable": false,
        "promotion-preconditions": ["dev"]
    },
    {
        "id": "staging",
        "label": "Staging",
        "url": "http://formio.lodev.xyz",
        "description": "Staging environment",
        "service": {
            "formio": {
                "username": "me@lodev.xyz",
                "password": "secret"
            }
        },
        "editable": false,
        "promotion-preconditions": ["dev", "demo"]
    },
    {
        "id": "prod",
        "label": "Production",
        "url": "http://formio.lodev.xyz",
        "description": "Prod environment",
        "service": {
            "formio": {
                "username": "me@lodev.xyz",
                "password": "secret"
            }
        },
        "editable": false,
        "promotion-preconditions": ["dev", "demo", "staging"]
    },
    {
        "id": "testing",
        "label": "Testing",
        "url": "http://formio.lodev.xyz",
        "description": "Testing environment",
        "service": {
            "formio": {
                "username": "me@lodev.xyz",
                "password": "secret"
            }
        },
        "editable": false,
        "promotion-preconditions": ["dev"]
    }
];


export default environments;

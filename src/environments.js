const environments = [
    {
        "id": "dev",
        "label": "Development",
        "url": "http://formio.lodev.xyz",
        "description": "development environment",
        "service": {
            "username": "me@lodev.xyz",
            "password": "secret"
        },
        "editable": true,
        "default": true,
        "promotion-preconditions": []
    },
    {
        "id": "demo",
        "label" : "Demo",
        "url": "http://formio.lodev.xyz",
        "description": "UAT environment",
        "service": {
            "username": "me@lodev.xyz",
            "password": "secret"
        },
        "create": false,
        "promotion-preconditions": ["dev"]
    },
    {
        "id": "staging",
        "label": "Staging",
        "url": "http://formio.lodev.xyz",
        "description": "Staging environment",
        "service": {
            "username": "me@lodev.xyz",
            "password": "secret"
        },
        "create": false,
        "promotion-preconditions": ["dev", "demo"]
    },
    {
        "id": "prod",
        "label": "Production",
        "url": "http://formio.lodev.xyz",
        "description": "Prod environment",
        "service": {
            "username": "me@lodev.xyz",
            "password": "secret"
        },
        "create": false,
        "promotion-preconditions": ["dev", "demo", "staging"]
    },
    {
        "id": "testing",
        "label": "Testing",
        "url": "http://formio.lodev.xyz",
        "description": "Testing environment",
        "service": {
            "username": "me@lodev.xyz",
            "password": "secret"
        },
        "create": false,
        "promotion-preconditions": ["dev"]
    }
];


export default environments;

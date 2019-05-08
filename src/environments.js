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
        "url": "",
        "description": "UAT environment",
        "service": {
            "username": "",
            "password": ""
        },
        "create": false,
        "promotion-preconditions": ["dev"]
    },
    {
        "id": "staging",
        "label": "Staging",
        "url": "",
        "description": "Staging environment",
        "service": {
            "username": "",
            "password": ""
        },
        "create": false,
        "promotion-preconditions": ["dev", "demo"]
    },
    {
        "id": "prod",
        "label": "Production",
        "url": "",
        "description": "Prod environment",
        "service": {
            "username": "",
            "password": ""
        },
        "create": false,
        "promotion-preconditions": ["dev", "demo", "staging"]
    }
];


export default environments;

module.exports = [
    {
        "type": "heading",
        "defaultValue": "Translink Settings"
    },
    {
        "type": "text",
        "defaultValue": "Here is some introductory text."
    },
    {
        "type": "section",
        "items": [
            {
                "type": "heading",
                "defaultValue": "Route 1"
            },
            {
                "type": "input",
                "appKey": "routeNo1",
                "defaultValue": "014",
                "label": "Route Number (eg. 014) ",
                "attributes": {
                    "placeholder": "014",
                    "limit": 3,
                    "required": "required",
                    "pattern": "^[0-9]{3}$"
                }
            },
            {
                "type": "input",
                "appKey": "stopNo1",
                "defaultValue": "61701",
                "label": "Stop Number",
                "attributes": {
                    "placeholder": "eg: 61701",
                    "limit": 5,
                    "required": "required",
                    "pattern": "^[0-9]{5}$"
                }
            },
            {
                "type": "input",
                "appKey": "description1",
                "defaultValue": "Home",
                "label": "Description",
                "attributes": {
                    "placeholder": "eg: Home",
                    "limit": 15,
                    "required": "required"
                }
            }
        ]
    },
    {
        "type": "section",
        "items": [
            {
                "type": "heading",
                "defaultValue": "Route 2"
            },
            {
                "type": "input",
                "appKey": "routeNo2",
                "defaultValue": "014",
                "label": "Route Number (eg. 014) ",
                "attributes": {
                    "placeholder": "014",
                    "limit": 3,
                    "required": "required",
                    "pattern": "^[0-9]{3}$"
                }
            },
            {
                "type": "input",
                "appKey": "stopNo2",
                "defaultValue": "61701",
                "label": "Stop Number",
                "attributes": {
                    "placeholder": "eg: 61701",
                    "limit": 5,
                    "required": "required",
                    "pattern": "^[0-9]{5}$"
                }
            },
            {
                "type": "input",
                "appKey": "description2",
                "defaultValue": "Home",
                "label": "Description",
                "attributes": {
                    "placeholder": "eg: Home",
                    "limit": 15,
                    "required": "required"
                }
            }
        ]
    },
    {
        "type": "section",
        "items": [
            {
                "type": "heading",
                "defaultValue": "Route 3"
            },
            {
                "type": "input",
                "appKey": "routeNo3",
                "defaultValue": "014",
                "label": "Route Number (eg. 014) ",
                "attributes": {
                    "placeholder": "014",
                    "limit": 3,
                    "required": "required",
                    "pattern": "^[0-9]{3}$"
                }
            },
            {
                "type": "input",
                "appKey": "stopNo3",
                "defaultValue": "61701",
                "label": "Stop Number",
                "attributes": {
                    "placeholder": "eg: 61701",
                    "limit": 5,
                    "required": "required",
                    "pattern": "^[0-9]{5}$"
                }
            },
            {
                "type": "input",
                "appKey": "description3",
                "defaultValue": "Home",
                "label": "Description",
                "attributes": {
                    "placeholder": "eg: Home",
                    "limit": 15,
                    "required": "required"
                }
            }
        ]
    },
    {
        "type": "submit",
        "defaultValue": "Save Settings"
    }
];
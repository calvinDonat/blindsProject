# Introduction
This is an *introduction*...

# Functions
## getSunriseAndSunset(latitude, longitude, day);
### Description

### Parameters
|Name|Description|Default Value|
|---|---|---|
|latitude| |41.059858|
|longitude| |-73.574960|
|day| |today|

### Output
```
{
    "sunrise": "HH:mm:ss",
    "sunset": "HH:mm:ss"
}
```

## getScheduledEvents(sunriseAndSunset);
### Description

### Parameters
|Name|Description|Default Value|
|---|---|---|
|sunriseAndSunset|Returns an object with the sunrise and sunset times; see above| |


### Output
```
[
    {
        "time": "HH:mm:ss",
        "action": "UP",
        "target": "blinds"
    },
    {
        "time": "HH:mm:ss",
        "action": "DOWN",
        "target": "blinds" 
    }
]
```


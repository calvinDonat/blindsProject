# Introduction
This is an *introduction*...

# Functions
## start();
### Description
A function that controls the whole program and runs the other functions in order.
### Parameters
|Name|Description|Default Value|
|---|---|---|
| | | |

### Output
```
```

## getSunriseAndSunset(latitude, longitude, day);
### Description
A function that uses an API to find the sunset and sunrise times of certain place on the earth, as well as a day.
### Parameters
|Name|Description|Default Value|
|---|---|---|
|latitude|The latitude of the place.|41.059858|
|longitude|The logitude of the place.|-73.574960|
|day|The day you want to know the times of.|today|
### Output
```
{
    "sunrise": "HH:mm:ss",
    "sunset": "HH:mm:ss"
}
```

## getScheduledEvents(sunriseAndSunset);
### Description
A function that takes the sunrise and sunset times and creates an object with all of the scheduled events to be run, each one including a target and a action.
### Parameters
|Name|Description|Default Value|
|---|---|---|
|sunriseAndSunset|An object with the sunrise and sunset times; see above| |
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

## addZero(date);
### Description
A function that adds zeros the beginnings of one digit time values so "9:54:3" => "09:54:03".
### Parameters
|Name|Description|Default Value|
|---|---|---|
|date|date to have the time extracted and then converted into proper time.|new Date()|
### Output
```
HH:mm:ss
```

## timeToLocal(time);
### Description
A function that converts utc to local time.
### Parameters
|Name|Description|Default Value|
|---|---|---|
|time|A time is HH:mm:ss a format where a is am or pm| |
### Output
```
HH:mm:ss
```

## run(scheduledEvents);
### Description
A function that will continuosly run, checking to see if an events should take place. If so, it will trigger the event, and keep running. It will also re-run setup, in order to deal with the changes in the time of sunet and sunrise. 
### Parameters
|Name|Description|Default Value|
|---|---|---|
|scheduledEvents|An object with the scheduled events, incliding the action, time and target; see above| |
### Output
```
"MOVING THE ${TARGET} ${ACTION}"
```


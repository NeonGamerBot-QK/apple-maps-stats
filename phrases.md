## Phrases that ios sends
### Key
- `[location]` - location of where point b is.
- `[timestamp]`- formated in (H)H:MM (PM|AM).

### Formated Phrases
- `I will arrive at [location] around [timestamp]. I'll let you know if i'm running late.` - this phrase is first sent when the user starts the session via SMS.  
- `My updated arrival time to [location] is now around [timestamp].`  - When a delay (or if u just stop) is not detected by apple maps it will send this phrase. This also accurs when the arrival at point b time is changed (i THINK ~2mins difference is enough to trigger this). **this can accour multiple times per session**

- `I'm arriving at [location] soon.` - this is a phrase sent when ~2mins before the point b time is reached. This will be used as an end phrase since thats the last phrase that apple maps sends.


## Found more phrases that i dont have above?
Make a PR or open an issue.
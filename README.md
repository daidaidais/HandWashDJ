# Hand Wash DJ

![hero_image](/icon_large.png)

### What it is
Let's wash hands properly!

WHO states that the right way to wash your hands is to _"scrub your hands for at least 20 seconds"_, which takes about as long as singing _"Happy Birthday" twice_.

Hand Wash DJ enhances the appropriate hand wash experience by playing a random song on Spotify for **exactly 20 seconds**.

Before you wash your hands, say **_"OK Google, Hand Wash DJ"_** (or _**「OK Google, 手洗いDJにつないで」**_ in Japanese), and scrub your hands until the song finishes.

### How it works
Hand Wash DJ uses the Client Credentials Flow of Spotify Web API to search for a random song that includes alphabets, checks if it has a `preview_url` property,
then plays that URL for exactly 20 seconds through the `<audio>` tag of SSML in Dialogflow.

### Try it on Google Assistant
[https://assistant.google.com/services/a/uid/000000ca6b14b4aa](https://assistant.google.com/services/a/uid/000000ca6b14b4aa)

# General thoughts

Should this be one monolithic library? Or should I split out the model and the view into separate libraries so that 
it's easy to support multiple clients? I know I want an Android client at some point. But that will probably be in 
Java, which would be a totally different object model. Highly unlikely it'll use Typescript. Although I wonder 
whether I could write a Typescript client for Android ... Looks like it may be possible in React-native.

Well, that's a problem for later. For now, I'm going to start simple. One project. **mittrock-spotify** will hold  
the model and the view.

# Code layout


```
src/
├── index.html
├── index.tsx
└── client/
    ├── app/
    ├── browser/
    ├── player/
    └── utils/
```

# Useful links

* [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
* [spotify-web-api-js docs](https://jmperezperez.com/spotify-web-api-js/)
* [Authorization guide](https://developer.spotify.com/documentation/general/guides/authorization/)
* [Dexie guide](https://developer.fireflysemantics.com/guides/guides--dexie--browser-big-data-with-dexie-and-typescript)

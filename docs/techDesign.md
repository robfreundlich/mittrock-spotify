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

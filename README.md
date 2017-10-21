# Youtube Cacheable Audio Stream

A Web API that returns a cacheable audio stream for a given Youtube video ID.

## Why?
I'm working on a Spotify-like project and wanted to give the user
an option to save selected songs, also wanted to stream audio from
an Youtube video.

## How?
First of all: You should configure your runtime caching to cache
only 200 http responses from the given URL. 
SW-Precache Ex:

```js
{
    urlPattern: /^https:\/\/youtube-cacheable-audio-stream\.herokuapp\.com\/getAudioStream\//,
    handler: 'cacheFirst',
    options: {
        successResponses: /20[01]/
    }
}
```
    
##### Then its simple: 

* If you just request the song, you'll receive a 302
redirecting to Youtube's audio stream, so the response will NOT be cached.

* If you request it with a `save: true` header, you will reveice a 200 
with the requested audio file, so the response WILL be cached.


##### Tip:
Just use a save button to the save request and the
normal URL on the HTML5 audio player and the 
service worker will take care of the rest. 

Before the save request, the SW will do a normal request 
and return a 302 redirect and download/play the audio stream.

After the save request, the SW will return the cached value
and play it offline.

OBS: The SW will only cache after the save request. The 302 requests
will be processed by the SW, but not cached. That's how you make it optional.

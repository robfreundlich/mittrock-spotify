# Organizing/Browsing

## Attributes

* Playlist(s)
* Artist(s)
  * Come from album
  * Also from top-level
* Title
* Track Number?
* Album(s)
* Genre(s)
  * Only comes from artist
* Release Date
  * what precision?
    * probably year
    * Comes with a precision
  * Comes from album
    * Album can be marked as "single"
* Explicit
* Length
  * First cut
    * < 3 minutes
    * 3 – 5 minutes can be marked as "foobar"
    * 5 – 7 minutes
    * \> 7 minutes
  * Second cut
    * User defined chunks
* Popularity
  * Artist has it
  * Track has it
* Local/Streamed
* Affinity
  * This is built from **how** a track gets into the library
  * There's an under-the-covers list of all the reasons a track is in the library:
    * `inclusion_reasons`
    * It's a favorite track
    * It's in a favorite album
    * It's in a favorite playlist
    * Maybe even we grabbed it from the top _N_ of a favorite artist or genre
  * Not just tracks
    * Albums *implemented*
    * Artists *implemented*
    * Maybe even Genres? **TODO**
  * Affinity is a function of these
    * Count?
    * Weighted Sum?
      * Favorite >> Owned Playlist >> Album >> Other Playlist >> Artist >> Genre

## Browsing

1. Present the user with:
1. The attributes
2. All songs * If they pick a song from here, **they're done** 🛑
2. User has picked an attribute. Present them with:
1. All remaining attributes
2. A list of values for that attribute * If the user picks a value, present them with:
1. All remaining attributes
2. "Play random song"

* If the user picks this, **they're done** 🛑

3. "Play all songs in order"

* If the user picks this, **they're done** 🛑

4. All songs with that value for that attribute

* If they pick a song from here, **they're done** 🛑

3. "Play random _attribute_"

* If the user picks this, **they're done** 🛑

4. "Play all _attribute_s in order"

* If the user picks this, **they're done** 🛑

5. "Play random song"

* If the user picks this, **they're done** 🛑

6. "Play all songs in order"

* If the user picks this, **they're done** 🛑

7. All songs that have that attribute * If they pick a song from here, **they're done** 🛑
3. The user has picked an attribute. Loop back to the prior step.

Note: These levels/attributes are called groups. A browsing session might result in the following nested groups:

## Example

1. The user picks Genres, and then specific values **Classic Rock**, **Psychedelic Rock**, and **Blues**
2. One of the remaining attributes is **Release Date**. The user picks it, and sets a range of **1960 - 1975**
3. One of the remaining attributes is **Popularity**. The user picks it, and sets a condition of > 50.
4. One of the remaining attributes is **Album**. The user picks it.
5. Then the user picks "Play random song"

Their UI now presents, in some form, this hierarchy of groups (or whatever we decide to call them):

Genres: Classic Rock, Psychedelic Rock, Blues  
| Release Date: 1960 - 1975  
| | Popularity > 50  
| | | Albums  
| | | | some long list of albums, and the user has started playing from here

## Order

Within a Group, tracks can be sorted in various ways:

* Name
* Artist
* Track Number
* Affinity
* Genre
* Length
* ??? really, any attribute ...

# Playing Music

## Controls

* Play/Pause
* Next Track
  * Next group _(i.e. Album)_
  * Next parent group _(Popularity doesn't have a "Next", so perhaps this means the next 15 years)_
  * etc _(There's no "next" Genre, so no further "Next" button)_
* Previous Track
  * Previous group
  * Previous parent group
  * etc
* Like
  * Track
  * Artist
  * Album?
* Dislike
  * Track
  * Artist
  * Album?
* Shuffle
  * Play random track
  * Play random in album
  * Play random by artist
  * Play random from group _(Album is already taken, so Popularity? Release Date?)_
* Go to album
* Go to artist
* Go to genre
* Go to playlist _(if relevant)_
* Radio _(if relevant. Does Spotify provide a radio button for every track?)_

| Note              |
|-------------------|
| That's a busy UI! |




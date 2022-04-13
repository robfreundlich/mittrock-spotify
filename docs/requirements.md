# Requirements

## Organizing/Browsing

### Attributes

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

### Browsing

1. Present the user with:
   1. The attributes
   2. All songs 
      * If they pick a song from here, **they're done** 🛑
2. User has picked an attribute. Present them with:
   1. All remaining attributes
   2. A list of values for that attribute
      * If the user picks a value, present them with:
        1. All remaining attributes
        2. All songs with that value for that attribute
          * If they pick a song from here, **they're done** 🛑
   3. All songs that have that attribute
      * If they pick a song from here, **they're done** 🛑
3. The user has picked an attribute. Loop back to the prior step.

## Playing Music

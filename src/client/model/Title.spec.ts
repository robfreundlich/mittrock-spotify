/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {Album} from "app/client/model/Album";
import {Artist} from "app/client/model/Artist";
import {Genre} from "app/client/model/Genre";
import {Title} from "app/client/model/Title";
import {Track} from "app/client/model/Track";
import {ModelUtils} from "app/client/utils/ModelUtils";
import {instance, mock, resetCalls, when} from "ts-mockito";

describe("Tests the internal consistency of the Title object", () => {
  let title: Title;

  const albumId = ModelUtils.generateId();
  const artistId = ModelUtils.generateId();
  const trackId = ModelUtils.generateId();

  const mockedAlbum: Album = mock(Album);
  const mockedGenre: Genre = mock(Genre);
  const mockedArtist: Artist = mock(Artist);
  const mockedTrack: Track = mock(Track);

  let album: Album;
  let genre: Genre;
  let artist: Artist;
  let track: Track;

  function resetMockedObjects(): void
  {
    when(mockedAlbum.id).thenReturn(albumId);
    when(mockedGenre.name).thenReturn("classic rock");
    when(mockedArtist.id).thenReturn(artistId);
    when(mockedTrack.id).thenReturn(trackId);

    album = instance(mockedAlbum);
    genre = instance(mockedGenre);
    artist = instance(mockedArtist);
    track = instance(mockedTrack);
  }

  beforeEach("Set up objects", () => {
    resetMockedObjects();

    title = new Title(ModelUtils.generateId(), "Cool Song", [album], [], [genre], [artist], ["clean"], [100], [50], ["streaming"], [track]);
  });

  afterEach(() => {
    resetCalls(mockedAlbum);
    resetCalls(mockedGenre);
    resetCalls(mockedArtist);
    resetCalls(mockedTrack);
  });

  describe("Tests track consistency", () => {
    it("Verifies that adding an existing track doesn't double up", () => {
      when(mockedTrack.id).thenReturn(trackId);

      const track: Track = instance(mockedTrack);
      title.addTrack(track);

      expect(title.tracks).to.have.ordered.members([track]);
    });

    it("Verifies that adding a new track succeeds", () => {
      const mockedTrack2: Track = mock(Track);
      when(mockedTrack2.id).thenReturn(ModelUtils.generateId());

      const track2: Track = instance(mockedTrack2);
      title.addTrack(track2);

      expect(title.tracks).to.have.ordered.members([track, track2]);
    });
  });

  describe("Tests album consistency", () => {
    it("Verifies that a track with an existing album doesn't double it up", () => {
      when(mockedTrack.album).thenReturn(album);

      const track: Track = instance(mockedTrack);

      title.addTrack(track);

      expect(title.albums).to.have.ordered.members([album]);
    });

    it("Verifies that a track with a new album does add the album to the list", () => {
      // The track is going to be on album 2

      // Set up a new mock album, with a new id
      const mockedAlbum2: Album = mock(Album);
      let id: string = ModelUtils.generateId();
      when(mockedAlbum2.id).thenReturn(id);

      // Define a new instance of Album
      const album2: Album = instance(mockedAlbum2);

      // Set up a new mock track, with a new id and the new album
      const mockedTrack2: Track = mock(Track);
      id = ModelUtils.generateId();
      when(mockedTrack2.id).thenReturn(id);
      when(mockedTrack2.album).thenReturn(album2);

      const track2: Track = instance(mockedTrack2);

      // Add the track to the title
      title.addTrack(track2);

      // The title should have the standard album (from its initial mock) and the new one
      // (from the new track)
      expect(title.albums).to.have.ordered.members([album, album2]);
    });
  });

  describe("Tests genre consistency", () => {
    it("Verifies that a track with an existing genre does not double it up", () => {
      when(mockedTrack.genres).thenReturn([new Genre("classic rock", [])]);

      const track: Track = instance(mockedTrack);

      title.addTrack(track);

      expect(title.genres).to.have.ordered.members([genre]);
    });

    it("Verifies that a track with a new genre does add the genre to the list", () => {
      // The track is going to be in the "blues" genre

      // Set up a new Genre
      const blues: Genre = new Genre("blues", []);

      // Set up a new mock track, with a new id and the new album
      const mockedTrack2: Track = mock(Track);
      const id: string = ModelUtils.generateId();
      when(mockedTrack2.id).thenReturn(id);
      when(mockedTrack2.genres).thenReturn([blues]);

      const track2: Track = instance(mockedTrack2);

      // Add the track to the title
      title.addTrack(track2);

      // The title should have the standard genre (from its initial mock) and the new one
      // (from the new track)
      expect(title.genres).to.have.ordered.members([genre, blues]);
    });
  });

  describe("Tests artist consistency", () => {
    it("Verifies that a track with an existing artist doesn't double it up", () => {
      when(mockedTrack.artists).thenReturn([artist]);

      const track: Track = instance(mockedTrack);

      title.addTrack(track);

      expect(title.artists).to.have.ordered.members([artist]);
    });

    it("Verifies that a track with a new artist does add the artist to the list", () => {
      // The track is going to be on artist 2

      // Set up a new mock artist, with a new id
      const mockedArtist2: Artist = mock(Artist);
      let id: string = ModelUtils.generateId();
      when(mockedArtist2.id).thenReturn(id);

      // Define a new instance of Artist
      const artist2: Artist = instance(mockedArtist2);

      // Set up a new mock track, with a new id and the new artist
      const mockedTrack2: Track = mock(Track);
      id = ModelUtils.generateId();
      when(mockedTrack2.id).thenReturn(id);
      when(mockedTrack2.artists).thenReturn([artist2]);

      const track2: Track = instance(mockedTrack2);

      // Add the track to the title
      title.addTrack(track2);

      // The title should have the standard artist (from its initial mock) and the new one
      // (from the new track)
      expect(title.artists).to.have.ordered.members([artist, artist2]);
    });
  });

  describe("Tests explicit consistency", () => {
    it("Verifies that a track with an existing explicit doesn't double it up", () => {
      when(mockedTrack.explicit).thenReturn("clean");

      const track: Track = instance(mockedTrack);

      title.addTrack(track);

      expect(title.explicits).to.have.ordered.members(["clean"]);
    });

    it("Verifies that a track with a new explicit does add the explicit to the list", () => {
      // The track is going to be on explicit 2

      // Set up a new mock track, with a new id and a new explicit
      const mockedTrack2: Track = mock(Track);
      const id: string = ModelUtils.generateId();
      when(mockedTrack2.id).thenReturn(id);
      when(mockedTrack2.explicit).thenReturn("explicit");

      const track2: Track = instance(mockedTrack2);

      // Add the track to the title
      title.addTrack(track2);

      // The title should have the standard explicit (from its initial mock) and the new one
      // (from the new track)
      expect(title.explicits).to.have.ordered.members(["clean", "explicit"]);
    });
  });

  describe("Tests length consistency", () => {
    it("Verifies that a track with an existing length doesn't double it up", () => {
      when(mockedTrack.length).thenReturn(100);

      const track: Track = instance(mockedTrack);

      title.addTrack(track);

      expect(title.lengths).to.have.ordered.members([100]);
    });

    it("Verifies that a track with a new length does add the length to the list", () => {
      // The track is going to be on length 2

      // Set up a new mock track, with a new id and a new length
      const mockedTrack2: Track = mock(Track);
      const id: string = ModelUtils.generateId();
      when(mockedTrack2.id).thenReturn(id);
      when(mockedTrack2.length).thenReturn(90);

      const track2: Track = instance(mockedTrack2);

      // Add the track to the title
      title.addTrack(track2);

      // The title should have the standard length (from its initial mock) and the new one
      // (from the new track)
      expect(title.lengths).to.have.ordered.members([100, 90]);
    });
  });

  describe("Tests popularity consistency", () => {
    it("Verifies that a track with an existing popularity doesn't double it up", () => {
      when(mockedTrack.popularity).thenReturn(50);

      const track: Track = instance(mockedTrack);

      title.addTrack(track);

      expect(title.popularities).to.have.ordered.members([50]);
    });

    it("Verifies that a track with a new popularity does add the popularity to the list", () => {
      // The track is going to be on popularity 2

      // Set up a new mock track, with a new id and a new popularity
      const mockedTrack2: Track = mock(Track);
      const id: string = ModelUtils.generateId();
      when(mockedTrack2.id).thenReturn(id);
      when(mockedTrack2.popularity).thenReturn(75);

      const track2: Track = instance(mockedTrack2);

      // Add the track to the title
      title.addTrack(track2);

      // The title should have the standard popularity (from its initial mock) and the new one
      // (from the new track)
      expect(title.popularities).to.have.ordered.members([50, 75]);
    });
  });

  describe("Tests local consistency", () => {
    it("Verifies that a track with an existing local doesn't double it up", () => {
      when(mockedTrack.local).thenReturn("streaming");

      const track: Track = instance(mockedTrack);

      title.addTrack(track);

      expect(title.locals).to.have.ordered.members(["streaming"]);
    });

    it("Verifies that a track with a new local does add the local to the list", () => {
      // The track is going to be on local 2

      // Set up a new mock track, with a new id and a new local
      const mockedTrack2: Track = mock(Track);
      const id: string = ModelUtils.generateId();
      when(mockedTrack2.id).thenReturn(id);
      when(mockedTrack2.local).thenReturn("local");

      const track2: Track = instance(mockedTrack2);

      // Add the track to the title
      title.addTrack(track2);

      // The title should have the standard local (from its initial mock) and the new one
      // (from the new track)
      expect(title.locals).to.have.ordered.members(["streaming", "local"]);
    });
  });

});

/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {Album} from "client/model/Album";
import {Artist} from "client/model/Artist";
import {Genre} from "client/model/Genre";
import {Title} from "client/model/Title";
import {Track} from "client/model/Track";
import {ModelTestUtils} from "test/client/model/ModelTestUtils";
import {instance, mock, resetCalls, when} from "ts-mockito";

describe("Tests the internal consistency of the Title object", () => {
  let title: Title;

  const albumId = ModelTestUtils.generateTestId();
  const genreId = ModelTestUtils.generateTestId();
  const artistId = ModelTestUtils.generateTestId();
  const trackId = ModelTestUtils.generateTestId();

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
    when(mockedGenre.id).thenReturn(genreId);
    when(mockedArtist.id).thenReturn(artistId);
    when(mockedTrack.id).thenReturn(trackId);

    album = instance(mockedAlbum);
    genre = instance(mockedGenre)
    artist = instance(mockedArtist)
    track = instance(mockedTrack)
  }

  beforeEach("Set up objects", () => {
    resetMockedObjects();

    title = new Title(ModelTestUtils.generateTestId(),
                      "Cool Song",
                      [album],
                      [genre],
                      [artist],
                      ["clean"],
                      [100],
                      [50],
                      ["streaming"],
                      [track]);
  });

  afterEach(() => {
    resetCalls(mockedAlbum);
    resetCalls(mockedGenre);
    resetCalls(mockedArtist);
    resetCalls(mockedTrack);
  });

  describe("Tests album consistency", () => {
    it("Verifies that a track with an existing album doesn't double it up", () => {
      when(mockedTrack.album).thenReturn(album);

      const track: Track = instance(mockedTrack);

      title.addTrack(track);

      expect(title.albums).to.have.ordered.members([album]);
    });

    it.only("Verifies that a track with a new album does add the album to the list", () => {
      // The track is going to be on album 2

      // Set up a new mock album, with a new id
      const mockedAlbum2: Album = mock(Album);
      let id: string = ModelTestUtils.generateTestId();
      when(mockedAlbum2.id).thenReturn(id);

      // Define a new instance of Album
      const album2: Album = instance(mockedAlbum2);

      // Set up a new mock track, with a new id and the new album
      const mockedTrack2: Track = mock(Track);
      id = ModelTestUtils.generateTestId();
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
});

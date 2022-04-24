/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {Album} from "client/model/Album";
import {Artist} from "client/model/Artist";
import {Genre} from "client/model/Genre";
import {Title} from "client/model/Title";
import {Track} from "client/model/Track";
import {ModelTestUtils} from "test/client/model/ModelTestUtils";
import {instance, mock, when} from "ts-mockito";

describe("Tests the internal consistency of the Title object", () => {
  let title: Title;

  const albumId = ModelTestUtils.generateTestId();
  const genreId = ModelTestUtils.generateTestId();
  const artistId = ModelTestUtils.generateTestId();
  const trackId = ModelTestUtils.generateTestId();

  beforeEach(() => {
    const album: Album = instance(mock(Album));
    when(album.id).thenReturn(albumId);

    const genre: Genre = instance(mock(Genre))
    when(genre.id).thenReturn(genreId);

    const artist: Artist = instance(mock(Artist))
    when(artist.id).thenReturn(artistId);

    const track: Track = instance(mock(Track))
    when(track.id).thenReturn(trackId);

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
  })

  describe("Tests album consistency", () => {
    it("Verifies that a track with a new album", () => {
      const album: Album = instance(mock(Album));
      when(album.id).thenReturn(albumId);

      const track: Track = instance(mock(Track));
      when(track.album).thenReturn(album);

      title.addTrack(track);

      expect(title.albums).to.have.ordered.members([album]);
    });
  });
});

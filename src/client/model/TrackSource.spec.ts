/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {
  isAlbum,
  isFavorites,
  isPlaylist,
  isTrackAlbum,
  isTrackFavorite,
  isTrackPlaylist,
  TrackSource
} from './TrackSource';
import {ITrack} from "app/client/model/Track";
import {INCLUSION_REASON_FAVORITE} from "app/client/utils/Types";

describe("Tests functions in TrackSource", () => {
  describe('isAlbum function', () => {
    it('should return true when the source type is album', () => {
      const trackSource: TrackSource = {
        sourceType: 'album',
        id: '1',
        name: 'Album 1',
      };

      const result = isAlbum(trackSource);
      expect(result).to.equal(true);
    });

    it('should return false when the source type is not an album', () => {
      const trackSource: TrackSource = {
        sourceType: 'playlist',
        id: '2',
        name: 'Playlist 1',
      };

      const result = isAlbum(trackSource);
      expect(result).to.equal(false);
    });
  });

  describe('isTrackAlbum function', () => {
    it('should return true if the track has album as a source', () => {
      const track: ITrack = {
        id: '1',
        name: 'Track1',
        explicit: 'explicit',
        length: 200,
        popularity: 50,
        local: 'local',
        disc_number: 1,
        track_number: 1,
        album: undefined,
        playlists: [],
        sources: [{id: "1", sourceType: 'album'}],
        genres: [],
        artists: [],
        addedAt: new Date(),
        images: [],
      };

      const result = isTrackAlbum(track);
      expect(result).to.equal(true);
    });

    it('should return false if the track does not have album as a source', () => {
      const track: ITrack = {
        id: '2',
        name: 'Track2',
        explicit: 'clean',
        length: 180,
        popularity: 40,
        local: 'streaming',
        disc_number: 2,
        track_number: 2,
        album: undefined,
        playlists: [],
        sources: [{id: "1", sourceType: 'playlist'}],
        genres: [],
        artists: [],
        addedAt: new Date(),
        images: [],
      };

      const result = isTrackAlbum(track);
      expect(result).to.equal(false);
    });
  });

  describe('isPlaylist function', () => {
    it('should return true when the source type is playlist', () => {
      const trackSource: TrackSource = {
        sourceType: 'playlist',
        id: '1',
        name: 'Playlist 1',
      };

      const result = isPlaylist(trackSource);
      expect(result).to.equal(true);
    });

    it('should return false when the source type is not a playlist', () => {
      const trackSource: TrackSource = {
        sourceType: 'album',
        id: '2',
        name: 'Album 1',
      };

      const result = isPlaylist(trackSource);
      expect(result).to.equal(false);
    });
  });

  describe('isTrackPlaylist function', () => {
    it('should return true if the track has playlist as a source', () => {
      const track: ITrack = {
        id: '1',
        name: 'Track1',
        explicit: 'explicit',
        length: 200,
        popularity: 50,
        local: 'local',
        disc_number: 1,
        track_number: 1,
        album: undefined,
        playlists: [],
        sources: [{id: "1", sourceType: 'playlist'}],
        genres: [],
        artists: [],
        addedAt: new Date(),
        images: [],
      };

      const result = isTrackPlaylist(track);
      expect(result).to.equal(true);
    });

    it('should return false if the track does not have playlist as a source', () => {
      const track: ITrack = {
        id: '2',
        name: 'Track2',
        explicit: 'clean',
        length: 180,
        popularity: 40,
        local: 'streaming',
        disc_number: 2,
        track_number: 2,
        album: undefined,
        playlists: [],
        sources: [{id: "1", sourceType: 'album'}],
        genres: [],
        artists: [],
        addedAt: new Date(),
        images: [],
      };

      const result = isTrackPlaylist(track);
      expect(result).to.equal(false);
    });
  });

  describe('isFavorite function', () => {
    it('should return true when the source type is favorite', () => {
      const trackSource: TrackSource = {
        sourceType: INCLUSION_REASON_FAVORITE,
      };

      const result = isFavorites(trackSource);
      expect(result).to.equal(true);
    });

    it('should return false when the source type is not favorite', () => {
      const trackSource: TrackSource = {
        sourceType: 'playlist',
        id: '2',
        name: 'Playlist 1',
      };

      const result = isFavorites(trackSource);
      expect(result).to.equal(false);
    });
  });

  describe('isTrackFavorites function', () => {
    it('should return true if the track has favorite as a source', () => {
      const track: ITrack = {
        id: '1',
        name: 'Track1',
        explicit: 'explicit',
        length: 200,
        popularity: 50,
        local: 'local',
        disc_number: 1,
        track_number: 1,
        album: undefined,
        playlists: [],
        sources: [{sourceType: INCLUSION_REASON_FAVORITE}],
        genres: [],
        artists: [],
        addedAt: new Date(),
        images: [],
      };

      const result = isTrackFavorite(track);
      expect(result).to.equal(true);
    });

    it('should return false if the track does not have favorite as a source', () => {
      const track: ITrack = {
        id: '2',
        name: 'Track2',
        explicit: 'clean',
        length: 180,
        popularity: 40,
        local: 'streaming',
        disc_number: 2,
        track_number: 2,
        album: undefined,
        playlists: [],
        sources: [{id: "1", sourceType: 'playlist'}],
        genres: [],
        artists: [],
        addedAt: new Date(),
        images: [],
      };

      const result = isTrackFavorite(track);
      expect(result).to.equal(false);
    });
  });
});
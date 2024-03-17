/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {Album} from "app/client/model/Album";
import {Artist} from "app/client/model/Artist";
import {DataStore} from "app/client/model/DataStore";
import {Genre} from "app/client/model/Genre";
import {Track} from "app/client/model/Track";
import {ModelUtils} from "app/client/utils/ModelUtils";
import {loremIpsum} from "react-lorem-ipsum";

describe("Load tests the DataStore", () => {
  const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const pickRandom = <T>(array: T[], min: number, max: number): T[] => {
    const result: T[] = [];

    const available: T[] = array.slice();

    const size: number = getRandomNumber(max, min);

    for (let i = 0; i < size; i++)
    {
      result.push(available.splice(Math.random() * available.length, 1)[0]);
    }

    return result;
  };

  it("Heavily populates the DataStore to look at the memory footprint", () => {
    // Generate 100 genres
    const genres: Genre[] = loremIpsum({p: 100, avgSentencesPerParagraph: 1, avgWordsPerSentence: 1})
        .map((name: string) => new Genre(name, []));

    const artists: Artist[] = loremIpsum({p: 100, avgSentencesPerParagraph: 1, avgWordsPerSentence: 2})
        .map((name: string) => new Artist(ModelUtils.generateId(),
                                          name,
                                          Math.random() * 100,
                                          pickRandom(genres, 1, 5),
                                          []));

    const albums: Album[] = loremIpsum({p: 1000, avgSentencesPerParagraph: 1, avgWordsPerSentence: 3})
        .map((name: string) => new Album(ModelUtils.generateId(),
                                         name,
                                         "album",
                                         "" + getRandomNumber(1920, 2022),
                                         "year",
                                         pickRandom(artists, 1, 3),
                                         [],
                                         ["favorite"],
                                         new Date()));

    const trackNames: string[] = loremIpsum({p: 1000, avgSentencesPerParagraph: 1, avgWordsPerSentence: 5});
    const tracks: Track[] = [];

    albums.forEach((album: Album) => {
      const length: number = getRandomNumber(8, 16);
      const albumTrackNames: string[] = pickRandom(trackNames, length, length);
      const albumGenres: Genre[] = pickRandom(genres, 1, 1);

      for (let i = 0; i < length; i++)
      {
        const track: Track = new Track(ModelUtils.generateId(),
                                       albumTrackNames[i],
                                       (Math.random() < 0.8) ? "clean" : "explicit",
                                       getRandomNumber(60 * 2, 60 * 5),
                                       getRandomNumber(5, 100),
                                       "streaming",
                                       1,
                                       i,
                                       [album],
                                       albumGenres,
                                       album.artists);
        album.addTrack(track);
        tracks.push(track);
      }
    });

    const dataStore: DataStore = new DataStore();

    tracks.forEach((track) => dataStore.addTrack(track));

    expect(dataStore.tracks).to.have.ordered.members(tracks);
  });
});

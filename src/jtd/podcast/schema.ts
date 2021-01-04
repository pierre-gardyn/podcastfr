import { Schema } from 'jtd';

const schema: Schema = {
  properties: {
    information: {
      optionalProperties: {
        title: { type: 'string' },
        link: { type: 'string' },
        author: { type: 'string' },
        description: { type: 'string' },
        imageUrl: { type: 'string' },
      },
    },
    meta: {
      properties: {
        fileName: { type: 'string' },
      },
    },
    feedUrls: {
      optionalProperties: {
        rss: { type: 'string' },
        soundcloud: { type: 'string' },
        itunes: { type: 'string' },
        spotify: { type: 'string' },
        deezer: { type: 'string' },
        google: { type: 'string' },
        castbox: { type: 'string' },
        pocketcast: { type: 'string' },
      },
    },
  },
};
export default schema;
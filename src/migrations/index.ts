import * as migration_20260409_155721_initial from './20260409_155721_initial';
import * as migration_20260904_150606_add_collections from './20260904_150606_add_collections';

export const migrations = [
  {
    up: migration_20260409_155721_initial.up,
    down: migration_20260409_155721_initial.down,
    name: '20260409_155721_initial',
  },
  {
    up: migration_20260904_150606_add_collections.up,
    down: migration_20260904_150606_add_collections.down,
    name: '20260904_150606_add_collections'
  },
];

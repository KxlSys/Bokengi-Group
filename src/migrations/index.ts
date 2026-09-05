import * as migration_20260409_155721_initial from './20260409_155721_initial';
import * as migration_20260904_150606_add_collections from './20260904_150606_add_collections';
import * as migration_20260905_034500_add_posts_categories_tags from './20260905_034500_add_posts_categories_tags';
import * as migration_20260905_060000_align_posts_schema from './20260905_060000_align_posts_schema';

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
  {
    up: migration_20260905_034500_add_posts_categories_tags.up,
    down: migration_20260905_034500_add_posts_categories_tags.down,
    name: '20260905_034500_add_posts_categories_tags'
  },
  {
    up: migration_20260905_060000_align_posts_schema.up,
    down: migration_20260905_060000_align_posts_schema.down,
    name: '20260905_060000_align_posts_schema'
  },
];


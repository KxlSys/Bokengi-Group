import * as migration_20260409_155721_initial from './20260409_155721_initial';
import * as migration_20260904_150606_add_collections from './20260904_150606_add_collections';
import * as migration_20260905_034500_add_posts_categories_tags from './20260905_034500_add_posts_categories_tags';
import * as migration_20260905_060000_align_posts_schema from './20260905_060000_align_posts_schema';
import * as migration_20260907_020000_add_status_to_services_and_case_studies from './20260907_020000_add_status_to_services_and_case_studies';
import * as migration_20260908_220000_add_users_rbac from './20260908_220000_add_users_rbac';
import * as migration_20260908_230000_add_access_requests from './20260908_230000_add_access_requests';
import * as migration_20260909_160000_add_access_requests_locked_documents_rel from './20260909_160000_add_access_requests_locked_documents_rel';

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
  {
    up: migration_20260907_020000_add_status_to_services_and_case_studies.up,
    down: migration_20260907_020000_add_status_to_services_and_case_studies.down,
    name: '20260907_020000_add_status_to_services_and_case_studies'
  },
  {
    up: migration_20260908_220000_add_users_rbac.up,
    down: migration_20260908_220000_add_users_rbac.down,
    name: '20260908_220000_add_users_rbac'
  },
  {
    up: migration_20260908_230000_add_access_requests.up,
    down: migration_20260908_230000_add_access_requests.down,
    name: '20260908_230000_add_access_requests'
  },
  {
    up: migration_20260909_160000_add_access_requests_locked_documents_rel.up,
    down: migration_20260909_160000_add_access_requests_locked_documents_rel.down,
    name: '20260909_160000_add_access_requests_locked_documents_rel'
  },
];


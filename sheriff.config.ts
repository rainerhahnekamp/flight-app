import { noDependencies, sameTag, SheriffConfig } from '@softarc/sheriff-core';

export const sheriffConfig: SheriffConfig = {
  version: 1,

  enableBarrelLess: true,

  modules: {
    libs: {
      'ui-<ui>/src': ['domain:shared', 'type:ui'],
      'util-<util>/src': ['domain:shared', 'type:util'],
    },
    'apps/<app>/src/app': {
      'domains/<domain>': {
        'feature-<feature>': ['domain:<domain>', 'type:feature'],
        'ui-<ui>': ['domain:<domain>', 'type:ui'],
        ui: ['domain:<domain>', 'type:ui'],
        data: ['domain:<domain>', 'type:data'],
        model: ['domain:<domain>', 'type:model'],
        'util-<ui>': ['domain:<domain>', 'type:util'],
      },
    },
  },
  depRules: {
    root: ['*'],

    'domain:*': [sameTag, 'domain:shared'],

    'type:feature': ['type:ui', 'type:data', 'type:util', 'type:model'],
    'type:ui': ['type:data', 'type:util', 'type:model'],
    'type:data': ['type:util', 'type:model'],
    'type:util': noDependencies,
    'type:model': noDependencies,
  },
  entryFile: 'apps/flights/src/main.ts',
};

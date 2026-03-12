import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: '../server/src/schema/schema.graphql',
  documents: ['src/**/*.{ts,tsx}'],
  ignoreNoDocuments: true,
  generates: {
    'src/generated/': {
      preset: 'client',
      config: {
        useTypeImports: true,
        nonOptionalTypename: true,
        skipTypename: false,
      },
    },
  },
};

export default config;

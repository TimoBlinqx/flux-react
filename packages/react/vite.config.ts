import react from '@vitejs/plugin-react';
import {preset} from '@basmilius/vite-preset';
import {resolve} from 'node:path';
import {defineConfig} from 'vite';

export default defineConfig({
    plugins: [
        preset({
            cssModules: {
                classNames: 'kebab'
            },
            isLibrary: true,
            tsconfigPath: resolve(import.meta.dirname, 'tsconfig.json')
        }),
        react()
    ],
    resolve: {
        alias: {
            '~flux/components': resolve(import.meta.dirname, '../components/src')
        }
    },
    css: {
        modules: {
            localsConvention: 'camelCaseOnly'
        }
    },
    build: {
        assetsDir: '',
        emptyOutDir: true,
        outDir: resolve(import.meta.dirname, 'dist'),
        sourcemap: true,
        lib: {
            entry: resolve(import.meta.dirname, 'src/index.ts'),
            formats: ['es'],
            fileName: () => 'index.js',
            name: 'fluxReact'
        },
        rolldownOptions: {
            external: ['clsx', 'react', 'react-dom', 'react/jsx-runtime'],
            output: {
                assetFileNames: assetInfo => assetInfo.name?.endsWith('.css') ? 'index.css' : '[name][extname]',
                exports: 'named'
            }
        }
    }
});

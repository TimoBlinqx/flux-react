import react from '@vitejs/plugin-react';
import {resolve} from 'node:path';
import {defineConfig} from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '~flux/components': resolve(import.meta.dirname, '../components/src')
        }
    },
    test: {
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts']
    }
});

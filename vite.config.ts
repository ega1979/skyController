import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirnameの代わりにfileURLToPathとimport.meta.urlを使用
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    base: './',
    plugins: [glsl()],
    build: {
        outDir: 'dist', // 出力ディレクトリを指定
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {}
        }
    },
    publicDir: 'assets' // assetsフォルダを公開
});
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
import path from 'path';
import { fileURLToPath } from 'url';

//const base = process.env.NODE_ENV === 'production' ? '/opencv/binary/' : '/';

// __dirnameの代わりにfileURLToPathとimport.meta.urlを使用
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    base: './',
    plugins: [glsl()],
    build: {
        outDir: 'dist', // 出力ディレクトリを指定
    },
    // define: {
    //     'global.Module': 'window.Module',
    //     'process.env': {}
    // }
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                //additionalData: `@import "@/scss/style.scss";`
            }
        }
    },
    publicDir: 'assets' // assetsフォルダを公開
});
import vuePlugin from '@vitejs/plugin-vue';
import ElementPlus from 'unplugin-element-plus/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers';

/**
 * @type {import('vite').UserConfig}
 */
module.exports = {
    plugins: [
        vuePlugin(),
        // ElementPlus(),
        // AutoImport({
        //     resolvers: [ElementPlusResolver()],
        // }),
        // Components({
        //     resolvers: [ElementPlusResolver()],
        // }),
    ],
    build: {
        minify: false
    }
};

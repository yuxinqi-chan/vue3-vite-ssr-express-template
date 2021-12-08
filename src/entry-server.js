import App from './App.vue';
import {createSSRApp} from 'vue';
import createStore from './store';
import createRouter from './router';
import {sync} from 'vuex-router-sync';
import {renderToString} from '@vue/server-renderer';
import {createMemoryHistory} from 'vue-router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

function isPromise(obj) {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function renderPreloadLinks(modules, manifest) {
    let links = '';
    const seen = new Set();
    modules.forEach((id) => {
        const files = manifest[id];
        if (files) {
            files.forEach((file) => {
                if (!seen.has(file)) {
                    seen.add(file);
                    links += renderPreloadLink(file);
                }
            });
        }
    });
    return links;
}

function renderPreloadLink(file) {
    if (file.endsWith('.js')) {
        return `<link rel="modulepreload" crossorigin href="${file}">`;
    } else if (file.endsWith('.css')) {
        return `<link rel="stylesheet" href="${file}">`;
    } else {
        return '';
    }
}

export async function render(req, manifest) {
    const router = createRouter(createMemoryHistory());
    const store = createStore();
    sync(store, router);
    const app = createSSRApp(App);
    app.use(ElementPlus);
    app.use(router);
    app.use(store);
    await router.push(req.originalUrl);
    await router.isReady();
    const components = router.currentRoute.value.matched.map(m => m.components).flat();
    const asyncFuncs = components.map((component) => {
        const asyncData = component.default.asyncData || null;
        if (asyncData) {
            if (isPromise(asyncData) === false) {
                const result = asyncData({req});
                return Promise.resolve(result);
            }
            return asyncData({req});
        }
    });
    let asyncDatas = await Promise.all(asyncFuncs);
    components.forEach((component, index) => {
        const componentData = component.default.data;
        const asyncData = asyncDatas[index];
        component.default.data = function () {
            return {
                ...componentData.call(this),
                ...asyncData
            };
        };
    });
    const ctx = {};
    const html = await renderToString(app, ctx);
    const preloadLinks = renderPreloadLinks(ctx.modules, manifest);
    const state = JSON.stringify(store.state);
    return [html, state, preloadLinks, asyncDatas];
}

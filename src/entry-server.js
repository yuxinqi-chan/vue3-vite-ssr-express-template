import App from './App.vue';
import {createSSRApp} from 'vue';
import createStore from './store';
import {isPromise} from './utils';
import createRouter from './router';
import {sync} from 'vuex-router-sync';
import {renderToString} from '@vue/server-renderer';
import {createMemoryHistory} from 'vue-router';

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
  app.use(router);
  app.use(store);
  app.config.globalProperties.$req = req;
  await router.push(req.originalUrl);
  try {
    await router.isReady();
    const ctx = {};
    const html = await renderToString(app, ctx);
    const preloadLinks = renderPreloadLinks(ctx.modules, manifest);
    const state = JSON.stringify(store.state);
    return [html, state, preloadLinks];
  } catch (error) {
    console.log(error);
  }
}

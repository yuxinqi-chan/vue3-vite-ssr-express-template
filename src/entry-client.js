import App from './App.vue';
import createStore from './store';
import {createApp} from 'vue';
import createRouter from './router';
import {sync} from 'vuex-router-sync';
import {createWebHistory} from 'vue-router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const router = createRouter(createWebHistory());
const store = createStore();
sync(store, router);

const app = createApp(App);
app.use(router);
app.use(store);
app.use(ElementPlus);
// router.beforeResolve((to, from, next) => {
//
//     let diffed = false;
//     const matched = router.resolve(to).matched;
//     const prevMatched = router.resolve(from).matched;
//     if (from && !from.name) {
//         return next();
//     }
//     const activated = matched.filter((c, i) => {
//         return diffed || (diffed = prevMatched[i] !== c);
//     });
//     if (!activated.length) {
//         return next();
//     }
//     // const matchedComponents = [];
//     // matched.map((route) => {
//     //     matchedComponents.push(...Object.values(route.components));
//     // });
//     // const asyncDataFuncs = matchedComponents.map((component) => {
//     //     const asyncData = component.asyncData || null;
//     //     if (asyncData) {
//     //         const config = {
//     //             store,
//     //             route: to
//     //         };
//     //         if (isPromise(asyncData) === false) {
//     //             return Promise.resolve(asyncData(config));
//     //         }
//     //         return asyncData(config);
//     //     }
//     // });
//     try {next();
//         // Promise.all(asyncDataFuncs).then(() => {
//         //
//         // });
//     } catch (err) {
//         next(err);
//     }
// });

if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__);
}

router.isReady().then(() => {
    if (window.__ASYNC_DATAS__) {
        const asyncDatas = window.__ASYNC_DATAS__;
        const components = router.currentRoute.value.matched.map(m => m.components).flat();
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
    }
    app.mount('#app', true);
});

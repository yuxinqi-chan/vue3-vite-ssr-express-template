import { createStore, useStore } from 'vuex';
export default () => {
    const store = createStore({
        strict: true,

    });
    return store
};
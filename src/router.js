// router.js
import {createRouter} from 'vue-router';
import Home from './components/Home.vue';
import Abort from './components/Abort.vue';

const routes = [
  {name: 'home', path: '/', component: Home},
  {name: 'about', path: '/abort', component: Abort}
];

export default function (history) {
  return createRouter({
    history,
    routes
  });
}

<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png"/>
    <router-link :to="{ path: '/' }">/home</router-link>
    <router-link :to="{ path: '/abort' }">/abort</router-link>
    <router-view :msg="msg"/>
  </div>
</template>

<script>
import HelloWorld from './components/Home.vue';

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data() {
    return {
      msg: 'Welcome  '
    };
  },
  serverPrefetch() {
    this.msg = 'Welcome to the server!';
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

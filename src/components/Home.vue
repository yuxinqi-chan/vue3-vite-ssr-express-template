<template>
  <div>{{ count }}</div>
  <button @click="count++">click me</button>
  <div v-for="(post,i) in posts" :key="i">{{ post.title }}</div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  created() {
  },
  data() {
    return {
      count: 2,
      posts: [],
    };
  },
  async asyncData({req}) {
    let posts = await req.postService.getPosts();
    return {
      posts
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>

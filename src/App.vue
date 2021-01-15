<template>
  <div id="app"  v-loading="loading">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      loading: false
    };
  },
  computed: {
    isLogin() {
      return this.$store.getters.getIsLoding;
    }
  },
  watch: {
    $router(to, from) {
      console.log(to, from);
    },
    isLogin: function(old, newd) {
			this.loading = old;
		},
  }
}
</script>

<style>
ul {
  list-style: none;
}
a {
  text-decoration: none;
}
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: "Microsoft YaHei", "Helvetica", "Tahoma", "Geneva", "Arial", sans-serif;
  background-color: #eee;
}
</style>

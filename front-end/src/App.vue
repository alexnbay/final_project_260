<template>
  <div id="app">
    <header class="menu_header">
      <div class="menu_title">
        <h1>Sociality</h1>
      </div>
      <nav class="menu_nav">
        <router-link to="/">Home</router-link>
        <router-link to="/profile" v-if="user">Profile</router-link>
      </nav>
    </header>
    <router-view/>
    <div class="footer"><a href="https://github.com/alexnbay/final_project_260">Github Source Code</a></div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  async created() {
    try {
      let response = await axios.get('/api/users');
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }
  },
  computed: {
    user() {
      return this.$root.$data.user;
    }
  }
}
</script>

<style>

#app
{
  background-color: #5b8c81;
}

.menu_header{
  height: 60px;
  width: 100%;
  background-color: #5b8c81;
  color: white;
  display: flex;
  flex-wrap: wrap;
  /*justify-content: center;*/
  align-items: center;
}

.menu_title {
  text-align: center;
  padding: 10px;
  margin-right: 20px;
  margin-left: 20px;
  height: 40px;
}

.menu_nav {
  padding: 10px;
}

.menu_nav router-link {
  text-decoration: none;
  color: white;
}

a {
  text-decoration: none;
  color: white;
  margin: 10px;
}

h1 {
  margin: 0px;
}

.footer {
  width: 100%;
  height: 30px;
  background-color: #5b8c81;
  color: white;
  text-align: center;
  padding: 10px;

}

.footer a {
  text-decoration: none;
  color: white;

}

</style>

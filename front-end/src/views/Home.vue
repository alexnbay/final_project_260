<template>
  <div class="home">
    <Stream v-if="user" />
    <Login v-else />
  </div>
</template>


<script>
import Stream from '@/components/Stream.vue';
import Login from '@/components/Login.vue';
import axios from 'axios';
export default {
  name: 'Home',
  components: {
    Stream,
    Login,
  },
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

<style scoped>

.home{
  background-color: #a5d1c6;
}
</style>

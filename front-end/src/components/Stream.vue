<template>
<div class="main">
  <div class="menu">
    <h2>{{user.firstName}} {{user.lastName}} <a @click="logout">Logout</a></h2>
  </div>
  <div class="title"><h2>Post Stream</h2></div>
  <div class="stream">
    <div v-for="post in posts" :key="post._id">
      <div class="post_ind">
        <div class="post_title"><h4>{{post.title}}</h4></div>

        <div class="post_time"><p><em>{{post.time}}</em></p></div>
        <div class="post_contents"><p>{{post.contents}}</p></div>
      </div>
    </div>
  </div>
</div>
</template>




<script>
import axios from 'axios';
export default {
  name: 'Stream',
  data() {
    return {
      personID: "",
      posts: [],
      friends: [],


    }
  },
  created(){
    this.getInformation();
  },
  computed: {
    user() {
      return this.$root.$data.user;
    },
  },
  methods: {
    async logout() {
      try {
        await axios.delete("/api/users");
        this.$root.$data.user = null;
      } catch (error) {
        this.$root.$data.user = null;
      }
    },
    async getInformation() {
      let response = await axios.get("/api/persons/user");
      this.personID = response.data._id;
      this.friends = response.data.friends;
      console.log(this.friends);
      var friend;
      for( friend in this.friends ){
        if(this.friends[friend] != -1){
          let response2 = await axios.get("/api/posts/" + this.friends[friend]);
          console.log(response2.data);
          var post;
          for(post in response2.data)
            this.posts.push(response2.data[post]);
        }
      }
      this.posts.sort((a,b)=>{
        if(a.time > b.time) return -1;
        if (b.time > a.time) return 1;
        return 0;
      });

    },
    async getName(personID){
      let response = await axios.get("api/persons/" + personID);
      return response.data.name;
    }
  }
}
</script>

<style scoped>
.menu {
  display: flex;
  justify-content: center; /*space-between*/
  padding: 20px;
  color: #31574e;
  text-align: center;
  background-color: #a5d1c6;

}

.title{
  text-align: center;
  font-size: 25px;
  margin: 10px;
  color: #31574e;
}

.stream{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.menu h2 {
  font-size: 14px;
}

.post_ind {
  border-radius: 10px;
  width: 600px;
  background-color: #dcf2ed;
  color: #31574e;
  margin: 30px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  text-align: center;
  padding: 20px;
}

.post_title {
  width: 100%;
}

.post_time {
  width: 100%;
}

.post_name{
  width: 100%;
}

a {
  color: #31574e;
}


@media only screen and (max-width: 601px) {
  .post_ind {
    width: 80%;
    margin: auto;
    margin-top: 20px;
    margin-bottom: 20px;
  }
}

</style>

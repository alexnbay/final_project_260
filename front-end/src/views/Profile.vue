<template>
<div class="profile">

  <div class="name_box">
    <div class="name"><h1>{{name}}</h1></div>
    <button @click="edit_name">Edit</button>
  </div>
  <div class="name_box editing" v-if="editing_name">
    <input v-model="name">
    <button @click="name_done">Done</button>
  </div>


  <div class="column_one">
    <div class="birthdate_meta">
      <div class="birthdate_box">
        <div class="birthdate_title_box">
          <div class="birthdate_title"><h3>My Birthdate Is:</h3></div>
          <button @click="edit_birthdate">Edit</button>
        </div>
        <div class="birthdate"><p>{{birthdate}}</p></div>
      </div>
      <div class="birthdate_box_editing" v-if="editing_birthdate">
        <input v-model="birthdate">
        <button @click="birthdate_done">Done</button>
        </div>
    </div>

    <div class="description_meta">
      <div class="description_box">
        <div class="description_title_box">
          <div class="description_title"><h3>About Me:</h3></div>
          <button @click="edit_description">Edit</button>
        </div>
        <div class="description"><p>{{description}}</p></div>
      </div>
      <div class="description_box_editing" v-if="editing_description">
        <textarea v-model="description"></textarea>
        <button @click="description_done">Done</button>
      </div>
    </div>
  </div>

  <div class="column_two">
    <div class="friends_box">
      <div class="friends_title_box">
        <div class="friends_title"><h3>Friends:</h3></div>
        <button @click="switch_friends">{{show_text}}</button>
      </div>
      <div class="friends_show" v-if="friends_shown">
        <div v-for="name in names" :key="name">
          <div class="friend_ind"><p>{{name}}</p></div>
        </div>
      </div>
      <div class="editing_friend_box">
        <div class="adding_friend">
          <input v-model="friend_to_add">
          <button @click="add_friend">Add</button>
        </div>
        <div class="deleting_friend">
          <input v-model="friend_to_delete">
          <button @click="delete_friend">Delete</button>
        </div>
      </div>
    </div>
  </div>





  <div class="posts_meta">
    <div class="posts_title"><h3>Posts</h3></div>
    <div class="buttons_box">
      <button @click="new_post">New Post</button>
      <button @click="edit_post">Edit Post</button>
      <button @click="delete_post">Delete Post</button>
    </div>
    <div class="new_post_box" v-if="creating_post">
      <div class="new_post_title_box">
        <input v-model="new_post_title" placeholder="Title">
        <button @click="create_post">Done</button>
      </div>
      <textarea v-model="new_post_description"></textarea>
    </div>
    <div class="edit_post_box" v-if="editing_post">
      <div class="find_box" v-if="!post_found">
        <input v-model="to_edit">
        <button @click="search_for_post">Search</button>
      </div>
      <div class="found_box" v-if="post_found">
        <div class="found_box_title">
          <input v-model="edit_post_title">
          <button @click="update_post">Done</button>
        </div>
        <textarea v-model="edit_post_description"></textarea>
      </div>
    </div>
    <div class="delete_post_box" v-if="deleting_post">
      <input v-model="to_delete">
      <button @click="delete_me">Delete</button>
    </div>

    <div class="posts_box">
      <div v-for="post in posts" :key="post._id">
        <div class="post_ind">
          <div class="post_title"><h4>{{post.title}}</h4></div>
          <div class="post_time"><p>{{post.time}}</p></div>
          <div class="post_description"><p>{{post.contents}}</p></div>
        </div>
      </div>
    </div>

  </div>

</div>

</template>







<script>
import axios from 'axios';
import moment from 'moment';

export default {
  name: 'Profile',
  data() {
    return {
      personID: "",
      name: "",
      editing_name: false,
      birthdate: "",
      editing_birthdate: false,
      description: "",
      editing_description: false,
      friends_shown: false,
      friends: [],
      names:[],
      editing_post: false,
      to_edit: "",
      post_found: false,
      edit_post_title: "",
      edit_post_description: "",
      creating_post: false,
      new_post_title: "",
      new_post_description: "",
      show_text:"Show",
      posts: [],
      current_post:"",
      deleting_post: false,
      to_delete: "",
      friend_to_add: "",
      friend_to_delete: "",
    }
  },
  created() {
    this.getInformation();
  },
  methods: {
    async getInformation() {
      try{
        let response = await axios.get("/api/persons/user");
        if(response.data){
          let person = response.data;
          this.personID = person._id;
          this.name = person.name;
          this.birthdate = person.birthdate;
          this.description = person.description;
          this.friends = person.friends;
        }

        var friend;
        this.names = [];
        for(friend in this.friends){
          console.log("friendddd " + this.friends[friend]);
          if( this.friends[friend] != -1){
            let response2 = await axios.get("/api/persons/"+ this.friends[friend]);
            console.log(response2);
            if(response2.data){
              this.names.push(response2.data.name);
              }
          }
        }
        console.log("names done");

        let response3 = await axios.get("/api/posts/" + this.personID);
        this.posts = response3.data;


      } catch (error){
        console.log(error);
      }

    },
    async update_person() {
      await axios.put("/api/persons/" + this.personID, {
        name: this.name,
        birthdate: this.birthdate,
        description: this.description,
        friends: this.friends,
      })
    },
    edit_name(){
      this.editing_name = true;
    },
    async name_done(){
      this.editing_name = false;
      await this.update_person();
    },
    edit_birthdate(){
      this.editing_birthdate = true;
    },
    async birthdate_done(){
      this.editing_birthdate = false;
      await this.update_person();
    },
    edit_description(){
      this.editing_description = true;
    },
    async description_done(){
      this.editing_description = false;
      await this.update_person();
    },
    switch_friends(){
      if(this.show_text === "Show")
        this.show_text = "Hide"
      else {
        this.show_text = "Show";
      }
      this.friends_shown = !this.friends_shown;
    },
    async add_friend(){
      try {
        if(this.friend_to_add != ""){
          let response = await axios.get("/api/persons/name/" + this.friend_to_add);
          console.log(response);
          console.log(response.data[0]._id);
          if(response.data[0]){
            console.log("pushing data");
            if (!(response.data[0]._id in this.friends))
              this.friends.push(response.data[0]._id);
          }
          await this.update_person();
          await this.getInformation();
        }
      } catch (error) {
        console.log(error);
      }
      this.friend_to_add = "";

    },
    async delete_friend(){
    try {
      if(this.friend_to_delete != ""){
        let response = await axios.get("/api/persons/name/" + this.friend_to_delete);
        console.log(response);
        console.log(response.data[0]._id);
        if(response.data[0]){
          console.log("removing data");
          for(var i = 0; i < this.friends.length; i++){
            if(this.friends[i] == response.data[0]._id)
              this.friends[i] = -1;
          }
        }
        await this.update_person();
        await this.getInformation();
      }
    } catch (error) {
      console.log(error);
    }
    this.friend_to_delete = "";

    },
    new_post(){
      this.creating_post = true;
    },
    edit_post(){
      this.editing_post = true;
    },
    search_for_post(){
      var post;
      for(post in this.posts){
        if(this.posts[post].title === this.to_edit){
          this.current_post = this.posts[post]._id;
          this.post_found = true;
          this.edit_post_title = this.posts[post].title;
          this.edit_post_description = this.posts[post].contents;
        }
      }
    },
    async update_post(){
      try{

        this.editing_post = false;
        let cur_time = moment().format('MMMM Do YYYY, h:mm:ss a');

        await axios.put("/api/posts/" + this.current_post, {
          title: this.edit_post_title,
          description: this.edit_post_description,
          time: cur_time,
        });

        await this.getInformation();

      } catch (error){
        console.log(error);
      }
    },
    async create_post(){
      try {
        let cur_time = moment().format('MMMM Do YYYY, h:mm:ss a');
        this.creating_post = false;
        axios.post("/api/posts", {
          personID: this.personID,
          title: this.new_post_title,
          contents: this.new_post_description,
          time: cur_time,
        });
        this.new_post_title = "";
        this.new_post_description = "";
        await this.getInformation();

      } catch (error){
        console.log(error);
      }
    },
    delete_post(){
      this.deleting_post = true;
    },
    async delete_me(){
      try{
        console.log("calling dlete");
        this.deleting_post = false;
        var post2 = {};
        for(post2 in this.posts){
          console.log(post2);
          if(this.posts[post2].title === this.to_delete){
            console.log("found mathc");
            await axios.delete("/api/posts/" + this.posts[post2]._id);
            this.to_delete = "";
          }
        }
        await this.getInformation();
      } catch (error) {
        console.log(error);
      }
    },


  }
}



</script>


<style scoped>




.profile {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width:100%;
  background-color: #a5d1c6;
  color:#31574e;
  margin: auto;
}

.name_box {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.name {
  text-align: center;
  width: auto;
  margin: 20px;
}

.name_box button {
  width: 50px;
  height: 50px;
}

.column_one, .column_two {
  width: 400px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}



.birthdate_meta{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  width: 360px;
  background-color: #dcf2ed;
  border-radius: 10px;
  color: #31574e;
  margin: 20px;
}

.birthdate_box{
  display:flex;
  justify-content: center;
  flex-wrap: wrap;
  text-align: center;
}

.birthdate_title_box{
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  height: 50px;
  align-items: center;
}
.birthdate_title_box button{
  height: 40px;
  margin-left: 10px;
}

.birthdate{
  width: 100%
}

.birthdate_box_editing{
  display: flex;
  justify-content: center;
  margin: 10px;
}

.birthdate_box_editing input{
  width: 250px;
  height: 25px;
}
.birthdate_box_editing button {
  width: 60px;
  height: 25px;
}

.description_meta{

  display:flex;
  flex-wrap: wrap;
  justify-content: center;

  width: 360px;
  background-color: #dcf2ed;
  border-radius: 10px;
  color: #31574e;
  margin: 20px;
}
.description_box{
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.description_title_box{
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  height: 50px;
}
.description_title_box button{
  height: 40px;
  margin-left: 10px;
}

.description_box_editing{
  display: flex;
  justify-content: center;
  flex-wrap:wrap;
  margin: 10px;
}

.description_box_editing textarea{
  width: 250px;
  height: 60px;
}
.description_box_editing button {
  width: 60px;
  height: 60px;
}

.friends_box{
  display:flex;
  flex-wrap: wrap;
  justify-content: center;

  width: 360px;
  background-color: #dcf2ed;
  border-radius: 10px;
  color: #31574e;
  margin: 20px;
}

.friends_title_box {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 300px;
  height: 50px;
  align-items: center;
}

.friends_title_box button {
  height: 40px;
  margin-left: 10px;
}

.friends_show{
  width: 300px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.friend_ind {
  width: 80px;
  margin: 10px;
}

.editing_friend_box{
  height: 80px;
  width: 360px;
  padding: 15px;
}

.adding_friend input{
  width: 260px;
  height: 25px;
}
.adding_friend button {
  width: 60px;
  height: 25px;
}

.deleting_friend input{
  width: 260px;
  height: 25px;
}
.deleting_friend button {
  width: 60px;
  height: 25px;
}



.posts_meta{
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.posts_title, .buttons_box {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 10px;
  text-align: center;
}

.new_post_title, .edit_post_box,
.delete_post_box, .find_box, .found_box,
.new_post_title_box, .new_post_box, .found_box_title{
  width: 600px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 10px;
}

.new_post_box textarea {
    height: 80px;
    width: 300px;
}

.found_box textarea {
  height: 80px;
  width: 300px;
}


.posts_box{
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
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
.post_title{
  width: 100%;
  height: 30px;
}
.post_time {
  width: 100%;
  margin: 10px;
  height: 20px;
}
.post_description {
  width: 100%;
}

@media only screen and (min-width: 402px) and (max-width: 600px) {
  .new_post_title, .edit_post_box, .posts_title,
  .delete_post_box, .buttons_box, .find_box, .found_box,
  .new_post_title_box, .new_post_box, .found_box_title, {
    width: 90%;

  }
  .posts_meta{
    width: 100%
  }

  .post_ind {
    margin: auto;
    margin-top: 20px;
    margin-bottom: 10px;
    width: 90%;

  }



}


@media only screen and (max-width: 401px) {
  .new_post_title, .edit_post_box, .posts_title,
  .delete_post_box, .buttons_box, .find_box, .found_box,
  .new_post_title_box, .new_post_box, .found_box_title,
  .post_ind  {
    width: 90%;
  }
  .posts_meta{
    width: 100%
  }

  .post_ind {
    margin: auto;
    margin-top: 20px;
    margin-bottom: 10px;
    width: 90%;

  }

  .description_box_editing textarea
  .new_post_box textarea,
  .found_box textarea {
    width: 80%;
  }

  .editing_friend_box{
    height: 80px;
    width: 80%;
    padding: 15px;
  }
  .adding_friend input,
  .deleting_friend input{
    width: 70%;
  }
  .adding_friend button,
  .deleting_friend button {
    width: 60px;
    height: 25px;
  }

  .friends_title_box {
    width: 80%;
  }

  .friends_show{
    width: 300%;
  }

  .birthdate_meta,
  .description_meta,
  .friends_box{
    width: 90%;
  }

  .birthdate_title_box,
  .birthdate,
  .description_title_box,
  .description_box{
    width: 90%;

  }

  .column_one, .column_two {
    width: 90%;
  }


}

</style>

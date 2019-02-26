<!-- /**************************************
Feature 7 Add a new member to the calendar
**************************************/ -->
<template>
    <div>
<script type="text/x-template" id="modal-template">
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              default header
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="modal-default-button" @click="$emit('close')">
                Delete One More
              </button>
              <button class="modal-default-button">
                <a :href="linkToCalendar" class="linkFontStyle">Back To Calendar</a>
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</script>
    <h1>Adding Member</h1>
    <div>
    <div class="testClassII"><p>Welcome, {{emailUnderName}}</p></div>
    <div class="morespace">
    <div class="newRow">
    <!-- <img src="../../static/img/joinus.png" alt="joinPic" /> -->
    <input class="elem inputBox adjust" v-model="message" placeholder="Sample Name: Li Lei">
    <button class="elem buttonOrg adjust" id="show-modal" v-on:click="upload">Confirm</button>
    </div>
    <p class = "topmargin">HINT：Please type the name in the input-box then click the confirm button to delete a person.</p>
    </div>
     <!-- use the modal component, pass in the prop -->
  <modal v-if="showModal" @close="showModal = false">
    <!--
      you can use custom content here to overwrite
      default content
    -->
    <h3 slot="header">A Member Deleted</h3>
  </modal>
    </div>
    </div>
</template>

<script>
export default {
    data() {
      return {
          message: "",
          showModal: false,
          emailUnderName: null,
      } 
    },
    methods:{
      //only TA and Manager have access to add a person
      upload() {
        if(this.emailUnderName.match("Karen Zheng") == "Karen Zheng"||this.emailUnderName.match("Anik Shen") == "Anik Shen"||this.emailUnderName.match("Anita Yang") == "Anita Yang"||this.emailUnderName.match("Van Pan") == "Van Pan"||this.emailUnderName.match("Danielle Zhao") == "Danielle Zhao"){//this.userName.match(this.person.name) == this.person.name
          this.$http.post(this.apiPath, this.apiPayload); 
          this.showModal = true
        }
      },
      personinfo: function() {
        return new Promise((resolve, reject) => {
          this.$http.get("/.auth/me").then((response)=> {
            for(const a of response.data[0].user_claims) {
              if(a.typ == "name"){ 
                this.emailUnderName = a.val;
              } 
            }
          }).catch((error) => {
            this.emailUnderName = "Anik Shen";
            reject(error)
          })
        })
      }
    },
    mounted() {
        this.personinfo();
        console.log(this.$router.currentRoute.path)
    },
    computed:{
        apiPath() {
            return (
                "/api/" +
                this.$router.currentRoute.path
            );
        },
        apiPayload() {
            return {
                name: this.message,
                randomNumber: this.$randomNumber
            };
        },
    }
}
</script>

<style>
.newRow {
  display: flex;
  margin-top: 200px;
  justify-content: center;
  
}
.elem {
    margin-left: 20px;
    margin-right: 60px;
}
.textElem {
    margin: 15px;
    margin-left: 60px;

}
.buttonOrg {
  background-color: #4CAF50; /* Green */
  border: none;
  color: rgb(255, 255, 255);
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;

}
.inpuBox {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  /* padding: 15px 32px; */
  text-decoration: none;
  display: inline-block;
  height:20px;
}
.morespace {
    height: 450px;
}

.adjust {
    margin-top: 100px;
    height: 60px;
}
.topmargin {
    margin-top: 165px;

}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 500px;
  height: 200px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #222;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
  font-size: 25px;
}

.modal-body {
  margin: 20px 0;
  margin-bottom: 70px;
}

.modal-default-button {
  background-color: #4CAF50; /* Green */
  border: none;
  color: rgb(255, 255, 255);
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 20px;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.linkFontStyle {
    font-size: 16px;
    color: #FFF;
    text-decoration: none;
}
.testClassII {
    text-align: right;
}
</style>

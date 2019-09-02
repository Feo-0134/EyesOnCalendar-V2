<!-- /**************************************
Feature 7 Add a new member to the calendar
**************************************/ -->
<template>
  <el-container>
  <el-header>Adding Member</el-header>
  <p>Welcome, {{emailUnderName}}</p>
    <el-main>
      <img src="../../static/img/joinus.png" alt="joinPic" />
      <div class="inputBox">
       Alias:
      <el-input v-model="inputAlias" placeholder="eg. danzha"></el-input>
       Name:
      <el-input v-model="inputName" placeholder="eg. Danielle Zhao"></el-input>
      </div>
      <div class="inputBox">
       Role:
      <el-input v-model="inputRole" placeholder="eg. FTE / Vendor"></el-input>
       Principle:
      <el-input v-model="inputPrinciple" placeholder="eg. TM / TA / None"></el-input>
      </div>
      <el-button type="primary" v-on:click="upload">Confirm</el-button>
      <el-button type="primary" v-on:click="linkToCalendar">Back to Calendar</el-button>
    </el-main>
  </el-container>
</template>

<script>
export default {
    data() {
      return {
        inputName: "",
        inputRole: "",
        inputAlias:"",
        inputPrinciple:"",
        message:"",
        showModal: false,
        emailUnderName: null,
        admin:false,
        back2homepage:false,
        person: {
          alias:"",
          name:"",
          role:"",
          principle:""
        },
      }
    },
    methods:{
      //only TA and Manager have access to add a person
      upload() {
        if(this.inputName == "" || this.inputRole == "" || this.inputAlias == ""|| this.inputPrinciple == "") {
          this.addFeedback('notify', 'Please fill the blanks.')
          // console.log('err0')
          return;
        }
        // name
        var nameStr
        if(this.inputName.toString() === ' ') {
          // console.log('err1')
          this.addFeedback('notify', 'Name invalid. eg. Danielle Zhao')
          return;
        }
        var nameArr = this.inputName.toString().toLowerCase().split(" ");
        if(nameArr.length > 1) {
          nameArr[0] = (nameArr[0].toString())[0].toUpperCase() + (nameArr[0].toString()).substr(1);
          nameArr[nameArr.length - 1] = nameArr[nameArr.length - 1][0].toUpperCase() + nameArr[nameArr.length - 1].substr(1);
          nameStr = nameArr[0] + " " + nameArr[nameArr.length - 1];
          // console.log(nameStr)
        }else {
          // console.log('err1')
          this.addFeedback('notify', 'Name invalid. eg. Danielle Zhao')
          return;
        }
        // role
        var roleStr
        if(this.inputRole == "FTE" || this.inputRole == "fte") {
          roleStr = "FTE";
        }else if(this.inputRole == "Vendor" || this.inputRole == "vendor" || this.inputRole == "v") {
          roleStr = ""
        }else {
          // console.log('err2')
          this.addFeedback('notify', 'Role invalid. eg. FTE or Vendor')
          return;
        }
        // alias
        var aliasStr
        if(this.inputAlias.toString() === ' ') {
          // console.log('err5')
          this.addFeedback('notify', 'alias invalid. eg. danzha')
          return;
        }
        if(this.inputRole == "Vendor" || this.inputRole == "vendor" || this.inputRole == "v") {
          if(this.inputAlias.toString().match('v-') != 'v-') {
            // console.log('err5')
            this.addFeedback('notify', 'vendor alias with no \'v-\' is invalid.')
            return;
          }
        }
        if(this.inputAlias[0] == "(" && this.inputAlias[(this.inputAlias).length-1] == ")") {
          aliasStr = this.inputAlias
        }else {
          aliasStr = "(" + this.inputAlias + ")";
        }
        this.message = nameStr + " " + roleStr +  " " + aliasStr
        // console.log(this.apiPayload)
        if(this.admin) {
          new Promise((resolve, reject) => {
            this.$http.post(this.apiPath, this.apiPayload)
            .then((response)=> {
              // console.log(response)
              if(response.data == "success") {
              // console.log('err3');
              this. addFeedback('success', 'Person Added to Team')}
              else{
                // console.log('err4');
              this.addFeedback('notify', 'This employee is already in the system.');}
            })
            .catch((error) => {
              // console.log(error.response)
              this.addFeedback('error', 'System Error. Please turn to the developer.');
            })
          }) 
        }
      },
      addFeedback(type, msg) {
        const h = this.$createElement;
        if(type == 'error') {
          this.$notify.error({
            title:'Request Denied',
            message: msg,
            position:'top-left',
            duration: 0
          });
        }
        if(type == 'notify') {
          this.$notify({
            title:'Notification',
            message: msg,
            position:'top-left',
            duration: 0,
            type:'warning'
          });
        }
        if(type == 'success') {
          this.$notify({
            title: 'Success',
            message: h('i', { style: 'color: teal'}, msg),
            position:'top-left',
            type: 'success',
            duration: 0
          });
        }
      },
      personinfo: function() {
        return new Promise((resolve, reject) => {
          this.$http.get("/.auth/me").then((response)=> {
            if(response.data[0].user_claims) {
              for(const a of response.data[0].user_claims) {
                if(a.typ == "name"){
                  this.emailUnderName = a.val
                }
              }   
            }else {
              this.emailUnderName = "Danielle Zhao"
            }
            if(this.emailUnderName.match("Juncheng Zhu") == "Juncheng Zhu" 
            ||this.emailUnderName.match("Karen Zheng") == "Karen Zheng"
            ||this.emailUnderName.match("Anik Shen") == "Anik Shen"
            ||this.emailUnderName.match("Danielle Zhao") == "Danielle Zhao" 
            ||this.emailUnderName.match("Dingsong Zhang") == "Dingsong Zhang"
            ||this.emailUnderName.match("Anita Yang") == "Anita Yang"
            ||this.emailUnderName.match("Sean Wu (AZURE)") == "Sean Wu (AZURE)")
              this.admin = true;
          }).catch((error) => {
            reject(error)
          })
        })
      },
      linkToCalendar() {
          this.$router.push((this.$router.currentRoute.path).replace('/person',''));
      },
    },
    mounted() {
        this.personinfo();
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
 .el-header {
    background: rgb(37, 37, 37);
    color: #fff;
    text-align: center;
    line-height: 60px;
    font-family: Roboto Condensed,sans-serif;
    font-size: 40px;
  }
  
  .el-main {
    background: rgb(37, 37, 37);
    color: #fff;
    text-align: center;
    line-height: 150px;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }

  .inputBox .el-input {
    width: 20%;
    margin: 5px;
  }
  
  .inputBox {
    width:100%;
    position:relative;
  }

  .toolCase {
    margin:10px;
    height: 50px;
  }

</style>

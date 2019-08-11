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
       Name:
      <el-input v-model="inputName" placeholder="eg. Danielle Zhao"></el-input>
       FTE/Vendor:
      <el-input v-model="inputRole" placeholder="eg. FTE / Vendor"></el-input>
       Alias:
      <el-input v-model="inputAlias" placeholder="eg. danzha"></el-input>
      
      </div>
      <el-button type="primary" v-on:click="upload">Confirm</el-button>
      <el-button type="info" v-on:click="linkToCalendar">Back to Calendar</el-button>
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
        message:"",
        showModal: false,
        emailUnderName: null,
        admin:false,
        back2homepage:false,
      }
    },
    methods:{
      //only TA and Manager have access to add a person
      upload() {
        if(this.inputName == "" || this.inputRole == "" || this.inputAlias == "") {
          alert("please fill the blanks")
          return;
        }
        // name
        var nameStr
        var nameArr = this.inputName.toString().split(" ");
        if(nameArr.length > 1) {
          nameArr[0][0].toUpperCase();
          nameArr[nameArr.length - 1][0].toUpperCase();
          nameStr = nameArr[0] + nameArr[1];
        }else {
          alert("Name Format Unmatch. eg. Meimei Han")
          return;
        }
        // role
        var roleStr
        if(this.inputRole == "FTE" || this.inputRole == "fte") {
          roleStr = "FTE";
        }else if(this.inputRole == "Vendor" || this.inputRole == "vendor" || this.inputRole == "v") {
          roleStr = ""
        }else {
          alert("Role Keyword Error. eg. FTE or Vendor")
          return;
        }
        // alias
        var aliasStr
        if(this.inputAlias[0] == "(" && this.inputAlias[(this.inputAlias).length-1] == ")") {
          aliasStr = this.inputAlias
        }else {
          aliasStr = "(" + this.inputAlias + ")";
        }
        this.message = nameStr + " " + roleStr +  " " + aliasStr
        
        if(this.admin) {
          new Promise((resolve, reject) => {
            this.$http.post(this.apiPath, this.apiPayload)
            .then((response)=> {
              console.log(response)
              if(response.data == "all good") {this.openSuccess()}
              else{alert("Insert Error: Person Exist")}
            })
            .catch((error) => {
              console.log(error.response)
              alert("System Error")
            })
          }) 
        }
      },
      openSuccess() {
        const h = this.$createElement;
        this.$notify({
          title: 'Notification',
          message: h('i', { style: 'color: teal'}, 'Person Added to Team')
        });
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
              this.emailUnderName = "Juncheng Zhu"
            }
            if(this.emailUnderName.match("Juncheng Zhu") == "Juncheng Zhu" 
            ||this.emailUnderName.match("Karen Zheng") == "Karen Zheng"
            ||this.emailUnderName.match("Anik Shen") == "Anik Shen"
            ||this.emailUnderName.match("Dingsong Zhang") == "Dingsong Zhang"
            ||this.emailUnderName.match("Anita Yang") == "Anita Yang"
            ||this.emailUnderName.match("Danielle Zhao") == "Danielle Zhao" 
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

  .el-input {
    width: 200px;
    margin: 20px;
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

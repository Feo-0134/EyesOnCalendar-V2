<template>
  <div>
      <div>
        <div class="testClass">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link"><i class="el-icon-arrow-down el-icon--right"></i> SELECT POD</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="/AppService">&gt; AppService</el-dropdown-item>
              <el-dropdown-item command="/DEV">&gt; DEV</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          
          <a :href="goAddPerson" v-if="admin" class="sectionPointer">&gt; AddPerson</a>
          <a :href="goDeletePerson" v-if="admin" class="sectionPointer">&gt; DeletePerson</a>
          <a :href="goReport" v-if="admin" class="sectionPointer">&gt; Report</a>
        </div>
      </div>
      <div class="testClassII"><p>Welcome, {{emailUnderName}}</p></div>
      <h1><a :href="prevMonth" class="pointer">&lt;</a>{{prettyDate}}<a :href="nextMonth" class="pointer">&gt;</a></h1>
      <h2 v-if="!month">{{message}}</h2>
      <button v-if="!month" class = "button" v-bind:class="{buttonBackground: initUndo}" v-on:click="init">Init Table</button>
      <button v-if="!month" v-bind:class="{buttonBackground: !initUndo}" class = "button" v-on:click="reload">Reload Table</button>
      <div v-if="month">
          <el-tabs id="tabsJuncheng" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="All Members" name="first">
               <div id="tablehead" v-bind:class="{sticky: scrolled}" class="row tablehead">
                <div class="name"></div>
                <div v-for="(p,index) in month.people[0].days" :key="index" class="cellx">{{index+1}}</div>
              </div>
              <!-- /************************************** Feature 3 on-duty rate **************************************/ -->
              <div id="tablehead" class="row tablehead">
                <div class="name attendance">On Duty</div>
                <div v-for="(p,index) in month.people[0].days" :key="index" class="cellx">{{percentage(index)}}%</div>
              </div>
              <person  v-for="(p,index) in month.people" v-bind:key="p._id" v-bind:pindex="index" v-bind:person="p" :userName="emailUnderName"/>
            </el-tab-pane>
            <el-tab-pane label="FTE Members" name="second">
              <div id="tablehead" v-bind:class="{sticky: scrolled}" class="row tablehead">
                <div class="name"></div>
                <div v-for="(p,index) in month.people[0].days" :key="index" class="cellx">{{index+1}}</div>
              </div>
              <!-- /************************************** Feature 3 on-duty rate **************************************/ -->
              <div id="tablehead" class="row tablehead">
                <div class="name attendance">On Duty</div>
                <div v-for="(p,index) in month.people[0].days" :key="index" class="cellx">{{percentageFTE(index)}}%</div>
              </div>
              <person  v-for="(p,index) in month.people" v-show="p.name.match('FTE')=='FTE'" v-bind:key="p._id" v-bind:pindex="index" v-bind:person="p" :userName="emailUnderName"/>
            </el-tab-pane>
            <el-tab-pane label="Vendor Members" name="third">
               <div id="tablehead" v-bind:class="{sticky: scrolled}" class="row tablehead">
                <div class="name"></div>
                <div v-for="(p,index) in month.people[0].days" :key="index" class="cellx">{{index+1}}</div>
              </div>
              <!-- /************************************** Feature 3 on-duty rate **************************************/ -->
              <div id="tablehead" class="row tablehead">
                <div class="name attendance">On Duty</div>
                <div v-for="(p,index) in month.people[0].days" :key="index" class="cellx">{{percentageVendor(index)}}%</div>
              </div>
              <person  v-for="(p,index) in month.people" v-show="p.name.match('v-')=='v-'" v-bind:key="p._id" v-bind:pindex="index" v-bind:person="p" :userName="emailUnderName"/>
            </el-tab-pane>
          </el-tabs>
      </div>
      <help-screen />
      <transition name="fade">
        <loading v-if="isLoading"></loading>
      </transition>
  </div>
</template>

<script>
import Person from "@/comps/PersonRow";
import HelpScreen from "@/comps/HelpScreen";
import Loading from "@/components/LoadButton";
import moment from "moment";



export default {
  components: { Person, HelpScreen, Loading },
  data() {
    return {
      message: "Loading month...",
      scrolled: false,
      changed: false,
      emailUnderName: null,
      initUndo:true,
      admin:false,
      //initDone:false,
      isLoading: false,
      activeName: 'first'
    };
  },
  asyncComputed: {
    month: {
      async get() {
        try {
          var res = await this.$http.get("/api" + this.date);
          this.socket = io({
            query: {
              path: this.date
            }
          });
          this.socket.on("update", data => {
            if (data.randomNumber == this.$randomNumber) return;
            this.month.people[data.indexes.p].days[data.indexes.d].workDay =
              data.workDay;
            this.month.people[data.indexes.p].days[data.indexes.d].workType =
              data.workType;
          });
          res.data.people = res.data.people.sort((x,y)=>{
            return x.name.localeCompare(y.name)
          })
          //console.log(res.data)
          return res.data;
        } catch (e) {
          this.socket = null;
          this.message = "Month not found";
          return null;
        }
      },
      watch() {
        this.changed
      }
    }
  },
  computed: {
    totalamount() {
      return (this.month.people).length
    },
    totalamountFTE() {
      var sum = 0
      for(const b of Object.keys(this.month.people)) {
          if(this.month.people[b].name.match("FTE")=="FTE") {
            sum++
          }
        }
      return sum;
    },
    totalamountVendor() {
      var sum = 0
      for(const b of Object.keys(this.month.people)) {
          if(this.month.people[b].name.match("v-")=="v-") {
            sum++
          }
        }
      return sum;
    },
    date() {
      this.changed=!this.changed
      return this.$router.currentRoute.path;
    },
    dateSplit() {
      return this.date.split("/");
    },
    prettyDate() {
      return moment(this.date, "/YYYY/M").format("MMMM YYYY");
    },
    nextMonth() {
      return  (
        (this.date.split("/")[1] == "DEV"?"/DEV":"/AppService" )+
        moment(this.date, "/YYYY/M")
        .add(1, "M")
        .format("/YYYY/M"))
    },
    prevMonth() {
      return  (
        (this.date.split("/")[1] == "DEV"?"/DEV":"/AppService" )+
        moment(this.date, "/YYYY/M")
        .subtract(1, "M")
        .format("/YYYY/M"));
    },
    /*************************************** Router **************************************/
    goReport() {
      return ((this.date.split("/")[1] == "DEV"?"/DEV":"/AppService") + moment(this.date, "/YYYY/M").format("/YYYY/M") + "/report");
    },
    goAddPerson() {
      return ((this.date.split("/")[1] == "DEV"?"/DEV":"/AppService") + moment(this.date, "/YYYY/M").format("/YYYY/M") + "/person");
    },
    goDeletePerson() {
      return ((this.date.split("/")[1] == "DEV"?"/DEV":"/AppService") + moment(this.date, "/YYYY/M").format("/YYYY/M") + "/delete");
    },
    /*************************************** Feature 3 on-duty rate **************************************/
    percentage:function() {
      return function(val) {
        var sum = 0;
        for(const b of Object.keys(this.month.people)) {
          if(this.month.people[b].days[val].workType == "W"
          ||this.month.people[b].days[val].workType == "MS"
          ||this.month.people[b].days[val].workType == "NS"
          ||this.month.people[b].days[val].workType == "PO"
          ||this.month.people[b].days[val].workType == "PM") {
            sum++
          }
        }
        return ((sum/this.totalamount)*100).toFixed(0)
      }
    },
    percentageFTE:function() {
      return function(val) {
        var sum = 0;
        for(const b of Object.keys(this.month.people)) {
          if(this.month.people[b].name.match("FTE")=="FTE" 
          && (this.month.people[b].days[val].workType == "W"
          ||this.month.people[b].days[val].workType == "MS"
          ||this.month.people[b].days[val].workType == "NS"
          ||this.month.people[b].days[val].workType == "PO"
          ||this.month.people[b].days[val].workType == "PM")) {
            sum++
          }
        }
        if(this.totalamountFTE == 0) return 0;
        return ((sum/this.totalamountFTE)*100).toFixed(0)
      }
    },
    percentageVendor:function() {
      return function(val) {
        var sum = 0;
        for(const b of Object.keys(this.month.people)) {
          if(this.month.people[b].name.match("v-")=="v-" 
          && (this.month.people[b].days[val].workType == "W"
          ||this.month.people[b].days[val].workType == "MS"
          ||this.month.people[b].days[val].workType == "NS"
          ||this.month.people[b].days[val].workType == "PO"
          ||this.month.people[b].days[val].workType == "PM")) {
            sum++
          }
        }
        if(this.totalamountVendor == 0) return 0;
        return ((sum/this.totalamountVendor)*100).toFixed(0)
      }
    },
    /*************************************** Feature 9 init calendar **************************************/
    apiPath() {
      return (
          "/api" +
          this.$router.currentRoute.path +
          "/init"
      );
    },
    apiPayload() {
      return {
          year: "2019",
      };
    },
    apiPath2() {
      return (
          "/api" +
          this.$router.currentRoute.path +
          "/reload"
      );
    },
    apiPayload2() {
      return {
          year: "2019",
      };
    }
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  mounted() {
    window.addEventListener("keyup", ev => {
      this.callUndo(ev);
    });
    this.personinfo();
    //
    setTimeout(()=>{
    if(this.emailUnderName.match("Juncheng Zhu") == "Juncheng Zhu" || this.emailUnderName.match("Karen Zheng") == "Karen Zheng"||this.emailUnderName.match("Anik Shen") == "Anik Shen"|| this.emailUnderName.match("Dingsong Zhang") == "Dingsong Zhang"||this.emailUnderName.match("Anita Yang") == "Anita Yang"||this.emailUnderName.match("Van Pan") == "Van Pan"||this.emailUnderName.match("Danielle Zhao") == "Danielle Zhao" || this.emailUnderName.match("Sean Wu (AZURE)") == "Sean Wu (AZURE)")
      this.admin = true;}, 500)
  },
  methods: {
    handleCommand(command) {
          var path = (command + moment(this.date, "/YYYY/M").format("/YYYY/M"));
          this.$router.push({ path: path });
          location.reload()
          // this.$message('click on item ' + command);
    },
    addMonth() {
      var path = moment(this.date, "/YYYY/M")
        .add(1, "M")
        .format("/YYYY/M");
      this.$router.push({ path: path });
    },
    subMonth() {
      var path = moment(this.date, "/YYYY/M")
        .subtract(1, "M")
        .format("/YYYY/M");
      this.$router.push({ path: path });
    },

    // callUndo(ev) {
    //   if (ev.code !== "KeyZ" || ev.ctrlKey !== true) return;
    //   else if (this.$history.length == 0) return;
    //   {
    //     var x = this.$history.pop();
    //     var data = x.payload;
    //     this.month.people[data.indexes.p].days[data.indexes.d].workDay =
    //       data.workDay;
    //     this.month.people[data.indexes.p].days[data.indexes.d].workType =
    //       data.workType;
    //     this.$http.post(x.path, x.payload);
    //   }
    //},

    handleScroll() {
      var header = document.getElementById("tablehead");
      var sticky = header.offsetTop;
      //console.log(window.pageYOffset);
      if (window.pageYOffset <= 115) {
        this.scrolled = false;
        return;
      }
      if (window.pageYOffset >= sticky) {
        this.scrolled = true;
      } else {
        this.scrolled = false;
      }
    },
    /*************************************** Feature 4 Easy Authentication * Feature 6 Permission control **************************************/
    personinfo: function() {
      return new Promise((resolve, reject) => {
        this.$http.get("/.auth/me").then((response)=> {
         for(const a of response.data[0].user_claims) {
           if(a.typ == "name"){
             this.emailUnderName = a.val
           }
         }
          
        }).catch((error) => {
          this.emailUnderName = "Juncheng Zhu"
          reject(error)
        })
      })
    },
    /*************************************** Feature 9 init calendar **************************************/
    init() {
      // console.log(this.emailUnderName)
      if(this.emailUnderName.match("Juncheng Zhu") == "Juncheng Zhu"){
        /* this.emailUnderName.match("Karen Zheng") == "Karen Zheng"
        ||this.emailUnderName.match("Anik Shen") == "Anik Shen"
        || this.emailUnderName.match("Dingsong Zhang") == "Dingsong Zhang"
        ||this.emailUnderName.match("Anita Yang") == "Anita Yang"
        ||this.emailUnderName.match("Danielle Zhao") == "Danielle Zhao" 
        || this.emailUnderName.match("Sean Wu (AZURE)") == "Sean Wu (AZURE)" */
        var that = this
        var dateNew = new Date();
        if(true){ 
          /* this.date.substr(-1)==((dateNew.getMonth()+2).toString().substr(-1))
          ||(this.date.substr(-1)== "9"&&(dateNew.getMonth()+1).toString().substr(-1)=="0")
          ||(this.date.substr(-1)== "2"&&(dateNew.getMonth()+1).toString().substr(-1)=="1")) */
          this.isLoading = true
          this.initUndo = false
          this.$http.post(this.apiPath, this.apiPayload)
          setTimeout(()=>{
            that.isLoading = false
          },5000)
        }
      }
    },
    reload() {
      if(this.initUndo == false) {
        this.$http.post(this.apiPath2, this.apiPayload2);
        setTimeout(function(){
          location.reload()
        },2000)
      }
    },
    handleClick(tab, event) {
        console.log(tab, event);
    }
  }
}
</script>


<style>
.attendance {
  margin: 9px 0 0 0;
}

.tablehead {
  width: 100%;
}

.sticky {
  position: fixed;
  top: 0;
  background: rgb(37, 37, 37);
}

.sticky + .tablehead {
  padding-top: 102px;
}

.pointer {
  cursor: pointer;
  margin: 0 5px 0 5px;
  padding: 0 10px 0 10px;
  text-decoration: none;
  color: white;
}

.sectionPointer {
  cursor: pointer;  
  margin: 0 10px 0 10px;
  text-decoration: none;
  color: gray;
}

.sectionPointer:hover {
  background-color:none;
}

.testClass {
  margin-right: 40px;
    margin-bottom: 55px;
    text-align:right;

}
.testClassII {
    text-align: right;
}
.pointer:hover {
  background-color: #555;
}
.marginLeft {
  margin-left: 30px
}
.button {

  border: none;
  margin: 10px;
  color: rgb(255, 255, 255);
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 15px;

}
.buttonBackground {
  background-color: #4CAF50; /* Green */
}
.el-dropdown-link {
  cursor: pointer;
  color:gray;
}
.el-icon-arrow-down {
  font-size: 12px;
}
#tabsJuncheng .el-tabs__item{
  color:#808080;
}
#tabsJuncheng .el-tabs__nav-scroll {
  margin-left:50px;
}

.el-tabs__nav-wrap::after {
  visibility: hidden;
}

</style>

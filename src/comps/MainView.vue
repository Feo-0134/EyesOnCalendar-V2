<template>
  <div>
      <div class="testClass"><a :href="goAppService" class="sectionPointer">&gt; AppService</a><a :href="goDEV" class="sectionPointer">&gt; DEV</a></div>
      <div class="testClassII"><p>Welcome, {{emailUnderName}}</p></div>
      <h1><a :href="prevMonth" class="pointer">&lt;</a>{{prettyDate}}<a :href="nextMonth" class="pointer">&gt;</a></h1>
      <h2 v-if="!month">{{message}}</h2>
      <button v-if="!month" class = "button" v-bind:class="{buttonBackground: initUndo}" v-on:click="init">Init Table</button>
      <button v-if="!month" v-bind:class="{buttonBackground: !initUndo}" class = "button" v-on:click="reload">Reload Table</button>
      <div v-if="month">
          <div id="tablehead" v-bind:class="{sticky: scrolled}" class="row tablehead">
            <div class="name"></div>
            <div v-for="(p,index) in month.people[0].days" :key="index" class="cellx">{{index+1}}</div>
          </div>
          <!-- /**************************************
          Feature 3 add a Line for on-duty rate 
          **************************************/ -->
          <div id="tablehead" class="row tablehead">
            <div class="name attendance">On Duty</div>
            <div v-for="(p,index) in month.people[0].days" :key="index" class="cellx">{{percentage(index)}}%</div>
          </div>
          <person v-for="(p,index) in month.people" v-bind:key="p._id" v-bind:pindex="index" v-bind:person="p" :userName="emailUnderName"/>
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
      //initDone:false,
      isLoading: false
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
      return  ("/AppService"+moment(this.date, "/YYYY/M")
        .add(1, "M")
        .format("/YYYY/M"))
    },
    prevMonth() {
      return  ("/AppService"+moment(this.date, "/YYYY/M")
        .subtract(1, "M")
        .format("/YYYY/M"));
    },
    /**************************************
     * Router  
    **************************************/
    goAppService() {
      return ("/AppService" + moment(this.date, "/YYYY/M").format("/YYYY/M"));
    },
    goDEV() {
      return ("/DEV" + moment(this.date, "/YYYY/M").format("/YYYY/M"));
    },

    /**************************************
     * Feature 3 add a Line for on-duty rate 
    **************************************/
    percentage:function() {
      return function(val) {
        var sum = 0;
        for(const b of Object.keys(this.month.people)) {
          if(this.month.people[b].days[val].workType == "W"||this.month.people[b].days[val].workType == "MS"||this.month.people[b].days[val].workType == "NS") {
            sum++
          }
        }
        return ((sum/this.totalamount)*100).toFixed(0)
      }
    },
    /**************************************
     * Feature 9 init a new calendar for the next month 
    **************************************/
    apiPath() {
      return (
          "/api/" +
          this.$router.currentRoute.path +
          "/init"
      );
    },
    apiPayload() {
      return {
          year: "2019",
          //month: "3"
      };
    },
    apiPath2() {
      return (
          "/api/" +
          this.$router.currentRoute.path +
          "/reload"
      );
    },
    apiPayload2() {
      return {
          year: "2019",
          //month: "3"
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
  },
  methods: {
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
    /**************************************
     * Feature 4 Easy Authentication
     * Feature 6 One can only change his own status;TA & Manager have higher permission to all data 
    **************************************/
    personinfo: function() {
      return new Promise((resolve, reject) => {
        this.$http.get("/.auth/me").then((response)=> {
           for(const a of response.data[0].user_claims) {
             if(a.typ == "name"){ 
               this.emailUnderName = a.val;
             } 
           }
        }).catch((error) => {
          this.emailUnderName = "Danielle Zhao";
          reject(error)
        })
      })
    },
    init() {
      let that = this
      this.initUndo = false
      //that.initDone = true
      this.isLoading = true
      this.$http.post(this.apiPath, this.apiPayload)//TBC
      setTimeout(()=>{
        that.isLoading = false
      },7000)
        
 
    },
    reload() {
      this.$http.post(this.apiPath2, this.apiPayload2);
      setTimeout(function(){
        location.reload()
      },2000)
    }
  }
}
</script>


<style>
.attendance {
  margin: 9px 0 0 0;
}

day {
  color: black !important;
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
  cursor: pointer;  margin: 0 5px 0 5px;
  padding: 0 10px 0 10px;
  text-decoration: none;
  color: white;
}

.sectionPointer:hover {
  background-color: #555;
}

.testClass {
    text-align:left;
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

</style>
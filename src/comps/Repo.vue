<!-- /**************************************
Feature 5 Monthly report
**************************************/ -->
<template>
    <div>
      <h1>Monthly Report</h1>
      <h2 v-if="!month">{{message}}</h2>
      <div v-if="month">
          <div id="tablehead" v-bind:class="{sticky: scrolled}" class="row tablehead">
            <div class="name"> </div>
            <div class="celly">Work-Day</div>
            <div class="celly">Morning-Shift</div>
            <div class="celly">Night-Shift</div>
            <div class="celly">Training</div>
            <div class="celly">Vacation</div>
            <div class="celly">Public-Holiday</div>
            <div class="celly">Public-Holiday_OnDuty</div>
          </div>
          <Personsum class="marginLeft" v-for="(p,index) in month.people" v-bind:key="p._id" v-bind:pindex="index" v-bind:person="p"/>
      </div>
      <button class="modal-default-button"><a :href="linkToCalendar" class="linkFontStyle">Back To Calendar</a></button>
  </div>
</template>

<script>
import Personsum from "@/comps/PersonRowSum"
export default {
  components: { Personsum },
    data() {
    return {
      message: "Loading month...",
      scrolled: false,
      changed: false,
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
    /**************************************
     * Feature 5 Monthly report
    **************************************/
    date() {
      this.changed=!this.changed
      return (this.$router.currentRoute.path).replace('/report','');
    },
    linkToCalendar() {
      return "/";
    },
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
/* .marginLeft {
   margin-left: 30px
} */

.celly {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  vertical-align: middle;
  width: 120px;
  margin: 10px;
}
.linkFontStyle {
    font-size: 16px;
    color: #FFF;
    text-decoration: none;
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

</style>

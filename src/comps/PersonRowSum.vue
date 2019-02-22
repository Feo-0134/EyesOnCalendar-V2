<!-- /**************************************
Feature 5 Monthly report
**************************************/ -->
<template>
  <div class="row">
      <div v-if="large" class="cellx name">{{displayName}}</div>
      <div v-if="!large" class="cellx name">{{shortName}}</div>
      <div class = "celly ">{{workDayCount1}}</div>
      <div class = "celly ">{{workDayCount2}}</div>
      <div class = "celly ">{{workDayCount3}}</div>
      <div class = "celly ">{{workDayCount4}}</div>
      <div class = "celly ">{{workDayCount5}}</div>
      <div class = "celly ">{{workDayCount6}}</div>
  </div>
</template>

<script>
import Day from "@/comps/DayCell";
export default {
  components: { Day },
  props: ["person"],
  data() {
      return {
        /**************************************
         * Feature 1 add two new status "MS"(morning shift),"NS"(night shift)
        **************************************/
        workTypes: ["W", "PH", "DV", "V", "T", "MS", "NS"],
        size: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      } 
  },

  computed: {
    displayName() {
      var nameArray = this.person.name.split(" ");
      return nameArray[0] + " " + nameArray[nameArray.length - 1];
    },
    shortName() {
      var nameArray = this.person.name.split(" ");
      return nameArray[0] + " " + nameArray[nameArray.length - 1][0];
    },
    large() {
      if (this.size > 1600) return true;
      else return false;
    },
    
    /**************************************
     * Feature 5 Monthly Report
    **************************************/
    workDayCount1() { 
      var wdctotal = 0;
      for(const w of this.person.days) {
        if(w.workType == "W"||w.workType == "MS"||w.workType == "NS") {
          wdctotal = wdctotal + 1
        }
        //console.log(wdctotal)
      }
      return wdctotal;
    },
    workDayCount2() { 
      var wdctotal = 0;
      for(const w of this.person.days) {
        if(w.workType == "MS") {
          wdctotal = wdctotal + 1
        }
        //console.log(wdctotal)
      }
      return wdctotal;
    },
    workDayCount3() { 
      var wdctotal = 0;
      for(const w of this.person.days) {
        if(w.workType == "NS") {
          wdctotal = wdctotal + 1
        }
        //console.log(wdctotal)
      }
      return wdctotal;
    },
    workDayCount4() { 
      var wdctotal = 0;
      for(const w of this.person.days) {
        if(w.workType == "T") {
          wdctotal = wdctotal + 1
        }
        //console.log(wdctotal)
      }
      return wdctotal;
    },
    workDayCount5() { 
      var wdctotal = 0;
      for(const w of this.person.days) {
        if(w.workType == "DV"||w.workType == "V") {
          wdctotal = wdctotal + 1
        }
        //console.log(wdctotal)
      }
      return wdctotal;
    },
    workDayCount6() {
      var wdctotal = 0;
      for(const w of this.person.days) {
        if(w.workType == "PH") {
          wdctotal = wdctotal + 1
        }
        //console.log(wdctotal)
      }
      return wdctotal;
    },
  },
  created() {
      window.addEventListener('resize',()=>{
          this.getWindowWidth()
      })  
  },
  methods: {
    getWindowWidth() {
        this.size = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    },
  }
};
</script>


<style>

.row-head {
  display: flex;
  height: 40px;
  justify-content: center;
}

.row {
  display: flex;
  height: 40px;
  justify-content: center;
}

.row:hover:not(:first-child) {
    background: #444;
}

.row:hover>.name {
    color: white !important;
    font-weight: 500;
}

.cellx {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  vertical-align: middle;
  width: 40px;
}
.name {
  width: 180px;
  font-size: 18px;
  color: #eaeaea;
  text-align: right;
  font-family: "Roboto Condensed", sans-serif;
}
.workday {
  color: white;
  cursor: pointer;
}

.cellx {
  border-radius: 2px;
  text-transform: uppercase;
  margin: 4px;
  user-select: none;
  border: 0px solid;
  font-size: 16px;
}

.workday:hover {
  font-size: 21px;
  margin: 0px;
  padding: 1px;
  border: 3px solid;
}

@media only screen and (max-width: 1600px) {
  .cellx {
    margin: 3px;
    font-size: 14px;
  }

  .workday:hover {
    font-size: 18px;
    padding: 1px;
    border: 2px solid;
  }

  .name {
    width: 100px;
  }
}
.colorCodes {
  text-align: left;
}
.dayTypes {
  width: 267px;
}
.separator {
  height: 20px;
  margin: 20px auto 0 auto;
  border-top: 1px gray solid;
  width: 80%;
}
.box-container {
  display: flex;
}

.box {
  margin: 5px;
  width: 40px;
  height: 40px;
  color: white;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  vertical-align: middle;
  flex-direction: column;
}

.grey {
  background-color: #555555;
}
.red {
  background-color: #8c2230;
}

.green {
  background-color: #557037;
}

.blue {
  background-color: #375c8c;
}

.purple {
  background-color: #513567;
}

.orange {
  background-color: #b36b00;
}
.hr {
  text-align: left;
}
.legenda-container {
  display: flex;
  justify-content: left;
}
.icon-container {
  display: flex;
  justify-content: left;
}

.iconPreview {
  width: 50px;
  height: 50px;
  background-size: cover;
  display: flex;
  justify-content: center;
  vertical-align: middle;
}
.large {
  flex-direction: column;
  width: 90px;
  font-weight: 700;
}

.overlay {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
}

.blackFont {
  color: white;
}
.fab {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 30px;
  border: none;
  background-color: #600;
  color: white;
  font-weight: 700;
  font-size: 30px;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
}

.fab:hover {
  box-shadow: 0 6px 14px 0 #000;
  transform: scale(1.05);
}
.colorCell {
  background-color: #0A122A;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  vertical-align: middle;
  width: 40px;
  color: white;
}
.colorFont {
  color: cornflowerblue;
}
.celly {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  vertical-align: middle;
  width: 120px;
  margin: 10px;
}
.workday {
  color: white;
  cursor: pointer;
}
.workday:hover {
  font-size: 21px;
  margin: 0px;
  padding: 1px;
  border: 3px solid;
}
</style>
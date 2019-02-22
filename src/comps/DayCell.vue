<template>
  <div unselectable="on" v-bind:style="{'background-color': getColor(), 'border-color': getBorderColor()}"  class="cellx workday"  v-on:click="toggle" >
    {{displayValue}}
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  props: ["day", "pindex", "dindex","testparam","testparamII"],
  methods: {
    /**************************************
     * Feature 2  add a dialog for updating the status
    **************************************/
    toggle() {

      this.open = !this.open
      this.$emit('customEvent',this.dindex + 1)

      // var undoStep = { path: this.apiPath, payload: this.apiPayload }; // UNDO STEP HERE -- TODO
      // this.$history.push(undoStep);

      // if (this.day.workDay == 1) this.day.workDay = 0;              // WORKDAY(Green) WEEKEND(Red) SWITCH HERE -- TODO
      // else if (this.day.workDay == 0) this.day.workDay = 1;
      
      this.$http.post(this.apiPath, this.apiPayload);                 // Data upload WHY SYNC TWO TIMES I is here
    },
    debouncedPost() {
      return _.debounce(this.$http.post(this.apiPath,this.apiPayload),500)
    },// 0 - 1, 1 - 0, 2 - 0, 3 - 2
    getBorderColor() {
      if (this.day.workType == "WE" && this.day.workDay == 0) return "#bbbbbb";
      else
        switch (this.day.workDay) {
          case 0:
            return "#ED5565";
            break;
          case 1:
            return "#bada55";
            break;
          case 2:
            return "#9742b3";
            break;
          case 3:
            return "#5D9CEC";
            break;
          case 4:
            return "#ffcc80";
            break;
        }
    },
    getColor() {
      if (this.day.workType == "WE" && this.day.workDay == 0) return "#555555";
      switch (this.day.workDay) {
        case 1:
          return "#557037";
          break;
        case 0:
          return "#8c2230";
          break;
        case 2:
          return "#513567";
          break;
        case 3:
          return "#375c8c";
          break;
        case 4:
          return "#b36b00";
          break;
      }
    }
  },
  data() {
    return {
    /**************************************
     * Feature 2  add a dialog for updating the status
    **************************************/
      open:false,
    /**************************************
     * Feature 1 add two new status "MS"(morning shift),"NS"(night shift)
    **************************************/
      workTypes: ["W", "PH", "DV", "V", "T","MS","NS"] // original workTypes["W", "PH", "DV", "V", "T","MS","NS", "oc", "OC"]
    };
  },
  computed: {
    dbFunc() {
      return _.debounce(()=>{this.$http.post(this.apiPath,this.apiPayload)},1080)
    },
    /**************************************
     * Feature 1 add two new status "MS"(morning shift),"NS"(night shift)
    **************************************/
    displayValue() {
      if(this.testparamII == this.dindex) {
        this.day.workType = this.testparam
      if (this.day.workType == "V") this.day.workDay = 0;
      if (this.day.workType == "PH") this.day.workDay = 0;
      if (this.day.workType == "W") this.day.workDay = 1;
      if (this.day.workType == "MS") this.day.workDay = 1;
      if (this.day.workType == "NS") this.day.workDay = 1;
      if (this.day.workType == "DV") this.day.workDay = 2;
      if (this.day.workType == "T") this.day.workDay = 3;
      //console.log(this.day.workType)
      this.dbFunc()                                     // WHY SYNC TWO TIMES II is here
      }
      if (this.day.workType == "W") return " ";// not display "W" in the calendar for there are TOO MANY WORKING DAYS
      else return this.day.workType;
    },

    apiPayload() {
      return {
        workDay: this.day.workDay,
        workType: this.day.workType,
        indexes: {
          p: this.pindex,
          d: this.dindex
        },
        randomNumber: this.$randomNumber
      };
    },
    apiPath() {
      return (
        "/api" +
        this.$router.currentRoute.path +
        "/" +
        this.$parent.person._id +
        "/" +
        this.day._id
      );
    }
  }
};
</script>

<style>
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
</style>
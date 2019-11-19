<template>
  <div unselectable="on" v-bind:style="{'background-color': getColor(), 'border-color': getBorderColor()}"  class="cellx workday"  v-on:click="toggle" >
    <p v-if="!today">{{displayValue}}</p>
    <el-badge :value="caseNum" v-if="today" type="primary" >
      <p v-bind:style="{'height': '17px'}" >{{displayValue}}</p>
    </el-badge>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  props: ["day", "pindex", "dindex","testparam","testparamII", "custom", "customParam"],
  data() {
    return {
      open:false, // sign to open opertation panel
      today: false,
      month: this.$router.currentRoute.path.split('/')[3],
      caseNum: '',
      borderColor: ["#ED5565", "#bada55", "#9742b3", "#5D9CEC", "#ffcc80", "#808F85"],
      ctxColor:["#8c2230","#557037", "#403259", "#375c8c","#b36b00", "#3B4D50", "#63474D", "#360036"],
    };
  },
  mounted() {
      var month = new Date().getMonth() + 1
      var date = new Date().getDate()

      if(month == this.month && date == this.day.day) {
        this.today = true
      }
      this.getNumber();
  },
  methods: {
    /* get color */
    getBorderColor() {
      if(this.day.workDay < 0) {
        return this.custom.color[-1-this.day.workDay]
      }
      return this.borderColor[this.day.workDay]
    },
    getColor() {
      if(this.day.workDay < 0) {
        return this.custom.color[-1-this.day.workDay]
      }
      return this.ctxColor[this.day.workDay]
    },
    /* data update */
    toggle() {
      this.open = !this.open
      // this is stupid. Plz use multi params replace later.
      this.$emit('customEvent',this.dindex + 1 + "@" + this.day.workType)
      // var undoStep = { path: this.apiPath, payload: this.apiPayload }; // UNDO STEP HERE -- TODO
      // this.$history.push(undoStep);
    },
    getNumber()  {
      console.log("DayCell: " + this.$store.state.dailycasenumber);
      this.caseNum = 0;
    }
  },
  watch: {
    "$store.state.dailycasenumber": function(newVal) {
      console.log("case number changed");
      this.caseNum = newVal;
    }
  },
  computed: {
    /* get color */
    displayValue() {
      if(this.testparamII == this.dindex) {
          this.day.workType = this.testparam
          if (this.day.workType == "PH") {this.day.workDay = 0;}
          else if (this.day.workType == "W") {this.day.workDay = 1;}
          else if (this.day.workType == "MS") {this.day.workDay = 1;}
          else if (this.day.workType == "NS") {this.day.workDay = 5;}
          else if (this.day.workType == "SL") {this.day.workDay = 2;}
          else if (this.day.workType == "AL") {this.day.workDay = 2;}
          else if (this.day.workType == "H(M)"){ this.day.workDay = 2;}// //"HMSL","HASL","HMAL","HAAL"
          else if (this.day.workType == "H(A)") {this.day.workDay = 2;}
          else if (this.day.workType == "T") {this.day.workDay = 3;}
          else if (this.day.workType == "PO") {this.day.workDay = 4;}
          else if (this.day.workType == "PM") {this.day.workDay = 4;}
          else if (this.day.workType == "HMAL") {this.day.workDay = 6;}
          else if (this.day.workType == "HAAL") {this.day.workDay = 6;}
          else if (this.day.workType == "HASL") {this.day.workDay = 7;}
          else if (this.day.workType == "HMSL") {this.day.workDay = 7;}
          else {this.day.workDay = this.customParam}
          this.dbFunc()
      }
      if (this.day.workType == "W") return " "; // not display "W" in the calendar for there are TOO MANY WORKING DAYS
      if (this.day.workType == "HMSL" || this.day.workType == "HMAL") return " H(M)";
      if (this.day.workType == "HASL" || this.day.workType == "HAAL") return " H(A)";

      else return this.day.workType;
    },
    /* data update */
    dbFunc() {
      return _.debounce(()=>{this.$http.post(this.apiPath,this.apiPayload)},1080)
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
  },
};
</script>

<style>
.cellx {
  border-radius: 2px;
  /* text-transform: uppercase; */
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
}
</style>
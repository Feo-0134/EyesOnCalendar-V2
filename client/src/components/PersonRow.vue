<template>
  <div :class="{'pickRow': usrrecord,'row': true}">
        <div v-if="large" class="cellxII name">{{displayName}}</div>
        <div v-if="!large" class="cellxII name">{{shortName}}</div>
      <Moveable v-if= "open"
        @click="open=false"
        class="moveable"
        v-bind="moveable"
        @drag="handleDrag"
        @resize="handleResize"
        @scale="handleScale"
        @rotate="handleRotate"
        @warp="handleWarp">
          <div class="panelFrame">
                <div>
                    <div class="typeTitle">
                    <h5 class = "panelFont">Work Day Type</h5>
                    </div>
                    <div class="box-container">
                        <div v-on:click="cycle($event,0)" class="box0 green"></div>
                        <div v-on:click="cycle($event,8)" class="box0 green">MS</div>
                        <div v-on:click="cycle($event,9)" class="box0 green1">NS</div>
                        <!-- <h5 class = "panelFont">Work Day</h5> -->
                    </div>
                    <div class="typeTitle">
                    <h5 class = "panelFont">Leave Type (Sick Leave / Annual Leave)</h5>
                    </div>
                    <div class="box-container">
                    <el-popover
                      placement="bottom"
                      width="200"
                      trigger="click">
                      <p>Please inform the team about your absence.</p>
                      <a href="mailto:wfms@microsoft.com"><img class = "outlookLogo" src="../../static/img/outlook.png"  alt="Outlook" /></a>
                      <div slot="reference" v-on:click="cycle($event,2)" class="box0 purple">SL</div>
                    </el-popover>
                    <el-popover
                      placement="bottom"
                      width="200"
                      trigger="click">
                      <p>Please inform the team about your absence.</p>
                      <a href="mailto:wfms@microsoft.com"><img class = "outlookLogo" src="../../static/img/outlook.png"  alt="Outlook" /></a>
                      <div slot="reference" v-on:click="cycle($event,3)" class="box0 purple">AL</div>
                    </el-popover>
                    </div>
                    <div class="typeTitle">
                    <h5 class = "panelFont">Half-day Leave Type </h5>
                    <h5 class = "panelFont">(SL/AL + Morning / Afternoon)</h5>
                    </div>
                    <div class="box-container">
                    <el-switch v-model="alORsl" active-text="AL" inactive-text="SL"> </el-switch>
                    <el-popover
                      placement="bottom"
                      width="200"
                      trigger="click">
                      <p>Please inform the team about your absence.</p>
                      <a href="mailto:wfms@microsoft.com"><img class = "outlookLogo" src="../../static/img/outlook.png"  alt="Outlook" /></a>
                      <div slot="reference" v-on:click="cycle($event,12)" class="box0" :class="alORsl?'purple2':'purple1'">H(M)</div>
                    </el-popover>
                    <el-popover
                      placement="bottom"
                      width="200"
                      trigger="click">
                      <p>Please inform the team about your absence.</p>
                      <a href="mailto:wfms@microsoft.com"><img class = "outlookLogo" src="../../static/img/outlook.png"  alt="Outlook" /></a>
                      <div slot="reference" v-on:click="cycle($event,14)" class="box0" :class="alORsl?'purple2':'purple1'">H(A)</div>
                    </el-popover>
                    </div>
                    <div style="float: right">
                      <div class="typeTitle">
                        <h5 class = "panelFont">Custom DayType </h5>
                      </div>
                      <div class="box-container"  style="margin-top: 37px;">
                          <div v-on:click="cycle($event,10)" class="box0 ">{{customDayType(0)}}</div>
                          <div v-on:click="cycle($event,11)" class="box0 ">{{customDayType(1)}}</div>
                      </div>
                    </div>
                    
                    <div class="typeTitle">
                    <h5 class = "panelFont">Public Holiday On-duty type </h5>
                    <h5 class = "panelFont">(OnDuty / MorningShift)</h5>
                    </div>
                    <div class="box-container">
                        <div v-on:click="cycle($event,10)" class="box0 orange">PO</div>
                        <div v-on:click="cycle($event,11)" class="box0 orange">PM</div>
                    </div>
                    <div class="typeTitle">
                    <h5 class = "panelFont">Other Type</h5>
                    </div>
                    <div class="box-container">
                    <el-popover
                      placement="bottom"
                      width="200"
                      trigger="click">
                      <p>Please inform the team about your absence.</p>
                      <a href="mailto:wfms@microsoft.com"><img class = "outlookLogo" src="../../static/img/outlook.png"  alt="Outlook" /></a>
                      <div slot="reference" v-on:click="cycle($event,7)" class="box1 blue">T</div>
                    </el-popover>
                    <h5 class = "panelFont">Training</h5>
                    <div v-on:click="cycle($event,1)" class="box0 red">PH</div><h5 class = "panelFont">Public Holiday</h5>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <!-- <el-button @click="handleOpen">Cancel</el-button> -->
                        <el-button class="confirmBtn" type="primary" @click="handleOpen()">Confirm</el-button>
                    </span>
                </div>
            </div> 
      </Moveable>
      <day class = "dayCell" @customEvent="handleEvent" v-for="(d,index) in person.days" :large="large" :key="d._id" :day="d" :pindex="pindex" :dindex="index" :testparam="dayType" :testparamII="date" :custom="customType"/>
  </div>
</template>

<script>
import Day from "@/components/DayCell";
import Moveable from 'vue-moveable';
var store = require('store')
export default {
  components: { Day, Moveable },
  props: ["person", "pindex","userName","openflag"],

  data() {
      return {
        alias: '', // permission control
        workTypes: ["W", "PH", "SL", "AL", "H(M)",
         "H(A)", "V", "T", "MS", "NS",
         "PO", "PM","HMSL","HMAL","HASL","HAAL"],
        dayType: "W", // default value for data update
        date: null, // default value for data update
        customType: false,
        /* window view params */
        usrrecord: false, // highlight the record of the current usr
        moveable: {       // operation panel
          keepRatio: true,
          draggable: true,
          resizable: false,
          scalable: false,
          rotatable: false,
          throttleDrag: 0,          
          throttleResize: 1,
          throttleScale: 0,
          throttleRotate: 0
        },
        open: false, // operation panel params
        alORsl: false, // AL or SL default false means sick leave
        size: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      }
  },

  computed: {
    /* permission control */
    admin() {
      return store.get('user').admin
    },
    /* window views */
    displayName() {
      return (this.person.name.split(" "))[0] + ' ' + this.person.alias;
    },
    shortName() {
      return (this.person.name.split(" "))[0]
    },
    large() {
      if (this.size > 1600) return true;
      else return false;
    },
  },
  created() {
    window.addEventListener('resize',()=>{
        this.getWindowWidth()
    })
  },
  mounted() {
    this.alias = store.get('user').alias
    if(this.alias === this.person.alias) {this.usrrecord = true}
  },
  methods: {
    customDayType(num) {
      if(num == 0) return 'C1'
      else return 'C2'
    },
    customDayColor(num) {
      if(num == 0) return '#000'
      else return '#fff'
    },
    /* moveable method */
    handleDrag({ target, left, top }) {
      target.style.left = `${left}px`;
      target.style.top = `${top}px`;
    },
    handleResize({
      target, width, height, delta,
    }) {
      delta[0] && (target.style.width = `${width}px`);
      delta[1] && (target.style.height = `${height}px`);
    },
    handleScale({ target, transform, scale }) {
      target.style.transform = transform;
    },
    handleRotate({ target, dist, transform }) {
      target.style.transform = transform;
    },
    handleWarp({ target, transform }) {
      target.style.transform = transform;
    },
   
    /* data update */
    handleEvent:function(msg) {
      if( this.alias === this.person.alias || this.admin === true ) {
        if(this.openflag == false || this.open == true) {
          if(this.open === false){ this.dayType = msg.split("@")[1] }
          this.open = true
          this.$emit('opensync',true)
          this.date = msg.split("@")[0] - 1
        }
      }
    },
    handleOpen: function() {
      this.open=false;
      this.$emit('opensync',false)
      // location.reload();
    },
    cycle(e, arg) {
      if(this.alORsl && (arg == 12 || arg == 14)) arg = arg + 1;
      this.dayType = this.workTypes[arg];      
    },

    /* Window View */
    getWindowWidth() {
        this.size = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    },
  }
};
</script>


<style>
day {
  color: black !important;
}
.row-head {
  display: flex;
  height: 40px;
  justify-content: center;
}
.row {
  display: inline-flex;
  height: 40px;
  justify-content: center;
}
.pickRow {
  border: 2px solid #409eff;
}
.row:hover:not(:first-child) {
    background: #444;
}
.row:hover>.cellxII {
    color: white !important;
    font-weight: 500;
}
.large {
  flex-direction: column;
  width: 90px;
  font-weight: 700;
}
.cellxII {
  color: #eaeaea;
  border-radius: 2px;
  margin: 4px;
  user-select: none;
  border: 0px solid;
  font-size: 16px;
  font-family: "Roboto", "Corbel", "Avenir", "Lucida Grande", "Lucida Sans", "sans-serif";
}
.cellx {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  vertical-align: middle;
  width: 40px;
}
.workday {
  color: #C2C4CE;
  /* cursor: pointer; */
}
.workday:hover {
  font-size: 21px;
  margin: 0px;
  padding: 1px;
  border: 3px solid;
}
.name {
  width: 180px;
  font-size: 18px;
  text-align: left;
  font-family: "Roboto", "Corbel", "Avenir", "Lucida Grande", "Lucida Sans", "sans-serif";
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
    text-align: left;
    width: 100px;
    font-family: "Roboto", Corbel, Avenir, "Lucida Grande", "Lucida Sans", sans-serif;
  }
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
.green1 {
  background-color: #3B4D50;
}
.blue {
  background-color: #375c8c;
}
.purple {
  background-color: #403259;
}
.purple1 {
  background-color: #360036;
}
.purple2 {
  background-color: #63474D;
}
.orange {
  background-color: #b36b00;
}
.confirmBtn{
  margin-top:15px;
}
.typeTitle {
  text-align: left;
}
.el-switch {
  margin:15px;
}
.moveable {
  position: relative;
  text-align: center;
  font-size: 10px;
  margin: 0 auto;
  font-weight: 100;
  letter-spacing: 1px;
}
.outlookLogo {
  width: 70px;
  height: 40px;
  margin-left: 5px;
  margin-bottom: 5px;
}
.panelFont {
  color: white;
}
.panelFrame {
  border: 5px solid #404040;
  background-color: #3D5B5E;
  position: absolute;
  border-radius: 20px;
  top: 25%;
  left: 50%;
  margin-left: -150px;
  width: 280px;
  padding: 30px;
  color: black;
  display: flex;
  justify-content: left;
}
.box0 {
  border: 1px solid #404040;
  cursor: pointer;
  margin: 5px;
  width: 40px;
  height: 25px;
  color: white;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  padding-left: 3px;
  padding-top: 10px;
}
.box1 {
  border: 1px solid #404040;
  cursor: pointer;
  margin: 5px;
  width: 40px;
  height: 25px;
  color: white;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  padding-left: 1px;
  padding-top: 10px;
}
.box-container {
  display: flex;
}
.box-container .el-button {
  background: inherit;
  padding: inherit;
  color:inherit;
}
</style>

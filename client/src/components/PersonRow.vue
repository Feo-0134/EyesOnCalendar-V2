<template>
  <div class="row">
        <div v-if="large" class="cellxII name">{{displayName}}</div>
        <div v-if="!large" class="cellxII name">{{shortName}}</div>
      <day class = "dayCell" @customEvent="handleEvent" v-for="(d,index) in person.days" :large="large" :key="d._id" :day="d" :pindex="pindex" :dindex="index" :testparam="dayType" :testparamII="date"/>
      <!-- /**************************************
       Feature 2  add a dialog for updating the status
       Feature 1 add two new status "MS"(morning shift),"NS"(night shift)
      **************************************/ -->
      <Moveable v-if= "open"
        @click="open=false"
        class="moveable"
        v-bind="moveable"
        @drag="handleDrag"
        @resize="handleResize"
        @scale="handleScale"
        @rotate="handleRotate"
        @warp="handleWarp">
          <div class="help-dialogII">
                <div class="dayTypes">
                    <div class="box-container">
                        <div v-on:click="cycle($event,0)" class="box green"></div>
                        <div v-on:click="cycle($event,8)" class="box green">MS</div>
                        <div v-on:click="cycle($event,9)" class="box green1">NS</div><h5 class = "blackFont">Work Day</h5>
                    </div>
                    <div class="box-container">
                    <div v-on:click="cycle($event,2)" class="box purple" v-popover:myname>SL</div><h5 class = "blackFont">Sick Leave</h5>
                    <div v-on:click="cycle($event,3)" class="box purple" v-popover:myname>AL</div><h5 class = "blackFont">Annual Leave</h5>
                    </div>
                    <div class="box-container">
                    <el-switch v-if = "open1" v-model="value1" active-text="AL" inactive-text="SL"> </el-switch>
                    <div v-on:click="open1 = true; cycle($event,12);" class="box purple" v-popover:myname>H(M)</div>
                    <div v-on:click="open2 = true; cycle($event,14);" class="box purple" v-popover:myname>H(A)</div>
                    </div><div>
                    <h5 class = "blackFont">(SL/AL) +  Half-day Leave Morning / Afternoon</h5>
                    </div>
                    <div class="box-container">
                        <div v-on:click="cycle($event,value)" class="box orange">PO</div>
                        <div v-on:click="cycle($event,value)" class="box orange">PM</div><h5 class = "blackFont">OnDuty/MorningShift(PH)</h5>
                    </div>
                    <div class="box-container">
                        <div v-on:click="cycle($event,value)" class="box blue" v-popover:myname>T</div><h5 class = "blackFont">Training</h5>
                    </div>
                    <div class="box-container">
                        <div v-on:click="cycle($event,value)" class="box red">PH</div><h5 class = "blackFont">Public Holiday</h5>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <!-- <el-button @click="handleOpen">Cancel</el-button> -->
                        <el-button type="primary" @click="handleOpen()">Comfirm</el-button>
                    </span>
                </div>
            </div> 
      </Moveable>
      <!-- /**************************************
      Feature 8 Hint one to mail team about the absence
      **************************************/ -->
      <popover name="myname">
       <div class="colorFont">
       <p>Please inform the team about your absence.</p>
       <a href="mailto:apgcpaas@microsoft.com"><img class = "outlookLogo" src="../../static/img/outlook.png"  alt="Outlook" /></a>
       </div>
      </popover>
  </div>
</template>

<script>
import Day from "@/components/DayCell";
import Moveable from 'vue-moveable';
export default {
  components: { Day, Moveable },
  props: ["person", "pindex","userName","openflag"],

  data() {
      return {
        moveable: {
          draggable: true,
          throttleDrag: 0,
          resizable: false,
          throttleResize: 1,
          keepRatio: true,
          scalable: false,
          throttleScale: 0,
          rotatable: false,
          throttleRotate: 0
        },
        num: null,
        /**************************************
        * Feature 1 add two new status "MS"(morning shift),"NS"(night shift)
        * Feature 2  add a dialog for updating the status
        **************************************/
        workTypes: ["W", "PH", "SL", "AL", "H(M)", "H(A)", "V", "T", "MS", "NS", "PO", "PM","HMSL","HMAL","HASL","HAAL"],
        open: false,
        dayType: " ",
        date: null,
        open1: true,
        value: -1,
        value1: false,
        size: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      }
  },

  computed: {
    displayName() {
      var nameArray = this.person.name.split(" ");
      if(nameArray.length == 2) return nameArray[0] + " " + nameArray[nameArray.length - 1];
      return nameArray[0] + " " + nameArray[1] + " " + nameArray[nameArray.length - 1];
    },
    shortName() {
      var nameArray = this.person.name.split(" ");
      return nameArray[0]; // + " " + nameArray[nameArray.length - 1][0];
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
  methods: {
    // moveable method
    handleDrag({ target, left, top }) {
      console.log('onDrag left, top', left, top);
      target.style.left = `${left}px`;
      target.style.top = `${top}px`;
    },
    handleResize({
      target, width, height, delta,
    }) {
      console.log('onResize', width, height);
      delta[0] && (target.style.width = `${width}px`);
      delta[1] && (target.style.height = `${height}px`);
    },
    handleScale({ target, transform, scale }) {
      console.log('onScale scale', scale);
      target.style.transform = transform;
    },
    handleRotate({ target, dist, transform }) {
      console.log('onRotate', dist);
      target.style.transform = transform;
    },
    handleWarp({ target, transform }) {
      console.log('onWarp', target);
      target.style.transform = transform;
    },
    /**************************************
     * Feature 6 One can only change his own status;TA & Manager have higher permission to all data
    **************************************/
    handleEvent:function(msg) {
      var nameArray = this.person.name.split(" ");
      if(this.userName.match(nameArray[0] + " " + nameArray[1]) == nameArray[0] + " " + nameArray[1]
      || this.userName == "Juncheng Zhu" // su
      || this.userName == "Karen Zheng"  // TM
      || this.userName == "Anita Yang"    
      || this.userName == "Danielle Zhao" // TA
      || this.userName == "Dingsong Zhang" 
      || this.userName == "Sean Wu (AZURE)" 
      || this.userName == "Anik Shen") {
         console.log("test1")
        if(this.openflag == false || this.open == true) {
          console.log("test2")
          this.open = true
          this.$emit('opensync',true)
          this.date = msg - 1
        }
      }
    },
    handleOpen: function() {
      this.open=false;
      this.$emit('opensync',false)
      location.reload();
    },
    cycleII(arg) {
      this.value = arg;
    },
    cycle(e, arg) {
      // if(arg === -1) return;
      if(this.value1) arg = arg + 1;
      this.dayType = this.workTypes[arg];
      // setTimeout(()=>{this.handleOpen()},2000);
      
    },

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
.row:hover:not(:first-child) {
    background: #444;
}
.row:hover>.cellxII {
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
  
  
  
}
.workday {
  color: #C2C4CE;
  /* cursor: pointer; */
}
.cellxII {
  color: #eaeaea;
  text-align: right;
  border-radius: 2px;
  margin: 4px;
  user-select: none;
  border: 0px solid;
  font-size: 16px;
  font-family: "Roboto Condensed", sans-serif;
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
.dayTypes {
  width: 267px;
}
.box-container {
  display: flex;
}
.box {
  cursor: pointer;
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
.large {
  flex-direction: column;
  width: 90px;
  font-weight: 700;
}
.help-dialogII {
  background-color: #2E3532;
  position: absolute;
  top: 25%;
  left: 50%;
  margin-left: -150px;
  width: 300px;
  padding: 30px;
  color: black;
  display: flex;
  justify-content: left;
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
  /* cursor: pointer; */
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

.outlookLogo {
  width: 70px;
  height: 40px;
  margin-left: 5px;
  margin-bottom: 5px;
}
.moveable {
  position: relative;
  text-align: center;
  font-size: 10px;
  margin: 0 auto;
  font-weight: 100;
  letter-spacing: 1px;
}

.el-switch {
  margin:auto;
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
</style>

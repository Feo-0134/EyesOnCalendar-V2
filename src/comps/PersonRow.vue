<template>
  <div class="row">
        <div v-if="large" class="cellx name">{{displayName}}</div>
        <div v-if="!large" class="cellx name">{{shortName}}</div>
      <day @customEvent="handleEvent" v-for="(d,index) in person.days" :large="large" :key="d._id" :day="d" :pindex="pindex" :dindex="index" :testparam="dayType" :testparamII="date"/>
      <!-- /**************************************
       Feature 2  add a dialog for updating the status
      **************************************/ -->
      <div v-if="open" @click="open=false">
        <div class="help-dialogII">
          <img class="exitIcon" src="../../static/img/exit.png" alt="joinPic" />
            <div class="legenda-container">
                <div class="dayTypes">
                    <div class="box-container">
                        <div v-on:click="cycle($event,0)" class="box green"></div><div v-on:click="cycle($event,5)" class="box green">MS</div><div v-on:click="cycle($event,6)" class="box green">NS</div><h5 class = "blackFont">Work Day</h5>
                    </div>
                    <div class="box-container">
                        <div v-on:click="cycle($event,3)" class="box red" v-popover:myname>V</div><h5 class = "blackFont">Vacation</h5>
                    </div>
                    <div class="box-container">
                        <div v-on:click="cycle($event,2)" class="box purple" v-popover:myname>DV</div><h5 class = "blackFont">Desired Vacation</h5>
                    </div>
                    <div class="box-container">
                        <div v-on:click="cycle($event,1)" class="box red">PH</div><h5 class = "blackFont">Public Holiday</h5>
                    </div>
                    <div class="box-container">
                        <div v-on:click="cycle($event,4)" class="box blue" v-popover:myname>T</div><h5 class = "blackFont">Training</h5>
                    </div>
                </div>
            </div>
            </div>
      </div>
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
import Day from "@/comps/DayCell";
export default {
  components: { Day },
  props: ["person", "pindex","userName"],

  data() {
      return {
        num: null,
        /**************************************
        * Feature 2  add a dialog for updating the status
        **************************************/
        workTypes: ["W", "PH", "DV", "V", "T", "MS", "NS"],//["W", "PH", "DV", "V", "T", "MS", "NS", "oc", "OC"],
        open: false,
        dayType: " ",
        date: null,
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
  },

  created() {
      window.addEventListener('resize',()=>{
          this.getWindowWidth()
      })  
  },
  methods: {
    
    /**************************************
     * Feature 1 add two new status "MS"(morning shift),"NS"(night shift)
     * Feature 6 One can only change his own status;TA & Manager have higher permission to all data
    **************************************/
    handleEvent:function(msg) {
      if(this.userName == this.person.name || this.userName == "Anik Shen"|| this.userName == "Karen Zheng"||this.userName == "Anita Yang"||this.userName == "Van Pan"||this.userName == this.person.name + "(International Supplier)"||this.userName.match(this.person.name) == this.person.name) {
        this.open = msg
        this.date = msg - 1
      }
    },
    
    /**************************************
     * Feature 1 add two new status "MS"(morning shift),"NS"(night shift)
    **************************************/
    cycle(e, arg) {
      this.dayType = this.workTypes[arg];
    },

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
.help-dialogII {
  background-color: #2E3532;
  position: fixed;
  top: 25%;
  left: 50%;
  margin-left: -150px;
  width: 300px;
  padding: 30px;
  color: black;
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
.exitIcon {
  width: 40px;
  height: 40px;
  margin-left: 240px;
  margin-bottom: 20px;
}
.outlookLogo {
  width: 70px;
  height: 40px;
  margin-left: 5px;
  margin-bottom: 5px;
}
</style>
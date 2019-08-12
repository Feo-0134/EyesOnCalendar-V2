<template>
  <div class="main">
        <el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>
        <el-dialog class="legenda-container"
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">        
                <div>
                    <div class="box-container">
                        <div v-on:click="cycle($event,0)" class="cellJuncheng box green"></div>
                        <div v-on:click="cycle($event,8)" class="cellJuncheng box green">MS</div>
                        <div v-on:click="cycle($event,9)" class="cellJuncheng box green1">NS</div><h5 class = "blackFont">Work Day</h5>
                    </div>
                    <div class="box-container">
                        <div v-on:click="cycle($event,2)" class="cellJuncheng box purple" v-popover:myname>SL</div><h5 class = "blackFont">Sick Leave</h5>
                        <div v-on:click="cycle($event,3)" class="cellJuncheng box purple" v-popover:myname>AL</div><h5 class = "blackFont">Annual Leave</h5>
                    </div>
                    <div class="box-container">
                        <div v-on:click="cycle($event,4)" class="cellJuncheng box purple" v-popover:myname>HSL</div><h5 class = "blackFont">Half-day Sick Leave(Morning/Afternoon)</h5>
                    </div>
                        <el-switch
                            
                            v-model="value1"
                            active-text="Morning"
                            inactive-text="Afternoon">
                        </el-switch>
                    <div class="box-container">
                        <div v-on:click="cycle($event,4)" class="cellJuncheng box purple" v-popover:myname>HSL</div><h5 class = "blackFont">Half-day Sick Leave(Morning/Afternoon)</h5>
                    </div>
                        <el-switch
                        v-model="value2"
                        active-text="Morning"
                        inactive-text="Afternoon">
                        </el-switch>
                    <div class="box-container">
                        <div v-on:click="cycle($event,10)" class="cellJuncheng box orange">PO</div>
                        <div v-on:click="cycle($event,11)" class="cellJuncheng box orange">PM</div><h5 class = "blackFont">OnDuty/MorningShift(PH)</h5>
                    </div>
                    <div class="box-container">
                        <div v-on:click="cycle($event,7)" class="cellJuncheng box blue" v-popover:myname>T</div><h5 class = "blackFont">Training</h5>
                    </div>
                    <div class="box-container">
                        <div v-on:click="cycle($event,1)" class="cellJuncheng box red">PH</div><h5 class = "blackFont">Public Holiday</h5>
                    </div>
                </div>
        
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
        </el-dialog>
  </div>
</template>

<script>
export default {
    name: 'TestDialog',
    data() {
      return {
        dialogVisible: false,
        value1: true,
        value2: true
      };
    },
    methods: {
      done() {
          alert('yeahhhh');
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(() => {
            done();
          })
          .catch(() => {});
      }
    }
}
</script>


<style>
.legenda-container {
  justify-content: left;
}
.box-container {
  display: flex;
}
.cellJuncheng {
  cursor: pointer;
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

.green1 {
  background-color: #3B4D50;
}

.blue {
  background-color: #375c8c;
}

.purple {
  background-color: #403259;
}

.orange {
  background-color: #b36b00;
}
</style>

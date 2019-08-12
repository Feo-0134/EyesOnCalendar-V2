<template>
  <div class="main">
        <el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>
        <div class = "dialog-container">
        <div class="dialog-content" title="Statuses Option" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">        
            <div class="box-container">
                <div v-on:click="cycle()" class="box green"></div>
                <div v-on:click="cycle()" class="box green">MS</div>
                <div v-on:click="cycle()" class="box green1">NS</div><h5 class = "blackFont">Work Day</h5>
            </div>
            <div class="box-container">
                <div v-on:click="cycle()" class="box purple" v-popover:myname>SL</div><h5 class = "blackFont">Sick Leave</h5>
                <div v-on:click="cycle()" class="box purple" v-popover:myname>AL</div><h5 class = "blackFont">Annual Leave</h5>
            </div>
            <div class="box-container">
                <div v-on:click="open1 = true; cycle();" class="box purple" v-popover:myname>HSL</div><h5 class = "blackFont">Half-day Sick Leave(Morning/Afternoon)</h5>
            </div>
                <el-switch v-if = "open1" v-model="value1" active-text="Afternoon" inactive-text="Morning"> </el-switch>
            <div class="box-container">
                <div v-on:click="open2 = true; cycle();" class="box purple" v-popover:myname>HAL</div><h5 class = "blackFont">Half-day Sick Leave(Morning/Afternoon)</h5>
            </div>
                <el-switch v-if = "open2" v-model="value2" active-text="Afternoon" inactive-text="Morning">
                </el-switch>
            <div class="box-container">
                <div v-on:click="cycle()" class="box orange">PO</div>
                <div v-on:click="cycle()" class="box orange">PM</div><h5 class = "blackFont">OnDuty/MorningShift(PH)</h5>
            </div>
            <div class="box-container">
                <div v-on:click="cycle()" class="box blue" v-popover:myname>T</div><h5 class = "blackFont">Training</h5>
            </div>
            <div class="box-container">
                <div v-on:click="cycle()" class="box red">PH</div><h5 class = "blackFont">Public Holiday</h5>
            </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="dialogVisible = false">Comfirm</el-button>
        </span>
        </div>
        <Moveable v-if="dialogVisible"
          class="moveable"
          v-bind="moveable"
          @drag="handleDrag"
          @resize="handleResize"
          @scale="handleScale"
          @rotate="handleRotate"
          @warp="handleWarp"
        >
        <div class="dialog-content" title="Statuses Option" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">        
            <div class="box-container">
                <div v-on:click="cycle()" class="box green"></div>
                <div v-on:click="cycle()" class="box green">MS</div>
                <div v-on:click="cycle()" class="box green1">NS</div><h5 class = "blackFont">Work Day</h5>
            </div>
            <div class="box-container">
                <div v-on:click="cycle()" class="box purple" v-popover:myname>SL</div><h5 class = "blackFont">Sick Leave</h5>
                <div v-on:click="cycle()" class="box purple" v-popover:myname>AL</div><h5 class = "blackFont">Annual Leave</h5>
            </div>
            <div class="box-container">
                <div v-on:click="open1 = true; cycle();" class="box purple" v-popover:myname>HSL</div><h5 class = "blackFont">Half-day Sick Leave(Morning/Afternoon)</h5>
            </div>
                <el-switch v-if = "open1" v-model="value1" active-text="Afternoon" inactive-text="Morning"> </el-switch>
            <div class="box-container">
                <div v-on:click="open2 = true; cycle();" class="box purple" v-popover:myname>HAL</div><h5 class = "blackFont">Half-day Sick Leave(Morning/Afternoon)</h5>
            </div>
                <el-switch v-if = "open2" v-model="value2" active-text="Afternoon" inactive-text="Morning">
                </el-switch>
            <div class="box-container">
                <div v-on:click="cycle()" class="box orange">PO</div>
                <div v-on:click="cycle()" class="box orange">PM</div><h5 class = "blackFont">OnDuty/MorningShift(PH)</h5>
            </div>
            <div class="box-container">
                <div v-on:click="cycle()" class="box blue" v-popover:myname>T</div><h5 class = "blackFont">Training</h5>
            </div>
            <div class="box-container">
                <div v-on:click="cycle()" class="box red">PH</div><h5 class = "blackFont">Public Holiday</h5>
            </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="dialogVisible = false">Comfirm</el-button>
        </span>
        </div>
        </Moveable>
        </div>
  </div>
</template>

<script>
export default {
    name: 'TestDialog',
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
        dialogVisible: false,
        open1: false,
        open2: false,
        value1: true,
        value2: true,
      };
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
    done() {
        alert('yeahhhh');
    },
    handleClose(done) {
    this.$confirm('Confirm to close?')
        .then(() => {
        done();
        })
        .catch(() => {});
    },
    cycle() {
    },
    }
}
</script>


<style>

.dialog-container {
    position: relative;
    height: 900px;
    
}
.dialog-content {
    width: 400px;
    margin:20px;
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
.moveable {
  position: relative;
  text-align: center;
  font-size: 10px;
  margin: 0 auto;
  font-weight: 100;
  letter-spacing: 1px;
  width: 400px;
  height: 550px;
}
</style>

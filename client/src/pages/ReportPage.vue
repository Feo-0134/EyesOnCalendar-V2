<template>
    <div>
      <p class='title_font'>Monthly Porter<p>
      <p v-if="!month">{{message}}</p>
      <div v-if="month">
          <div id="tablehead" v-bind:class="{sticky: scrolled}" class="row">
            <!-- <div class="name"> </div> -->
            <div class="report_cell" @click="workDayShow = !workDayShow">Base-WorkDay</div>
            <div class="report_cell" v-show="workDayShow">Normal</div>
            <div class="report_cell" v-show="workDayShow">Morning-Shift</div>
            <div class="report_cell" v-show="workDayShow">Night-Shift</div>
            <div class="report_cell" v-show="workDayShow">Training</div>
            <div class="report_cell" @click="leaveShow= !leaveShow">Leave</div>
            <div class="report_cell" v-show="leaveShow">Sick-Leave</div>
            <div class="report_cell" v-show="leaveShow">Annual-Leave</div>
            <div class="report_cell" @click="holidayShow = !holidayShow">Base-Holiday</div>
            <div class="report_cell" v-show="holidayShow">Holiday-OnDuty</div>
            <div class="report_cell" v-show="holidayShow">Holiday-MS</div>
            <div class="report_cell" >Weekend-Shift</div>
            <div class="report_cell" >Shift-Leave</div>
          </div>
          <Personsum class="marginLeft" v-for="(p,index) in month.people"
          :key="p._id" :pindex="index" :person="p" :workDayShow="workDayShow"
          :leaveShow="leaveShow" :holidayShow="holidayShow"
          />
      </div>
      <el-button type='primary' class="link_font" onclick="history.back(-1)">
                Back To Calendar
      </el-button>
  </div>
</template>

<script>
import Personsum from '@/components/PersonRowSum'

export default {
  components: { Personsum },
  data() {
    return {
      workDayShow: true,
      leaveShow: true,
      holidayShow: true,
      message: 'Loading month...',
      scrolled: false,
      changed: false,
    };
  },
  asyncComputed: {
    month: {
      async get() {
        try {
          const res = await this.$http.get('/api' + this.date);
          this.socket = io({
            query: {
              path: this.date,
            },
          });
          this.socket.on('update', (data) => {
            if (data.randomNumber === this.$randomNumber) return;
            this.month.people[data.indexes.p].days[data.indexes.d].workDay = data.workDay;
            this.month.people[data.indexes.p].days[data.indexes.d].workType = data.workType;
          });
          res.data.people = res.data.people.sort();
          window.console.log(res.data);
          return res.data;
        } catch (e) {
          this.socket = null;
          this.message = 'Month not found';
          return null;
        }
      },
      watch: ['changed'],
    },
  },
  methods: {
    updateChange() {
      this.changed = !this.changed;
    },
  },
  computed: {
    date() {
      this.updateChange();
      return (this.$router.currentRoute.path).replace('/report', '');
    },
    linkToCalendar() {
      return '/';
    },
  },
};
</script>

<style>
@import"test.css";
</style>

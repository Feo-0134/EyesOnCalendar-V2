<template>
  <div>
      <div class = "head">
        <div class="testClass">
          <div>
            <span>
                <el-autocomplete
                  v-model="teamName"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="SEARCH POD"
                  @select="handleSelect"
                >
                </el-autocomplete>
            </span>
            <el-button type="primary" v-show="admin" @click="goPortal()">Portal</el-button>
          </div>
        </div>
      </div>
      <div class="testClassII welcome">
        <p>Welcome, {{displayName}} {{displayTitle}}</p>
      </div>
      <h1 class="dateTop">
        <a :href="prevMonth" class="pointer">&lt;</a>
        {{prettyDate}}
        <a :href="nextMonth" class="pointer">&gt;</a>
        <el-tooltip v-show="admin" class="item"
        effect="light" content="Click to view WFM report" placement="right">
          <el-button class="WFbutton" type="primary"
          icon="el-icon-message" size="mini" @click="dialogTableVisible = true" >
          </el-button>
        </el-tooltip>
      </h1>
        <el-row :gutter="20" class="sketch-up" v-show="true">
          <el-col :span="16" :offset="8" class="sketch-up-content">
              <div class="grid-content bg-purple">
                  <el-row :gutter="20" class="cmt-roll">
                  <el-col :span="1">
                      <div class="grid-content bg-purple-light">
                          <div class = "cmtCell"
                          style="display:inline; width:10px; height:50%;
                          background-color: rgb(85, 112, 55);">MS</div>
                          <div class = "comment">Morning Shift</div>
                      </div>
                  </el-col>
                  <el-col :span="1"><div class="grid-content bg-purple-light">
                          <div class="grid-content bg-purple-light">
                          <div class = "cmtCell" style="display:inline;
                           width:10px; height:50%; background-color: #3b4d50;">NS</div>
                          <div class = "comment">Night Shift</div>
                      </div>
                  </div></el-col>
                  <el-col :span="1"><div class="grid-content bg-purple-light">
                          <div class="grid-content bg-purple-light">
                          <div class = "cmtCell" style="display:inline;
                           width:10px; height:50%; background-color: #375c8c;"> T </div>
                          <div class = "comment">Training</div>
                      </div>
                  </div></el-col>
                  <el-col :span="1"><div class="grid-content bg-purple-light">
                          <div class="grid-content bg-purple-light">
                          <div class = "cmtCell" style="display:inline;
                           width:10px; height:50%; background-color: #9488A6;">AL</div>
                          <div class = "comment">Annual Leave</div>
                      </div>
                  </div></el-col>
                  <el-col :span="1">
                      <div class="grid-content bg-purple-light">
                         <div class="grid-content bg-purple-light">
                          <div class = "cmtCell" style="display:inline;
                           width:10px; height:50%; background-color: #9488A6;">H(M)</div>
                          <div class = "comment">Morning AL</div>
                      </div>
                   </div></el-col>
                  <el-col :span="1"><div class="grid-content bg-purple-light">
                          <div class="grid-content bg-purple-light">
                          <div class = "cmtCell" style="display:inline;
                           width:10px; height:50%; background-color: #9488A6;">H(A)</div>
                          <div class = "comment">Afternoon AL</div>
                      </div>
                  </div></el-col>
                  <el-col :span="1"><div class="grid-content bg-purple-light">
                          <div class="grid-content bg-purple-light">
                          <div class = "cmtCell" style="display:inline;
                           width:10px; height:50%; background-color: #403259;">SL</div>
                          <div class = "comment">Sick Leave</div>
                      </div>
                      </div></el-col>
                  <el-col :span="1"><div class="grid-content bg-purple-light">
                          <div class="grid-content bg-purple-light">
                          <div class = "cmtCell" style="display:inline;
                           width:10px; height:50%; background-color: #403259;">H(M)</div>
                          <div class = "comment">Morning SL</div>
                      </div>
                  </div></el-col>
                  <el-col :span="1"><div class="grid-content bg-purple-light">
                          <div class="grid-content bg-purple-light">
                          <div class = "cmtCell" style="display:inline;
                           width:10px; height:50%; background-color: #403259;">H(A)</div>
                          <div class = "comment">Afternoon SL</div>
                  </div>
                  </div></el-col>
                  <el-col :span="1"><div class="grid-content bg-purple-light">
                          <div class="grid-content bg-purple-light">
                          <div class = "cmtCell" style="display:inline;
                           width:10px; height:50%; background-color: #b36a01;">PO</div>
                          <div class = "comment">Holiday OnDuty</div>
                      </div>
                      </div></el-col>
                  <el-col :span="1"><div class="grid-content bg-purple-light">
                          <div class="grid-content bg-purple-light">
                          <div class = "cmtCell" style="display:inline;
                           width:10px; height:50%; background-color: #b36a01;">PM</div>
                          <div class = "comment">Holiday MS</div>
                      </div>
                  </div></el-col>
                  <el-col :span="1"><div class="grid-content bg-purple-light">
                          <div class="grid-content bg-purple-light">
                          <div class = "cmtCell" style="display:inline;
                           width:10px; height:50%; background-color: #8c2230;">PH</div>
                          <div class = "comment">Public Holiday</div>
                  </div>
                  </div></el-col>
                  </el-row>
              </div>
          </el-col>
        </el-row>

      <el-dialog title="WFM Shift Data" width="70%" :visible.sync="dialogTableVisible"
       @open="openShiftTable" :before-close="beforeTableViewClose">
        <el-row id="copy-table" style="background-color:white;
         font-family: Calibri; color: #000000; font-size:15px">
            <span >TeamShift Data</span>
            <el-table :data=WFMData :default-sort = "{prop: 'alias', order: 'scending'}"
             border width="100%">
                <el-table-column prop="alias" label="Alias" :formatter="sliceAlise" width="120">
                  </el-table-column>
                <el-table-column prop="region"  label="Region" width="120"> </el-table-column>
                <el-table-column prop="dayofshift" label="Days of Shift" width="150">
                  </el-table-column>
                <el-table-column prop="weekdayshift" label="Weekday Shift Time" > </el-table-column>
                <el-table-column prop="weekendshift" label="Weekend Shift Time" > </el-table-column>
                <el-table-column prop="lunchtime" label="Lunch Time" > </el-table-column>
            </el-table>
            <br>
            <span>Individual Shift</span>
            <el-table :data=WFMData border width="100%">
                <el-table-column prop="alias" label="Engineer"
                 width="120" :formatter="sliceAlise"> </el-table-column>
                <el-table-column prop="status" label="Status"> </el-table-column>
                <el-table-column prop="date" label="Date"> </el-table-column>
            </el-table>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button @click=copyShiftInfo>{{ copyShiftInfoData }}</el-button>
            <el-button type="primary" @click=openOutlook>Open Outlook</el-button>
            <el-row :gutter="24">
              <el-col :span="10" :offset="14">
                <el-alert
                  title="please click copy shift data first and then click open outlook!"
                  type="warning"
                  :closable="false"
                  center>
                </el-alert>
              </el-col>
            </el-row>
        </span>
      </el-dialog>
      <el-dialog
        v-show="admin"
        title="EyesOnCalendar"
        :visible.sync="dialogVisible"
        width="30%">
        <span>Do you want to initiate this month data?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false;
           extendCalendar()">Confirm</el-button>
        </span>
      </el-dialog>
      <h2 v-if="!month" v-loading="loading"  class="noMonth welcome" >{{message}}</h2>
      <div  v-if="month">
          <el-tabs id="rolesTabview" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane class="mainPanel" label="All Members" name="first">
               <div id="tablehead" :class="{sticky: scrolled}" class="row">
               <div class="name"></div>
               <div v-for="(p,index) in month.people[0].days"
               :key="index" class="cellx">{{index+1}}</div>
               </div>
              <div id="tablehead" class="row">
                <div class="name">On Duty</div>
                <div v-for="(p,index) in month.people[0].days"
                :key="index" class="cellx"
                v-bind:class="{ percentageStageNotify: percentage(index)<80
                && percentage(index)>=60,percentageStageWarn: percentage(index)<60}" >
                  {{percentage(index)}}%
                </div>
              </div>
              <person  v-for="(p,index) in month.people" :key="p._id"
              :pindex="index" :person="p"  v-show="p.principle != 'TM' "
              :userName="displayName" :custom="month.customDayType"
              :openflag = "openflag" @opensync = "handleOpenPanel"/>
            </el-tab-pane>
            <el-tab-pane class="mainPanel" label="FTE Members" name="second">
              <div id="tablehead" :class="{sticky: scrolled}" class="row">
                <div class="name"></div>
                <div v-for="(p,index) in month.people[0].days"
                :key="index" class="cellx">{{index+1}}</div>
              </div>
              <div id="tablehead" class="row">
                <div class="name">On Duty</div>
                <div v-for="(p,index) in month.people[0].days"
                :key="index" class="cellx"
                v-bind:class="{ percentageStageNotify: percentageFTE(index)<80
                && percentage(index)>=60,percentageStageWarn: percentageFTE(index)<60}">
                  {{percentageFTE(index)}}%</div>
              </div>
              <person  v-for="(p,index) in month.people"
               v-show="p.role == 'FTE' && p.principle != 'TM' "
              :key="p._id" :pindex="index" :person="p" :userName="displayName"
              :custom="month.customDayType"
              :openflag = "openflag" @opensync = "handleOpenPanel"/>
            </el-tab-pane>
            <el-tab-pane class="mainPanel" label="Vendor Members" name="third">
               <div id="tablehead" :class="{sticky: scrolled}" class="row">
                <div class="name"></div>
                <div v-for="(p,index) in month.people[0].days"
                :key="index" class="cellx">{{index+1}}</div>
              </div>
              <div id="tablehead" class="row">
                <div class="name">On Duty</div>
                <div v-for="(p,index) in month.people[0].days"
                :key="index" class="cellx"
                 v-bind:class="{ percentageStageNotify: percentageVendor(index)<80
                 && percentage(index)>=60,percentageStageWarn: percentageVendor(index)<60}">
                   {{percentageVendor(index)}}%</div>
              </div>
              <person  v-for="(p,index) in month.people" v-show="p.role =='Vendor'"
              :key="p._id" :pindex="index" :person="p" :userName="displayName"
              :custom="month.customDayType"
              :openflag = "openflag" @opensync = "handleOpenPanel"/>
            </el-tab-pane>
          </el-tabs>
      </div>
      <help-screen />
      <!-- <transition name="fade">
        <loading v-if="isLoading"></loading>
      </transition> -->
  </div>
</template>

<script>
import moment from 'moment';
import Person from '@/components/PersonRow';
import HelpScreen from '@/components/HelpScreen';
// import Loading from '@/components/LoadButton';
const axios = require('axios');
const store = require('store');

export default {
  components: { Person, HelpScreen },
  data() {
    return {
      su: false,
      alias: '',
      links: [],
      timeout: null,
      message: 'Loading month...',
      scrolled: false,
      changed: false,
      initUndo: true,
      isLoading: false,
      activeName: 'first',
      openflag: false,
      state: null,
      teamName: this.$router.currentRoute.path.split('/')[1],
      loading: false,
      teamForm: {
        MorningShift: '',
        NightShift: '',
      },
      dialogVisible: false,
      dialogTableVisible: false,
      copyShiftInfoData: 'Copy Shift Data',
      TeamShiftText: 'Team Shift',
      WFMData: [],
      shiftData: [],
      Region: {
        gcr: 'GCR',
        eu: 'EMEA',
        us: 'US',
      },
      DayOfShift: {
        normal: 'Mon-Fri',
        weekendshift: 'Sun-Thu',
      },
      WeekdayShiftType: {
        normal: '9:00am~18:00pm',
        morningshift: '7:00am~16:00pm',
        nightshift: '2:00pm~23:00pm',
      },
      WeekendShiftType: {
        saturday: 'Sat: 7:00am~16:00pm',
        sunday: 'Sun: 7:00am~16:00pm',
      },
      LunchTime: {
        normal: '12:30~13:30pm',
        morningshift: '11:30~12:30pm',
      },
      TeamEmails: [],
    };
  },
  asyncComputed: {
    month: {
      async get() {
        try {
          const res = await this.$http.get(`/api${this.date}`);
          this.socket = io ({
            query: {
              path: this.date,
            },
          });
          this.socket.on('update', (data) => {
            if (data.randomNumber === this.$randomNumber) return;
            this.month.people[data.indexes.p].days[data.indexes.d].workDay = data.workDay;
            this.month.people[data.indexes.p].days[data.indexes.d].workType = data.workType;
          });
          res.data.people = res.data.people.sort((x, y) => x.name.localeCompare(y.name));

          // console.log(res.data.people);
          for(let key of res.data.people){
            let newalias = key.alias.slice(1, -1);
            // console.log(newalias);
            this.TeamEmails.push(newalias + "@microsoft.com");
          }
          // console.log(this.TeamEmails);

          this.getCaeNumber();

          return res.data;
        } catch (e) {
          window.console.log(e);
          this.socket = null;
          this.message = 'Month not found';
          this.dialogVisible = true;
          return null;
        }
      },
      watch: ['changed'],
    },
  },
  computed: {
    displayName() {
      return store.get('user').displayName;
    },
    displayTitle() {
      const title = store.get('user').title
      return '(' + title + ')'
    },
    admin() {
      const path = '/';
      if (store.get('user') === undefined) {
        this.$message('Please Login.');
        this.$router.push({ path })
        setTimeout(()=>{location.reload()},2000)
      }
      this.su = store.get('user').su
      this.alias = store.get('user').alias
      return store.get('user').admin;
    },
    totalamount() {
      return (this.month.people).length;
    },
    totalamountFTE() {
      let sum = 0;
      for (const b of Object.keys(this.month.people)) {
        if ((this.month.people[b].role).match('FTE') == 'FTE') {
          sum += 1;
        }
      }
      return sum;
    },
    totalamountVendor() {
      let sum = 0;
      for (const b of Object.keys(this.month.people)) {
        if ((this.month.people[b].role).match('Vendor') == 'Vendor') {
          sum += 1;
        }
      }
      return sum;
    },
    date() {
      this.changed = !this.changed;
      return this.$router.currentRoute.path;
    },
    dateSplit() {
      return this.date.split('/');
    },
    prettyDate() {
      return moment(this.date, '/YYYY/M').format('MMMM YYYY');
    },
    nextMonth() {
      return (
        `/${this.date.split('/')[1].toString()
        }${moment(this.date, '/YYYY/M')
          .add(1, 'M')
          .format('/YYYY/M')}`);
    },
    prevMonth() {
      return (
        `/${this.date.split('/')[1].toString()
        }${moment(this.date, '/YYYY/M')
          .subtract(1, 'M')
          .format('/YYYY/M')}`);
    },
    goReport() {
      return (`/${this.date.split('/')[1].toString()}${moment(this.date, '/YYYY/M').format('/YYYY/M')}/report`);
    },
    goAddPerson() {
      return (`/${this.date.split('/')[1].toString()}${moment(this.date, '/YYYY/M').format('/YYYY/M')}/person`);
    },
    goDeletePerson() {
      return (`/${this.date.split('/')[1].toString()}${moment(this.date, '/YYYY/M').format('/YYYY/M')}/delete`);
    },
    percentage() {
      return function (val) {
        let sum = 0;
        for (const b of Object.keys(this.month.people)) {
          if (this.month.people[b].days[val].workType === 'W'
          || this.month.people[b].days[val].workType === 'MS'
          || this.month.people[b].days[val].workType === 'NS'
          || this.month.people[b].days[val].workType === 'PO'
          || this.month.people[b].days[val].workType === 'PM'
          || this.month.people[b].days[val].workType === 'WS') {
            sum += 1;
          }
        }
        return ((sum / this.totalamount) * 100).toFixed(0);
      };
    },
    percentageFTE() {
      return function (val) {
        let sum = 0;
        for (const b of Object.keys(this.month.people)) {
          if ((this.month.people[b].role).match('FTE') == 'FTE'
          && (this.month.people[b].days[val].workType === 'W'
          || this.month.people[b].days[val].workType === 'MS'
          || this.month.people[b].days[val].workType === 'NS'
          || this.month.people[b].days[val].workType === 'PO'
          || this.month.people[b].days[val].workType === 'PM'
          || this.month.people[b].days[val].workType === 'WS')) {
            sum += 1;
          }
        }
        if (this.totalamountFTE == 0) return 0;
        return ((sum / this.totalamountFTE) * 100).toFixed(0);
      };
    },
    percentageVendor() {
      return function (val) {
        let sum = 0;
        for (const b of Object.keys(this.month.people)) {
          if ((this.month.people[b].role).match('Vendor') == 'Vendor'
          && (this.month.people[b].days[val].workType === 'W'
          || this.month.people[b].days[val].workType === 'MS'
          || this.month.people[b].days[val].workType === 'NS'
          || this.month.people[b].days[val].workType === 'PO'
          || this.month.people[b].days[val].workType === 'PM'
          || this.month.people[b].days[val].workType === 'WS')) {
            sum += 1;
          }
        }
        if (this.totalamountVendor == 0) return 0;
        return ((sum / this.totalamountVendor) * 100).toFixed(0);
      };
    },
    apiPath() {
      return (
        `/api${
          this.$router.currentRoute.path
        }/init`
      );
    },
    apiPayload() {
      return {
        year: '2019',
      };
    },
    apiPath2() {
      return (
        `/api${
          this.$router.currentRoute.path
        }/reload`
      );
    },
    apiPayload2() {
      return {
        year: '2019',
      };
    },
    getTeamApiPath() {
      if (this.su === true) {
        return (`/api${this.$router.currentRoute.path}/allTeamName`);
      }
      return '/api'+ this.$router.currentRoute.path +'/ownTeamName/'+ this.alias;
    },
  },
  created() {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  mounted() {
    this.loadTeamName();
    this.state = this.$store.state;
    // window.addEventListener('keyup', (ev) => {
    //   this.callUndo(ev);
    // });
  },

  methods: {
    addFeedback(type, msg) {
      const h = this.$createElement;
      if (type === 'error') {
        this.$notify.error({
          title: 'Error',
          message: msg,
          position: 'top-left',
          duration: 0,
        });
      }
      if (type === 'notify') {
        this.$notify({
          title: 'Notification',
          message: msg,
          position: 'top-left',
          type: 'warning',
          duration: 6000,
        });
      }
      if(type === 'success') {
        this.$notify({
          title: 'Success',
          message: h('i', { style: 'color: teal' }, msg),
          position: 'top-left',
          type: 'success',
        });
      }
    },
    extendCalendar() {
      try {
        let that = this;
        this.loading = true;
        this.$http.post("/api/"+this.teamName+"/extendCalendar/"+this.$router.currentRoute.path.split('/')[2]+'/'+this.$router.currentRoute.path.split('/')[3])
          .then((response) => {
            window.console.log(response);
            if (response.data === 'no last month data') {
              that.loading = false;
              that.addFeedback('notify', 'Please initiate last month data.');
              return;
            }
          });
        setTimeout(() => {
          if (this.loading === true) window.location.reload();
        }, 4000);
      } catch (e) {
        window.console.log(e);
      }
    },
    goPortal() {
      const path = '/portal';
      this.$router.push({ path });
      // location.reload();
    },
    loadTeamName() {
      this.$http.get(this.getTeamApiPath)
        .then((response) => {
          this.links = response.data;
        })
        .catch((error) => {
          this.addFeedback('error', 'System Error. Please contact eyesoncalendar team.');
          window.console.log(error);
          return [];
        });
    },
    querySearchAsync(queryString, cb) {
      const links = this.links;
      // var results = queryString ? links.filter(this.createFilter(queryString)) : links;
      const results = links;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 500);
      // * Math.random()); // what is this?? check it out later
    },
    createFilter(queryString) {
      return (link) => {
        return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      const path = item.link;
      this.$router.push({ path });
      window.location.reload();
    },
    addMonth() {
      const path = moment(this.date, '/YYYY/M')
        .add(1, 'M')
        .format('/YYYY/M');
      this.$router.push({ path });
    },
    subMonth() {
      const path = moment(this.date, '/YYYY/M')
        .subtract(1, 'M')
        .format('/YYYY/M');
      this.$router.push({ path });
    },
    init() {
      if (this.admin === false) {
        this.initDeny('noPermission', 'You have no permission to init this month.');
      }
      if (this.admin === true) {
        const that = this;
        let flag = false;
        const newMon = (new Date().getMonth() + 2) % 12 ? (new Date().getMonth() + 2) % 12 : 12;
        const thisMon = this.date.split('/');
        if (newMon == thisMon[3]) { // 弱类型相等；
          flag = true;
        } else {
          this.initDeny('forbid', 'Only the month after the current month can be initiated. The current month is ');
        }
        if (flag) {
          this.isLoading = true;
          this.initUndo = false;
          this.$http.post(this.apiPath, this.apiPayload);
          setTimeout(() => {
            that.isLoading = false;
          }, 5000);
        }
      }
    },
    initDeny(type, msg) {
      const mon = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      if (type === 'noPermission') {
        this.$notify({
          title: 'Notification',
          message: msg,
          position: 'top-left',
          type: 'warning',
        });
      } else if (type === 'forbid') {
        this.$notify({
          title: 'Notification',
          message: msg + mon[new Date().getMonth()],
          position: 'top-left',
          type: 'warning',
        });
      }
    },
    reload() {
      if (this.initUndo === false) {
        this.$http.post(this.apiPath2, this.apiPayload2);
        setTimeout(() => {
          window.location.reload();
        }, 4000);
      }
    },
    handleOpenPanel(msg) {
      this.openflag = msg;
    },
    handleScroll() {
      const sticky = document.getElementById('tablehead').offsetTop;
      // console.log(window.pageYOffset);
      if (window.pageYOffset <= 500) {
        this.scrolled = false;
        return;
      }
      if (window.pageYOffset >= sticky) {
        this.scrolled = true;
      } else {
        this.scrolled = false;
      }
    },
    // handleClick(tab, event) {
    //   console.log(tab, event);
    // },
    // callUndo(ev) {
    //   if (ev.code !== "KeyZ" || ev.ctrlKey !== true) return;
    //   else if (this.$history.length == 0) return;
    //   {
    //     var x = this.$history.pop();
    //     var data = x.payload;
    //     this.month.people[data.indexes.p].days[data.indexes.d].workDay =
    //       data.workDay;
    //     this.month.people[data.indexes.p].days[data.indexes.d].workType =
    //       data.workType;
    //     this.$http.post(x.path, x.payload);
    //   }
    // },
    openShiftTable() {
      window.console.log('opening shift data');
      this.WFMData = this.month.people;
      // console.log(this.WFMData);

      // get all weekends in this month
      let year = this.month.year;
      let month = this.month.month;

      for(let key of this.WFMData) {
        // get client region
        let newdate = new Date();
        let timezone = newdate.getTimezoneOffset() / 60;
        // console.log(timezone);
        if(timezone == '-8'){
            key.region = this.Region.gcr;
        } else if (timezone == '5') {
            key.region = this.Region.eu;
        } else if (timezone == '1') {
            key.region = this.Region.us;
        }
        // get day of shift
        // console.log(key.days);
        let weekendcount = 0;
        for(let days of key.days){
            // console.log(days.day + days.workType);
            let d = new Date(year + "-" + month + "-" + days.day);
            // console.log(d.getDay() + days.workType);
            if((d.getDay() == 6 && days.workType == "MS") || (d.getDay() == 0 && days.workType == "MS")) {
                weekendcount ++;
                // console.log(weekendcount);
                // console.log(d.getDay() + days.workType);
            };
        }
        if(weekendcount > 2){
            // engineer is on weekend shift
            key.dayofshift = this.DayOfShift.weekendshift;
            key.weekendshift = this.WeekendShiftType.sunday;
        } else {
            key.dayofshift = this.DayOfShift.normal;
        }
        
        // get weekdayshift
        let morningsft = this.teamForm.MorningShift;
        let nightsft = this.teamForm.NightShift;

        let utctime = 0 - timezone;
        let timezonesign = (utctime >= 0)? "+" : "";
        if(morningsft.includes(key.name)) {
            // console.log(utctime);
            // console.log(timezonesign);
            // console.log(timezone);
            key.weekdayshift = this.WeekdayShiftType.morningshift + " UTC" + timezonesign + utctime;
            key.lunchtime = this.LunchTime.morningshift + " UTC" + timezonesign + utctime;
        } else if(nightsft.includes(key.name)){
            key.weekdayshift = this.WeekdayShiftType.nightshift + " UTC" + timezonesign + utctime;
        } else {
            key.weekdayshift = this.WeekdayShiftType.normal + " UTC" + timezonesign + utctime;
            key.lunchtime = this.LunchTime.normal + " UTC" + timezonesign + utctime;
        }
        key.status = "-";
        key.date = "2019-10-01";
      }

      // let shiftData = this.teamForm;
      // console.log(shiftData);
    },

    copyShiftInfo() {
      console.log("copying shift data");

      const table = document.getElementById('copy-table');
      const range = document.createRange();

      range.selectNode(table);  // define copy data is table

      const selection = window.getSelection();
      if (selection.rangeCount > 0) selection.removeAllRanges();
      selection.addRange(range);

      var successful = document.execCommand('copy');  // execute copy
      var msg = successful ? 'successful' : 'unsuccessful';

      if(msg === 'successful'){
          this.copyShiftInfoData = 'Copied!!'
      }else {
          this.addFeedback('notify', 'Sorry, failed to copy, please try manually');
      }

      selection.removeAllRanges();  // remove selection
    },
    beforeTableViewClose() {
      this.dialogTableVisible = false;
      this.copyShiftInfoData = 'Copy Shift Data';
    },
    openOutlook() {
      window.console.log('opening outlook');
      window.location.href = 'mailto:wfms@microsoft.com?subject=[REVIEW REQUIRED] WFM Update List';
      this.dialogTableVisible = false;
      this.copyShiftInfoData = 'Copy Shift Data';
    },
    sliceAlise(row, column) {
      window.console.log(column);
      return row.alias.slice(1, -1);
    },
    getCaeNumber() {
      // console.log("get caseNumber from main page");
      // console.log(this.TeamEmails);

      axios({
        method: 'post',
        url: 'https://pta-eyes-on-api.azurewebsites.net/api/GetDailyVolumeByUpn?code=C5ugr1rsTkjAy6OrjfwPaPsDvuW0tnbee8c8tcJdxCmKkJSt0SRdIQ==',
        data: {
          "upn":this.TeamEmails
        }
      })
      .then((response)=>{

        // let jsondata = JSON.stringify(response.data);
        let jsondata = response.data;
        console.log(jsondata);

        let arrayAlias = [];
        
        for(let i in jsondata){
          arrayAlias.push({alias: i, casenumber: jsondata[i]});
        }
        // console.log(arrayAlias);

        this.$store.commit('getDailyCaseNumber', arrayAlias);
      })
      .catch((error)=>{
        console.log(error);
      });
    },
  },
};
</script>

<style>
@import"test.css";
</style>

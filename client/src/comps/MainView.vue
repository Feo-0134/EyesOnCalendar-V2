<template>
  <div>
      <div class = "head">
        <div class="testClass">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="el-icon-arrow-down el-icon--right"></i>
              SELECT POD
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="/AppService">&gt; AppService</el-dropdown-item>
              <el-dropdown-item command="/DEV">&gt; DEV</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <a :href="goAddPerson" v-if="admin" class="sectionPointer">&gt; AddPerson</a>
          <a :href="goDeletePerson" v-if="admin" class="sectionPointer">&gt; DeletePerson</a>
          <a :href="goReport" v-if="admin" class="sectionPointer">&gt; Report</a>
        </div>
      </div>
      <div class="testClassII welcome">
        <p>Welcome, {{emailUnderName}}</p>
      </div>
      <!-- <div class = "MonthSwitch"> -->
      <h1>
        <a :href="prevMonth" class="pointer">&lt;</a>
        {{prettyDate}}
        <a :href="nextMonth" class="pointer">&gt;</a>
      </h1>
      <h2> This Page is read-only.</h2> <h2> Please update your data at <a href="https://eyesoncalendar.azurewebsites.net">eyesoncalendar.azurewebsites.net</a></h2>
      <!-- <div class = "Init-button"> -->
      <h2 v-if="!month">{{message}}</h2>
      <button v-if="!month" class = "button"
      :class="{buttonBackground: initUndo}" v-on:click="init">
        Init Table
      </button>
      <button v-if="!month" class = "button"
      :class="{buttonBackground: !initUndo}" v-on:click="reload">
        Reload Table
      </button>
      <div  v-if="month">
          <el-tabs id="tabsJuncheng" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane class="mainPanel" label="All Members" name="first">
               <div id="tablehead" :class="{sticky: scrolled}" class="row tablehead">
               <div class="name"></div>
               <div v-for="(p,index) in month.people[0].days"
               :key="index" class="cellx">{{index+1}}</div>
               </div>
              <!-- /**************************************
              Feature 3 on-duty rate
              **************************************/ -->
              <div id="tablehead" class="row tablehead">
                <div class="name attendance">On Duty</div>
                <div v-for="(p,index) in month.people[0].days"
                :key="index" class="cellx">{{percentage(index)}}%</div>
              </div>
              <person  v-for="(p,index) in month.people" :key="p._id"
              :pindex="index" :person="p" :userName="emailUnderName"
              :openflag = "openflag" @opensync = "handleOpenPanel"/>
            </el-tab-pane>
            <el-tab-pane class="mainPanel" label="FTE Members" name="second">
              <div id="tablehead" :class="{sticky: scrolled}" class="row tablehead">
                <div class="name"></div>
                <div v-for="(p,index) in month.people[0].days"
                :key="index" class="cellx">{{index+1}}</div>
              </div>
              <!-- /**************************************
              Feature 3 on-duty rate
              **************************************/ -->
              <div id="tablehead" class="row tablehead">
                <div class="name attendance">On Duty</div>
                <div v-for="(p,index) in month.people[0].days"
                :key="index" class="cellx">{{percentageFTE(index)}}%</div>
              </div>
              <person  v-for="(p,index) in month.people" v-show="p.name.match('FTE')=='FTE'"
              :key="p._id" :pindex="index" :person="p" :userName="emailUnderName"
              :openflag = "openflag" @opensync = "handleOpenPanel"/>
            </el-tab-pane>
            <el-tab-pane class="mainPanel" label="Vendor Members" name="third">
               <div id="tablehead" :class="{sticky: scrolled}" class="row tablehead">
                <div class="name"></div>
                <div v-for="(p,index) in month.people[0].days"
                :key="index" class="cellx">{{index+1}}</div>
              </div>
              <!-- /**************************************
              Feature 3 on-duty rate
              **************************************/ -->
              <div id="tablehead" class="row tablehead">
                <div class="name attendance">On Duty</div>
                <div v-for="(p,index) in month.people[0].days"
                :key="index" class="cellx">{{percentageVendor(index)}}%</div>
              </div>
              <person  v-for="(p,index) in month.people" v-show="p.name.match('v-')=='v-'"
              :key="p._id" :pindex="index" :person="p" :userName="emailUnderName"
              :openflag = "openflag" @opensync = "handleOpenPanel"/>
            </el-tab-pane>
          </el-tabs>
      </div>
      <help-screen />
      <!-- <div class = "Init-button"> -->
      <transition name="fade">
        <loading v-if="isLoading"></loading>
      </transition>
  </div>
</template>

<script>
import moment from 'moment';
import Person from '@/components/PersonRow';
import HelpScreen from '@/components/HelpScreen';
import Loading from '@/components/LoadButton';

export default {
  components: { Person, HelpScreen, Loading },
  data() {
    return {
      message: 'Loading month...',
      scrolled: false,
      changed: false,
      emailUnderName: null,
      initUndo: true,
      admin: false,
      isLoading: false,
      activeName: 'first',
      openflag: false,
    };
  },
  asyncComputed: {
    month: {
      async get() {
        try {
          const res = await this.$http.get(`/api${this.date}`);
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
          res.data.people = res.data.people.sort((x, y) => x.name.localeCompare(y.name));
          return res.data;
        } catch (e) {
          console.log(e);
          this.socket = null;
          this.message = 'Month not found';
          return null;
        }
      },
      watch() {
        this.changed;
      },
    },
  },
  computed: {
    totalamount() {
      return (this.month.people).length;
    },
    totalamountFTE() {
      let sum = 0;
      for (const b of Object.keys(this.month.people)) {
        if (this.month.people[b].name.match('FTE') == 'FTE') {
          sum += 1;
        }
      }
      return sum;
    },
    totalamountVendor() {
      let sum = 0;
      for (const b of Object.keys(this.month.people)) {
        if (this.month.people[b].name.match('v-') == 'v-') {
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
    /** ************************************* Router ************************************* */
    goReport() {
      return (`/${this.date.split('/')[1].toString()}${moment(this.date, '/YYYY/M').format('/YYYY/M')}/report`);
    },
    goAddPerson() {
      return (`/${this.date.split('/')[1].toString()}${moment(this.date, '/YYYY/M').format('/YYYY/M')}/person`);
    },
    goDeletePerson() {
      return (`/${this.date.split('/')[1].toString()}${moment(this.date, '/YYYY/M').format('/YYYY/M')}/delete`);
    },
    /** ************************************* 
     * Feature 3 on-duty rate 
     * ************************************* */
    percentage() {
      return function (val) {
        let sum = 0;
        for (const b of Object.keys(this.month.people)) {
          if (this.month.people[b].days[val].workType === 'W'
          || this.month.people[b].days[val].workType === 'MS'
          || this.month.people[b].days[val].workType === 'NS'
          || this.month.people[b].days[val].workType === 'PO'
          || this.month.people[b].days[val].workType === 'PM') {
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
          if (this.month.people[b].name.match('FTE') == 'FTE'
          && (this.month.people[b].days[val].workType === 'W'
          || this.month.people[b].days[val].workType === 'MS'
          || this.month.people[b].days[val].workType === 'NS'
          || this.month.people[b].days[val].workType === 'PO'
          || this.month.people[b].days[val].workType === 'PM')) {
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
          if (this.month.people[b].name.match('v-') == 'v-'
          && (this.month.people[b].days[val].workType === 'W'
          || this.month.people[b].days[val].workType === 'MS'
          || this.month.people[b].days[val].workType === 'NS'
          || this.month.people[b].days[val].workType === 'PO'
          || this.month.people[b].days[val].workType === 'PM')) {
            sum += 1;
          }
        }
        if (this.totalamountVendor == 0) return 0;
        return ((sum / this.totalamountVendor) * 100).toFixed(0);
      };
    },
    /** *************************************
     * Feature 9 init calendar
     * ************************************* */
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
  },
  created() {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  mounted() {
    window.addEventListener('keyup', (ev) => {
      this.callUndo(ev);
    });
    this.personinfo();
  },
  methods: {
    handleCommand(command) {
      const path = (command + moment(this.date, '/YYYY/M').format('/YYYY/M'));
      this.$router.push({ path });
      location.reload();
      // this.$message('click on item ' + command);
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
    handleOpenPanel(msg) {
      this.openflag = msg;
    },
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

    handleScroll() {
      const header = document.getElementById('tablehead');
      const sticky = header.offsetTop;
      // console.log(window.pageYOffset);
      if (window.pageYOffset <= 115) {
        this.scrolled = false;
        return;
      }
      if (window.pageYOffset >= sticky) {
        this.scrolled = true;
      } else {
        this.scrolled = false;
      }
    },
    /** *************************************
     * Feature 4 Easy Authentication
     * Feature 6 Permission control
     * ************************************* */
    personinfo() {
      return new Promise((resolve, reject) => {
        this.$http.get('/.auth/me').then((response) => {
          if (response.data[0].user_claims) {
            for (const a of response.data[0].user_claims) {
              if (a.typ === 'name') {
                this.emailUnderName = a.val;
              }
            }
          } else {
            this.emailUnderName = 'Danielle Zhao';
          }
          if (this.emailUnderName.match('Juncheng Zhu') == 'Juncheng Zhu'
          || this.emailUnderName.match('Karen Zheng') == 'Karen Zheng'
          || this.emailUnderName.match('Anik Shen') == 'Anik Shen'
          || this.emailUnderName.match('Danielle Zhao') == 'Danielle Zhao'
          || this.emailUnderName.match('Dingsong Zhang') == 'Dingsong Zhang'
          || this.emailUnderName.match('Anita Yang') == 'Anita Yang'
          || this.emailUnderName.match('Sean Wu (AZURE)') == 'Sean Wu (AZURE)') { this.admin = true; }
        }).catch((error) => {
          // if(error.toString().match('404') == '404') {this.emailUnderName = 'Juncheng Doooo'; this.admin = true; }
          reject(error);
        });
      });
    },
    /** *************************************
     * Feature 9 init calendar
     * ************************************* */
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
          duration: 0,
        });
      } else if (type === 'forbid') {
        this.$notify({
          title: 'Notification',
          message: msg + mon[new Date().getMonth()],
          position: 'top-left',
          type: 'warning',
          duration: 0,
        });
      }
    },
    reload() {
      if (this.initUndo === false) {
        this.$http.post(this.apiPath2, this.apiPayload2);
        setTimeout(() => {
          location.reload();
        }, 4000);
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>

<style>
.attendance {
  margin: 9px 0 0 0;
}

.tablehead {
  width: 100%;
}

.sticky {
  position: fixed;
  top: 0;
  background: rgb(37, 37, 37);
}

.sticky + .tablehead {
  padding-top: 102px;
}

.pointer {
  cursor: pointer;
  margin: 0 5px 0 5px;
  padding: 0 10px 0 10px;
  text-decoration: none;
  color: white;
}

.sectionPointer {
  cursor: pointer;
  margin: 0 10px 0 10px;
  text-decoration: none;
  color: gray;
}

.sectionPointer:hover {
  background-color:none;
}

.testClass {
  margin-right: 40px;
    margin-bottom: 55px;
    text-align:right;

}
.testClassII {
    text-align: right;
}
.pointer:hover {
  background-color: #555;
}
.marginLeft {
  margin-left: 30px
}
.button {

  border: none;
  margin: 10px;
  color: rgb(255, 255, 255);
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 15px;

}
.buttonBackground {
  background-color: #4CAF50; /* Green */
}
.el-dropdown-link {
  cursor: pointer;
  color:gray;
}
.el-icon-arrow-down {
  font-size: 12px;
}
#tabsJuncheng .el-tabs__item{
  color:#808080;
}
#tabsJuncheng .el-tabs__nav-scroll {
  margin-left:50px;
}

.el-tabs__nav-wrap::after {
  visibility: hidden;
}
.moveable-line {
  visibility: hidden;
}
.mainPanel {
  min-height: 1000px;
}
</style>

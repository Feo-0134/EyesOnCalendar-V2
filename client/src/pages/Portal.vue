<template> 
    <el-container>
    <el-header class="navigationBar">EyesonCalendar Administration
            <el-button class="navigationButton" type="primary" v-show="true" >
              <a :href="goCalendar" class="navigationLink">Calendar</a>
            </el-button>
    </el-header>
    <el-container>
        <el-aside width="300px">
            <el-menu>
                <el-submenu index="2">
                    <template slot="title"><i class="el-icon-menu"></i>EyesonCalendar</template>
                    <el-menu-item-group>
                    <template slot="title"></template>
                    <el-menu-item index="2-3" v-on:click="showInitView">Initiate Calendar</el-menu-item>
                    <el-menu-item index="2-1" v-on:click="showTeamView">Team Management</el-menu-item>
                    <el-menu-item index="2-2" v-on:click="showShiftView">Shift Management</el-menu-item>
                    <el-menu-item index="2-4" v-on:click="showReportView">EyesonCalendar Report</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-main>
            <el-dialog title="Add Person" :visible.sync="addFormVisible">
                <el-form :model="addForm">
                    <el-form-item label="Alias" :label-width="formLabelWidth">
                    <el-input v-model="addForm.alias" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="Name" :label-width="formLabelWidth">
                    <el-input v-model="addForm.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="Role" :label-width="formLabelWidth" v-show="inputRole">
                    <el-input v-model="addForm.role" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addFormVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="addPerson();addFormVisible = false">Confirm</el-button>
                </div>
            </el-dialog>
            <el-dialog title="Delete Person" :visible.sync="delFormVisible">
                <el-form :model="form">
                    <el-form-item label="Alias" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="delFormVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="delFormVisible = false">Confirm</el-button>
                </div>
            </el-dialog>
            <el-form v-if="initView"   :model="initForm" label-width="140px">
                <el-form-item label="Team Name">
                    <el-input v-model="initForm.TeamName" placeholder="example: AppService"></el-input>
                </el-form-item>
                <el-form-item label="Month">
                    <el-input v-model="initForm.Month" placeholder="example: 2019/8"></el-input>
                </el-form-item>
                <el-form-item label="Team Manager">
                    <el-input v-model="initForm.TeamManager" placeholder="example: karenzhe"></el-input>
                </el-form-item>
                <el-form-item label="Technic Advisor">
                    <el-input v-model="initForm.TeamAdvisor" placeholder="example: danzha;anikshen;"></el-input> 
                </el-form-item>
                <el-form-item label="FTE">
                    <el-input v-model="initForm.FTE" placeholder="example: ftealias00;ftealias01;"></el-input>
                </el-form-item>
                <el-form-item label="Vendor">
                    <el-input v-model="initForm.Vendor" placeholder="example: vendoralias;"></el-input>
                </el-form-item>
                <!-- <el-form-item label="Others">
                    <el-input v-model="form.name"></el-input>
                </el-form-item> -->
                <span>
                    <el-button @click="cleanInitForm">Cancel</el-button>
                    <el-button type="primary" @click="initiateCalendar">Confirm</el-button>
                </span>
            </el-form>
            <el-form v-if="shiftView"  :model="shiftForm" label-width="140px">
                <el-form-item label="Team Name">
                    <el-input v-model="shiftForm.TeamName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="Month">
                    <el-input v-model="shiftForm.Month" ></el-input>
                </el-form-item>
                <el-form-item label="Morning Shift">
                    <el-input v-model="shiftForm.TeamManager" ></el-input>
                    <div class="functionalButton">
                    <el-button type="primary" icon="el-icon-plus" circle></el-button>
                    <el-button type="primary" icon="el-icon-minus" circle></el-button>
                    </div>
                </el-form-item>
                <el-form-item label="Night Shift">
                    <el-input v-model="shiftForm.TeamManager" ></el-input>
                    <div class="functionalButton">
                    <el-button type="primary" icon="el-icon-plus" circle></el-button>
                    <el-button type="primary" icon="el-icon-minus" circle></el-button>
                    </div>
                </el-form-item>
                <span>
                    <el-button @click=";">Cancel</el-button>
                    <el-button type="primary" @click=";">Confirm</el-button>
                </span>
            </el-form>
            <el-form v-if="teamView"   :model="teamForm" label-width="140px">
                <el-form-item label="Team Name">
                    <el-input v-model="teamForm.TeamName" ></el-input>
                </el-form-item>
                <el-form-item label="Month">
                    <el-input v-model="teamForm.Month" ></el-input>
                </el-form-item>
                <el-form-item label="Team Manager">
                    <el-input v-model="teamForm.TeamManager" :disabled="true"></el-input>
                    <div class="functionalButton">
                    <el-button type="primary" icon="el-icon-plus" circle v-on:click="addPersonView('FTE', 'TM')"></el-button>
                    <el-button type="primary" icon="el-icon-minus" circle v-on:click="delPersonView()"></el-button>
                    </div>
                </el-form-item>
                <el-form-item label="Technical Advisor">
                    <el-input v-model="teamForm.TeamAdvisor" :disabled="true"></el-input>
                    <div class="functionalButton">
                    <el-button type="primary" icon="el-icon-plus" circle v-on:click="addPersonView('', 'TA')"></el-button>
                    <el-button type="primary" icon="el-icon-minus" circle v-on:click="delPersonView()"></el-button>
                    </div>
                </el-form-item>
                               <el-form-item label="FTE Member">
                    <el-input v-model="teamForm.FTE" :disabled="true"></el-input>
                    <div class="functionalButton">
                    <el-button type="primary" icon="el-icon-plus" circle v-on:click="addPersonView('FTE', 'None')"></el-button>
                    <el-button type="primary" icon="el-icon-minus" circle v-on:click="delPersonView()"></el-button>
                    </div>
                </el-form-item>
                               <el-form-item label="Vendor member">
                    <el-input v-model="teamForm.Vendor" :disabled="true"></el-input>
                    <div class="functionalButton">
                    <el-button type="primary" icon="el-icon-plus" circle v-on:click="addPersonView('Vendor', 'None')"></el-button>
                    <el-button type="primary" icon="el-icon-minus" circle v-on:click="delPersonView()"></el-button>
                    </div>
                </el-form-item>
                <!-- <el-form-item label="Others">
                    <el-input v-model="form.name"></el-input>
                </el-form-item> -->
            </el-form>
            <el-form v-if="reportView" :model="teamForm" label-width="140px">
                <el-form-item label="Team Name">
                    <el-input v-model="teamForm.TeamName" ></el-input>
                </el-form-item>
                <el-form-item label="Month">
                    <el-input v-model="teamForm.Month" ></el-input>
                </el-form-item>
                <!-- <el-form-item label="Others">
                    <el-input v-model="form.name"></el-input>
                </el-form-item> -->
            </el-form>
        </el-main>
    </el-container>
    </el-container>
</template>

<script>
var store = require('store')
export default {
    data: function () {
        return {
            teamView: true,
            shiftView: false,
            reportView: false,
            initView: false,
            addFormVisible:false,
            inputRole:false,
            delFormVisible:false,
            form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
            },
            addForm: {
                alias: '',
                name: '',
                role: '',
                principle: ''
            },
            delForm: {
                alias: '',
            },
            initForm: {
                TeamName: '',
                Month: '',
                TeamManager: '',
                TeamAdvisor: '',
                FTE: '',
                Vendor: '',
            },
            teamForm: {
                TeamName: 'AppService',
                Month: '2019/8',
                TeamManager:'',
                TeamAdvisor:'',
                FTE:'',
                Vendor:'',
                MemberName: '',
            },
            shiftForm: {
                TeamName: '',
                Month: '',
                TeamManager: '',
                TeamAdvisor: '',
                FTE: '',
                Vendor: '',
            },
            formLabelWidth: '100px',
            people: 
                    [{
                        principle:"None",
                        role:"default",
                        alias:"default",
                        name:"default"
                    }],
        }
    },
    asyncComputed: {
        month: {
        async get() {
            try {
            const res = await this.$http.get(`/api/${this.teamForm.TeamName}/${this.teamForm.Month}`);
            this.socket = io({
                query: {
                path: this.teamForm.Month,
                },
            });
            this.socket.on('update', (data) => {
                if (data.randomNumber === this.$randomNumber) return;
                this.month.people = data.people;
            });
            res.data.people = res.data.people.sort((x, y) => x.name.localeCompare(y.name));
            this.teamForm.MemberName = ""
            res.data.people.forEach(person=> {
                if(person.principle == 'TM') { this.teamForm.TeamManager += person.name + ';'}
                else if(person.principle == 'TA') { this.teamForm.TeamAdvisor += person.name + ';'}
                else if(person.role == 'FTE') { this.teamForm.FTE += person.name + ';'}
                else if(person.role == 'Vendor') { this.teamForm.Vendor += person.name + ';'}
            })
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
    methods: {
        cleanInitForm: function () {
            this.initForm.TeamName = ""
            this.initForm.Month = ""
            this.initForm.TeamManager = ""
            this.initForm.TeamAdvisor = ""
            this.initForm.FTE = ""
            this.initForm.Vendor = ""
        },
        addPersonView(role, principle) {
            this.inputRole = false
            if(principle == 'TA') { this.inputRole = true }
            this.addForm.role = role
            this.addForm.principle = principle
            this.addFormVisible = true
        },
        delPersonView: function() {
            this.delFormVisible = true
        },
        showTeamView: function () {
            this.teamView = true
            this.shiftView = false
            this.initView = false
            this.reportView = false
        },
        showShiftView: function () {
            this.teamView = false
            this.shiftView = true
            this.initView = false
            this.reportView = false
        },
        showInitView: function () {
            this.teamView = false
            this.shiftView = false
            this.initView = true
            this.reportView = false
        },
        showReportView: function () {
            this.teamView = false
            this.shiftView = false
            this.initView = false
            this.reportView = true
        },
        inputFormatCheck: function () {
            var MontArr = (this.initForm.Month).split("/");
            if(MontArr.length != 2 || MontArr[1] < 1 || MontArr[1] > 12) {
                return -1;
            }
            // if the last letter is not ';' then insert ';'
            if((this.initForm.Vendor)[(this.initForm.Vendor).length - 1] != ';') {
                this.initForm.Vendor = this.initForm.Vendor + ";"
            }
            if((this.initForm.FTE)[(this.initForm.FTE).length - 1] != ';') {
                this.initForm.FTE = this.initForm.FTE + ";"
            }
        },
        initiateCalendar: function () {
            if(this.inputFormatCheck() == -1) {
                this.addFeedback('notify', 'Month is invalid. example: 2019/8')
                return;
            }
            var peopleArr = (this.initForm.Vendor + this.initForm.FTE).split(";");
            for(var cnt = 1; cnt<peopleArr.length-1; cnt++) {
                this.people[cnt] = Object.assign({}, this.people[0])
            }
            var vendorArr = (this.initForm.Vendor).split(";");
            for(var cnt = 0; cnt<vendorArr.length-1; cnt++) {
                this.people[cnt].alias = peopleArr[cnt].split("-")[1]
                this.people[cnt].name = peopleArr[cnt].split("-")[0]
                this.people[cnt].role = "Vendor"
            }
            var fteArr = (this.initForm.FTE).split(";");
            for(var cnt = vendorArr.length-1; cnt<peopleArr.length-1; cnt++) {
                this.people[cnt].alias = peopleArr[cnt].split("-")[1]
                this.people[cnt].name = peopleArr[cnt].split("-")[0]
                this.people[cnt].role = "FTE"
            }
            var teamManager = (this.initForm.TeamManager).split(";");
            var teamAdvisor = (this.initForm.TeamAdvisor).split(";");
            this.people.forEach(person => {
                teamManager.forEach(tm => {
                    if(person.alias == tm){person.principle = "TM";}
                })
                teamAdvisor.forEach(ta => {
                    if(person.alias == ta){person.principle = "TA";}
                })
            });
            new Promise((resolve, reject)=>{
                this.$http.post(this.apiPath, this.apiPayload)
                .then((response)=> {
                    if(response.data == "success") {
                    this. addFeedback('success', 'Team Added to Calendar')}
                    console.log(response)
                })
                .catch((error)=>{
                    this.addFeedback('error', 'System Error. Please turn to the developer.');
                    console.log(error)
                })
            })
        },
        addPerson() {
            if(this.addForm.name == "" || this.addForm.alias == "") {
            this.addFeedback('notify', 'Please fill the blanks.')
            return;
            }
            // name
            if(this.addForm.name.toString() === ' ') {
                this.addFeedback('notify', 'Name invalid. eg. Danielle Zhao')
                return;
            }
            var nameArr = this.addForm.name.toString().toLowerCase().trim().split(" ");
            if(nameArr.length > 1) { 
                // apply name to default format: First Name + Last Name and Capital the first letter
                nameArr[0] = (nameArr[0].toString())[0].toUpperCase() + (nameArr[0].toString()).substr(1);
                nameArr[nameArr.length - 1] = nameArr[nameArr.length - 1][0].toUpperCase() + nameArr[nameArr.length - 1].substr(1);
                this.addForm.name = nameArr[0] + " " + nameArr[nameArr.length - 1];
            }else {
                this.addFeedback('notify', 'Name invalid. eg. Danielle Zhao')
                return;
            }
            // role
            if(this.addForm.role == "FTE" || this.addForm.role == "fte"|| this.addForm.role == "Fte" || this.addForm.role == "FTe"){
            this.addForm.role = "FTE";
            }else if(this.addForm.role == "Vendor" || this.addForm.role == "vendor" || this.addForm.role == "v") {
            this.addForm.role = "Vendor"
            }else {
            this.addFeedback('notify', 'Role invalid. eg. FTE or Vendor')
            return;
            }
            // alias
            if(this.addForm.alias.toString() === ' ') {
            this.addFeedback('notify', 'alias invalid. eg. danzha')
            return;
            } else {
                this.addForm.alias = this.addForm.alias.trim()
            }
            if(this.addForm.role == "Vendor") {
                if(this.addForm.alias.toString().match('v-') != 'v-') {
                    this.addFeedback('notify', 'vendor alias with no \'v-\' is invalid.')
                    return;
                }
            }
            if(this.addForm.alias[0] == "(" && this.addForm.alias[(this.addForm.alias).length-1] == ")") {
                ;
            }else {
                this.addForm.alias = "(" + this.addForm.alias + ")";
            }
            if(store.get('user').admin) {
                new Promise((resolve, reject) => {
                    this.$http.post(this.apiPath, this.apiPayload)
                    .then((response)=> {
                        if(response.data == "success") { this. addFeedback('success', 'Person Added to Team') }
                        else{ this.addFeedback('notify', 'This employee is already in the system.');}
                    })
                    .catch((error) => {
                    this.addFeedback('error', 'System Error.' + error + 'Please report to the developer team.');
                    })
                }) 
            }
        },
        addFeedback(type, msg) {
            const h = this.$createElement;
            if(type == 'error') {
            this.$notify.error({
                title:'Request Denied',
                message: msg,
                position:'top-left',
                duration: 0
            });
            }
            if(type == 'notify') {
            this.$notify({
                title:'Notification',
                message: msg,
                position:'top-left',
                duration: 0,
                type:'warning'
            });
            }
            if(type == 'success') {
            this.$notify({
                title: 'Success',
                message: h('i', { style: 'color: teal'}, msg),
                position:'top-left',
                type: 'success',
                duration: 0
            });
            }
        },
    },
    computed:{
        goCalendar() {
        return ('/');
        },
        apiPath() {
            return (
                "/api/" +
                this.initForm.TeamName +
                '/newupload2/' +
                this.initForm.Month
            );
        },
        apiPayload() {
            return {
                people: this.people,
            };
        },
        
    }
}
</script>

<style>
.el-input.is-disabled .el-input__inner {
    border-color: #373737;
}
 .el-main {
     min-height: 1200px;
 }
 .el-container .el-header {
     background-color: rgb(37, 37, 37);
     text-align: left;
     margin-left: 40px;
     font-size: xx-large;
 }
 .el-container .el-aside {
     border-radius: 7px;
     background-color: #373737;
 }
 .el-container .el-container {
     height: 1000px;
 }
 .el-row {
    margin-bottom: 20px;
  }
  .el-col {

    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content-small {
    height: 100px;
    border-radius: 4px;
  }
  .grid-content {
    height: 170px;
    border-radius: 4px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .el-input .el-textarea__inner {
      border: 10px solid #d3dce6;
      border-radius: 4px;
  }
  .subtitle {
      border: 20px solid #d3dce6;
      border-radius: 4px;
      color: #4E5166;
      font-size:medium;
      text-align: left;
  }
  .member-list {
      color: #4E5166;
      font-size:smaller;
  }
  .grid-content .el-button {
      margin: 20px;
      width: 135px;
  }
  .subtitle-left {
      margin-top: 10px;
      border-radius: 4px;
      color: #4E5166;
      font-size:medium;
      display: inline-block;
      width: 50%;
      text-align: left;
  }
  .subtitle-right {
      margin-top: 10px;
      border-radius: 4px;
      color: #4E5166;
      font-size:medium;
      display: inline-block;
      width: 45%;
      text-align: left;
  }
  .input-inline{
      margin: 20px;
      display: inline-block;
      width: 40%;
      text-align: left;
  }
  .el-input.is-disabled .el-input__inner{
      background-color: #373737;
      width: 70%;
      float: left;
  }
  .el-input__inner{
      color: #fff;
      background-color: #373737;
      width: 70%;
      float: left;
      border-top-color: rgb(51, 57, 71);
      border-right-color: rgb(51, 57, 71);
      border-bottom-color: rgb(51, 57, 71);
      border-left-color: rgb(51, 57, 71);
  }
  .el-submenu__title{
      background-color: #dcdfe6;   
  }
  .functionalButton {
      display: inline-block;
  }
  .el-form-item .el-input {
      width: 80%;
  }
  .el-form-item__content {
      display:flex;
  }
  .searchButton {
      margin-bottom: 120px;
      margin-left:140px;
  }
  .navigationBar {
      display: inline-flexbox;
      margin-bottom: 20px;
  }
  .navigationButton {
      height: 46px;
      float: right;
      background-color:#373737;
      border-color: gray;
  }
  .navigationLink {
      font-size: 15px;
      color:gray;
  }
  header span {
      padding-top: 0px; 
  }
</style>
<template> 
    <el-container>
        <div class="navigationBar">
        <el-button type="primary" v-show="true" >
              <a :href="goCalendar" class="navigationLink">Calendar</a>
        </el-button>
        </div>
    <el-header class="navigationBar">EyesonCalendar Administration</el-header>
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
            <el-dialog title="Shift Arrangement" :visible.sync="sftFormVisible">
                <el-form :model="sftForm">
                    <el-form-item label="Alias" :label-width="formLabelWidth">
                    <el-input v-model="sftForm.alias" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="sftFormVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="sftPerson();sftFormVisible = false">Confirm</el-button>
                </div>
            </el-dialog>
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
                <el-form :model="delForm">
                    <el-form-item label="Alias" :label-width="formLabelWidth">
                    <el-input v-model="delForm.alias" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="delFormVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="delPerson();delFormVisible = false">Confirm</el-button>
                </div>
            </el-dialog>
            <el-form v-if="initView"   :model="initForm" label-width="140px">
                <el-form-item label="Month">
                    <el-date-picker
                    v-model="globalMonth"
                    format="yyyy/M" value-format="yyyy/M"
                    type="month"
                    placeholder="Pick a month">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="Team Name">
                    <el-input v-model="initForm.TeamName" placeholder="example: AppService"></el-input>
                </el-form-item>
                <!-- <el-form-item label="Month">
                    <el-input v-model="initForm.Month" placeholder="example: 2019/8"></el-input>
                </el-form-item> -->
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
            <el-form v-if="shiftView"  :model="teamForm" label-width="140px">
                <el-form-item label="Month">
                    <el-date-picker
                    v-model="globalMonth"
                    type="month"
                    format="yyyy/M" value-format="yyyy/M"
                    placeholder="Pick a month">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="Team Name">
                    <el-input v-model="teamForm.TeamName" :disabled="true"></el-input>
                </el-form-item>
                <!-- <el-form-item label="Month">
                    <el-input v-model="teamForm.Month" ></el-input>
                </el-form-item> -->
                <el-form-item label="Morning Shift">
                    <el-input v-model="teamForm.MorningShift" :disabled="true"></el-input>
                    <div class="functionalButton">
                    <el-button type="primary" icon="el-icon-plus" v-on:click="sftPersonView('MS')" circle></el-button>
                    <el-button type="primary" icon="el-icon-minus" v-on:click="sftPersonView('W')" circle></el-button>
                    </div>
                </el-form-item>
                <el-form-item label="Night Shift">
                    <el-input v-model="teamForm.NightShift" :disabled="true"></el-input>
                    <div class="functionalButton">
                    <el-button type="primary" icon="el-icon-plus" v-on:click="sftPersonView('NS')" circle></el-button>
                    <el-button type="primary" icon="el-icon-minus" v-on:click="sftPersonView('W')" circle></el-button>
                    </div>
                </el-form-item>
            </el-form>
            <el-form v-if="teamView"   :model="teamForm" label-width="140px">
                <el-form-item label="Month">
                    <el-date-picker
                    v-model="globalMonth"
                    type="month"
                    format="yyyy/M" value-format="yyyy/M"
                    placeholder="Pick a month">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="Team Name">
                    <el-input v-model="teamForm.TeamName" :disabled="true"></el-input>
                </el-form-item>
                <!-- <el-form-item label="Month">
                    <el-input v-model="teamForm.Month" ></el-input>
                </el-form-item> -->
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
                <el-form-item label="Month">
                    <el-date-picker
                    v-model="globalMonth"
                    type="month"
                    format="yyyy/M" value-format="yyyy/M"
                    placeholder="Pick a month">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="Team Name">
                    <el-input v-model="teamForm.TeamName" :disabled="true"></el-input>
                </el-form-item>
                <!-- <el-form-item label="Month">
                    <el-input v-model="teamForm.Month" ></el-input>
                </el-form-item> -->
                <!-- <el-form-item label="Others">
                    <el-input v-model="form.name"></el-input>
                </el-form-item> -->
                <div>
                    <h2 v-if="!month">{{message}}</h2>
                    <div v-if="month">
                        <div id="tablehead" v-bind:class="{sticky: scrolled}" class="row tablehead">
                            <div class="name"> </div>
                            <div class="reportCell">Work-Day</div>
                            <div class="reportCell">Morning-Shift</div>
                            <div class="reportCell">Night-Shift</div>
                            <div class="reportCell">Training</div>
                            <div class="reportCell">Vacation</div>
                            <div class="reportCell">Public-Holiday</div>
                            <div class="reportCell">Holiday OnDuty</div>
                        </div>
                        <Personsum v-for="(p,index) in month.people" v-bind:key="p._id" v-bind:pindex="index" v-bind:person="p"/>
                    </div>
                </div>
            </el-form>
        </el-main>
    </el-container>
    </el-container>
</template>

<script>
var store = require('store')
import Personsum from "@/components/PersonRowSum"
export default {
    components: { Personsum },
    data: function () {
        return {
            globalMonth: new Date().getFullYear() + '/' + (new Date().getMonth() + 1),
            teamView: true,
            shiftView: false,
            reportView: false,
            initView: false,
            addFormVisible:false,
            inputRole:false,
            delFormVisible:false,
            sftFormVisible:false,
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
            sftForm: {
                alias: '',
                workType: '',
            },
            initForm: {
                TeamName: '',
                Month: null,
                TeamManager: '',
                TeamAdvisor: '',
                FTE: '',
                Vendor: '',
            },
            teamForm: {
                TeamName: store.get('user').team,
                Month: null,
                TeamManager:'',
                TeamAdvisor:'',
                FTE:'',
                Vendor:'',
                MorningShift: '',
                NightShift: '',
            },
            people: 
                    [{
                        principle:"None",
                        role:"default",
                        alias:"default",
                        name:"default"
                    }],
            formLabelWidth: '100px',
            scrolled: false,
            changed: false,
        }
    },
    asyncComputed: {
        month: {
        async get() {
            this.teamForm.Month = this.globalMonth
            this.initForm.Month = this.globalMonth
            try {
            const res = await this.$http.get(`/api/${this.teamForm.TeamName}/${this.teamForm.Month}`);
            this.socket = io({
                query: {
                path: this.teamForm.Month,
                },
            });
            this.socket.on("update", data => {
                if (data.randomNumber == this.$randomNumber) return;
                this.month.people[data.indexes.p].days[data.indexes.d].workDay =
                data.workDay;
                this.month.people[data.indexes.p].days[data.indexes.d].workType =
                data.workType;
            });
            res.data.people = res.data.people.sort((x, y) => x.name.localeCompare(y.name));
            this.cleanTeamForm()
            res.data.people.forEach(person=> {
                if(person.principle == 'TM') { this.teamForm.TeamManager += person.name + ';'}
                else if(person.principle == 'TA') { this.teamForm.TeamAdvisor += person.name + ';'}
                
                if(person.role == 'FTE') { this.teamForm.FTE += person.name + ';'}
                else if(person.role == 'Vendor') { this.teamForm.Vendor += person.name + ';'}
                var cntM = 0, cntN = 0, cntW = 0 
                person.days.forEach(day => {
                    if(day.workType === 'W') {cntW += 1}
                    else if(day.workType === 'MS') {cntM += 1}
                    else if(day.workType === 'NS') {cntN += 1}
                })
                if(cntM > cntW && cntM > cntN) {this.teamForm.MorningShift += person.name + ';'}
                if(cntN > cntW && cntN > cntM) {this.teamForm.NightShift += person.name + ';'}
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
        cleanTeamForm: function () {
            this.teamForm.TeamManager = ""
            this.teamForm.TeamAdvisor = ""
            this.teamForm.FTE = ""
            this.teamForm.Vendor = ""
            this.teamForm.MorningShift = ""
            this.teamForm.NightShift = ""
        },
        cleanAddForm: function () {
            this.addForm.name = ""
            this.addForm.alias = ""
        },
        cleanDelForm: function () {
            this.delForm.alias = ""
        },
        cleanSftForm: function () {
            this.sftForm.alias = ""
        },
        addPersonView(role, principle) {
            this.cleanAddForm()
            this.inputRole = false
            if(principle == 'TA') { this.inputRole = true }
            this.addForm.role = role
            this.addForm.principle = principle
            this.addFormVisible = true
        },
        delPersonView: function() {
            this.cleanDelForm()
            this.delFormVisible = true
        },
        sftPersonView(workType) {
            this.cleanSftForm()
            this.sftForm.workType = workType
            this.sftFormVisible = true
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
        initFormatCheck: function () {
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
            if(this.initFormatCheck() == -1) {
                this.addFeedback('notify', 'Month is invalid. example: 2019/8')
                return;
            }
            var peopleArr = (this.initForm.Vendor + this.initForm.FTE).split(";");
            for(var cnt = 1; cnt<peopleArr.length-1; cnt++) {
                this.people[cnt] = Object.assign({}, this.people[0])
            }
            var vendorArr = (this.initForm.Vendor).split(";");
            for(var cnt = 0; cnt<vendorArr.length-1; cnt++) {
                this.people[cnt].alias = '(' + peopleArr[cnt].split("(")[1]
                if(this.people[cnt].alias.match('v-') != 'v-') { this.addFeedback('notify', 'vendor alias with no \'v-\' is invalid.'); return }
                this.people[cnt].name = peopleArr[cnt].split("(")[0]
                this.people[cnt].role = "Vendor"
            }
            var fteArr = (this.initForm.FTE).split(";");
            for(var cnt = vendorArr.length-1; cnt<peopleArr.length-1; cnt++) {
                this.people[cnt].alias = '(' + peopleArr[cnt].split("(")[1]
                this.people[cnt].name = peopleArr[cnt].split("(")[0]
                this.people[cnt].role = "FTE"
            }
            var teamManager = (this.initForm.TeamManager).split(";");
            var teamAdvisor = (this.initForm.TeamAdvisor).split(";");
            this.people.forEach(person => {
                teamManager.forEach(tm => {
                    console.log(tm)
                    if(person.alias == '(' + tm + ')'){person.principle = "TM";}
                })
                teamAdvisor.forEach(ta => {
                    console.log(ta)
                    if(person.alias == '(' + ta + ')'){person.principle = "TA";}
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
                // console.log('admin')
                new Promise((resolve, reject) => {
                    this.$http.post(this.apiPathAddPerson, this.apiPayloadAddPerson)
                    .then((response)=> {
                        if(response.data == "success") { 
                            // the below lines is a stupid way to sync the display memeber which should be replaced by stocket.io later QwQ
                            this.teamForm.Month = this.teamForm.Month.split('/')[0] + '/' + (this.teamForm.Month.split('/')[1]-1).toString()
                            this.teamForm.Month = this.teamForm.Month.split('/')[0] + '/' + (this.teamForm.Month.split('/')[1]-(-1)).toString()                            
                            this. addFeedback('success', 'Person Added to Team') }
                        else{
                            console.log(response)
                            this.addFeedback('notify', 'This employee is already in the system.');   
                        }
                    })
                    .catch((error) => {
                    this.addFeedback('error', 'System Error.' + error + 'Please report to the developer team.');
                    })
                }) 
            }
        },
        delPerson() {
            if(this.delForm.alias[0] == "(" && this.delForm.alias[(this.delForm.alias).length-1] == ")") {
                ;
            }else {
                this.delForm.alias = "(" + this.delForm.alias + ")";
            }
            return new Promise((resolve, reject) => {
                this.$http.post(this.apiPathDelPerson, this.apiPayloadDelPerson)
                .then((response)=> {
                if(response.data == "success")  {
                    // the below lines is a stupid way to sync the display memeber which should be replaced by stocket.io later QwQ
                    this.teamForm.Month = this.teamForm.Month.split('/')[0] + '/' + (this.teamForm.Month.split('/')[1]-1).toString()
                    this.teamForm.Month = this.teamForm.Month.split('/')[0] + '/' + (this.teamForm.Month.split('/')[1]-(-1)).toString()                           
                    this.addFeedback('success', 'Person Deleted from Team')}
                else{this.addFeedback('notify', 'Person Not Exist');
                console.log(response)}
                })
                .catch((error)=> {
                this.addFeedback('error', 'System Error')
                })
            })
        },
        sftPerson() {
            if(this.sftForm.alias[0] === '(') {
                var strSft = this.sftForm.alias.substring(1)
                this.sftForm.alias = strSft
            }
            if(this.sftForm.alias[this.sftForm.alias.length - 1] === ')') {
                var strSft = this.sftForm.alias.substring(0,this.sftForm.alias.length - 1)
                this.sftForm.alias = strSft
            }
            this.sftForm.alias = '(' + this.sftForm.alias + ')'
            console.log(this.apiPathSftPerson)
            return new Promise((resolve, reject) => {
                this.$http.post(this.apiPathSftPerson, this.apiPayloadSftPerson)
                .then((response) => {
                    console.log("shift success")
                    // the below lines is a stupid way to sync the display memeber which should be replaced by stocket.io later QwQ
                    this.teamForm.Month = this.teamForm.Month.split('/')[0] + '/' + (this.teamForm.Month.split('/')[1]-1).toString()
                    this.teamForm.Month = this.teamForm.Month.split('/')[0] + '/' + (this.teamForm.Month.split('/')[1]-(-1)).toString()
                    // if(this.sftForm.workType == "MS") {console.log('1')}// {this.teamForm.MorningShift += this.sftForm.alias + ";"}
                    // else if(this.sftForm.workType == "NS") {console.log('2')}// {this.teamForm.NightShift += this.sftForm.alias + ";"}
                    // else if(this.sftForm.workType == "W") {console.log('3')}
                })
                .catch((error)=> {
                this.addFeedback('error', 'System Error')
                })
            })
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
            return (
                '/' + 
                this.teamForm.TeamName +
                '/' +
                this.globalMonth
            );
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
        apiPathAddPerson() {
            return (
                '/api/' +
                this.teamForm.TeamName +
                '/' +
                this.teamForm.Month + 
                '/person'
            );
        },
        apiPayloadAddPerson() {
            return {
                name: this.addForm.name,
                role:this.addForm.role,
                principle:this.addForm.principle,
                alias:this.addForm.alias,
                randomNumber: this.$randomNumber
            };
        },
        apiPathDelPerson() {
            return (
                '/api/' +
                this.teamForm.TeamName +
                '/' +
                this.teamForm.Month + 
                '/delete'
            );
        },
        apiPayloadDelPerson() {
            return {
                alias: this.delForm.alias,
            };
        },
        apiPathSftPerson() {
            return (
                '/api/' +
                this.teamForm.TeamName +
                '/' +
                this.teamForm.Month + 
                '/batch/' +
                this.sftForm.alias +
                '/' + 
                this.sftForm.workType
            );
        },
        apiPayloadSftPerson() {
            return {};
        },
        
    }
}
</script>

<style>
    .el-input.is-disabled .el-input__inner {
        border-color: #373737;
    }
    .el-container .el-main {
        min-height: 1200px;
    }
    .el-container .el-header {
        background-color: rgb(37, 37, 37);
        text-align: left;
        margin-left: 40px;
        font-size: xx-large;
    }
    .el-container .el-aside {
        border-radius: 5px;
        background-color: #373737;
    }
    .el-container .el-container {
        height: 1000px;
    }
    .el-input .el-textarea__inner {
        border: 10px solid gray;
        border-radius: 4px;
    }
    .el-form-item .el-input.is-disabled .el-input__inner{
        background-color: #373737;
        width: 70%;
        float: left;
    }
    .el-form-item .el-input__inner{
        color: #fff;
        background-color: #373737;
        width: 70%;
        float: left;
        border-top-color: rgb(51, 57, 71);
        border-right-color: rgb(51, 57, 71);
        border-bottom-color: rgb(51, 57, 71);
        border-left-color: rgb(51, 57, 71);
    }
    .el-submenu .el-submenu__title, .el-submenu .el-submenu__title:hover{
        background-color: #373737;
        color:#fff;   
    }
    .el-aside .el-menu {
        border-right: solid 0px #373737;
        background-color: #373737;
    }
    .el-submenu .el-menu-item {
        color: #fff;
    }
    .el-submenu .el-menu-item:focus, .el-submenu .el-menu-item:hover {
        color: #fff;
        outline: 0;
        background-color: #262626;
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
    .navigationBar {
        display: inline-flexbox;
        margin-bottom: 20px;
    }
    .navigationBar .el-button {
        float: right;
        background-color:#373737;
        border-color: gray;
        margin-right: 20px;
    }
    .el-button a:-webkit-any-link {
        text-decoration: none;
    }
    .navigationLink {
        font-size: 15px;
        color:gray;
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

    .sectionPointer:hover {
    background-color: #555;
    }

    .pointer:hover {
    background-color: #555;
    }
    /* .marginLeft {
    margin-left: 30px
    } */

    .reportCell {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    vertical-align: middle;
    width: 120px;
    margin: 10px;
    }
</style>
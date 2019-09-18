<template> 
    <el-container v-show="admin">
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
                    <el-menu-item index="2-3" v-on:click="showInitView">Initiate Team Calendar</el-menu-item>
                    <el-menu-item index="2-1" v-on:click="showTeamView">Team Calendar Management</el-menu-item>
                    <el-menu-item index="2-2" v-on:click="showShiftView">Team Shift Management</el-menu-item>
                    <el-menu-item index="2-4" v-on:click="showReportView">Team Shift Report</el-menu-item>
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
            <el-dialog title="Add Team Manager" :visible.sync="addFormVisible1">
                <el-form :model="addForm">
                    <el-form-item label="Alias" :label-width="formLabelWidth">
                    <el-input v-model="addForm.alias" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="Name" :label-width="formLabelWidth" v-if="!addTMTA">
                    <el-input v-model="addForm.name" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addFormVisible = false;addFormVisible1 = false;addFormVisible2 = false;addTMTA = false">Cancel</el-button>
                    <el-button type="primary" @click="addPerson();addFormVisible = false;addFormVisible1 = false;addFormVisible2 = false;">Confirm</el-button>
                </div>
            </el-dialog>
            <el-dialog title="Add Team Advisor" :visible.sync="addFormVisible2">
                <el-form :model="addForm">
                    <el-form-item label="Alias" :label-width="formLabelWidth">
                    <el-input v-model="addForm.alias" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="Name" :label-width="formLabelWidth" v-if="!addTMTA">
                    <el-input v-model="addForm.name" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addFormVisible = false;addFormVisible1 = false;addFormVisible2 = false;addTMTA = false">Cancel</el-button>
                    <el-button type="primary" @click="addPerson();addFormVisible = false;addFormVisible1 = false;addFormVisible2 = false;">Confirm</el-button>
                </div>
            </el-dialog>
            <el-dialog title="Add FTE/Vendor Member" :visible.sync="addFormVisible">
                <el-form :model="addForm">
                    <el-form-item label="Alias" :label-width="formLabelWidth">
                    <el-input v-model="addForm.alias" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="Name" :label-width="formLabelWidth" v-if="!addTMTA">
                    <el-input v-model="addForm.name" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addFormVisible = false;addFormVisible1 = false;addFormVisible2 = false;addTMTA = false">Cancel</el-button>
                    <el-button type="primary" @click="addPerson();addFormVisible = false;addFormVisible1 = false;addFormVisible2 = false;">Confirm</el-button>
                </div>
            </el-dialog>
            <el-dialog title="Delete Team Manager" :visible.sync="delFormVisible1">
                <el-form :model="delForm">
                    <el-form-item label="Alias" :label-width="formLabelWidth">
                    <el-input v-model="delForm.alias" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="delFormVisible = false;delFormVisible1 = false;delFormVisible2 = false;">Cancel</el-button>
                    <el-button type="primary" @click="delPerson();delFormVisible = false;delFormVisible1 = false;delFormVisible2 = false;">Confirm</el-button>
                </div>
            </el-dialog>
            <el-dialog title="Delete Team Advisor" :visible.sync="delFormVisible2">
                <el-form :model="delForm">
                    <el-form-item label="Alias" :label-width="formLabelWidth">
                    <el-input v-model="delForm.alias" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="delFormVisible = false;delFormVisible1 = false;delFormVisible2 = false;">Cancel</el-button>
                    <el-button type="primary" @click="delPerson();delFormVisible = false;delFormVisible1 = false;delFormVisible2 = false;">Confirm</el-button>
                </div>
            </el-dialog>
            <el-dialog title="Delete FTE/Vendor Member" :visible.sync="delFormVisible">
                <el-form :model="delForm">
                    <el-form-item label="Alias" :label-width="formLabelWidth">
                    <el-input v-model="delForm.alias" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="delFormVisible = false;delFormVisible1 = false;delFormVisible2 = false;">Cancel</el-button>
                    <el-button type="primary" @click="delPerson();delFormVisible = false;delFormVisible1 = false;delFormVisible2 = false;">Confirm</el-button>
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
                    <el-input v-model="initForm.TeamName" placeholder="Team name should not include number, '/' , '\' or SPACE"></el-input>
                </el-form-item>
                <!-- <el-form-item label="Team Manager">
                    <el-input v-model="initForm.TeamManager" placeholder="example: karenzhe"></el-input>
                </el-form-item>
                <el-form-item label="Technic Advisor">
                    <el-input v-model="initForm.TeamAdvisor" placeholder="example: danzha;anikshen;"></el-input> 
                </el-form-item> -->
                <el-form-item label="FTE">
                    <el-input v-model="initForm.FTE" placeholder="eg. User Zero(ftealias00);User One(ftealias01);"></el-input>
                </el-form-item>
                <el-form-item label="Vendor">
                    <el-input v-model="initForm.Vendor" placeholder="eg. Vendor User2(v-vendoralias);"></el-input>
                </el-form-item>
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
                    <el-autocomplete class="autoFill"
                        v-model="teamForm.TeamName"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="POD NAME HERE"
                        @select="handleSelect"
                    >
                    </el-autocomplete>
                    <!-- <el-input v-model="teamForm.TeamName" :disabled="!su"></el-input> -->
                </el-form-item>
                <!-- <el-form-item label="Month">
                    <el-input v-model="teamForm.Month" ></el-input>
                </el-form-item> -->
                <el-form-item label="Morning Shift">
                    <el-input v-model="teamForm.MorningShift" :disabled="!su"></el-input>
                    <div class="functionalButton">
                    <el-button type="primary" icon="el-icon-plus" v-on:click="sftPersonView('MS')" circle></el-button>
                    <el-button type="primary" icon="el-icon-minus" v-on:click="sftPersonView('W')" circle></el-button>
                    </div>
                </el-form-item>
                <el-form-item label="Night Shift">
                    <el-input v-model="teamForm.NightShift" :disabled="!su"></el-input>
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
                    <el-autocomplete class="autoFill"
                        v-model="teamForm.TeamName"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="POD NAME HERE"
                        @select="handleSelect"
                    >
                    </el-autocomplete>
                    <!-- <el-input v-model="teamForm.TeamName" :disabled="!su"></el-input> -->
                </el-form-item>
                <!-- <el-form-item label="Month">
                    <el-input v-model="teamForm.Month" ></el-input>
                </el-form-item> -->
                <el-form-item label="Team Manager">
                    <el-input v-model="teamForm.TeamManager" :disabled="!su"></el-input>
                    <div class="functionalButton">
                    <el-button type="primary" icon="el-icon-plus" circle v-on:click="addTMTA=true;addPersonView('FTE', 'TM', 0)"></el-button>
                    <el-button type="primary" icon="el-icon-minus" circle v-on:click="delPersonView('TM',0)"></el-button>
                    </div>
                </el-form-item>
                <el-form-item label="Technical Advisor">
                    <el-input v-model="teamForm.TeamAdvisor" :disabled="!su"></el-input>
                    <div class="functionalButton">
                    <el-button type="primary" icon="el-icon-plus" circle v-on:click="addTMTA=true;addPersonView('', 'TA', 1)"></el-button>
                    <el-button type="primary" icon="el-icon-minus" circle v-on:click="delPersonView('TA', 1)"></el-button>
                    </div>
                </el-form-item>
                <el-form-item label="FTE Member">
                    <el-input v-model="teamForm.FTE" :disabled="!su"></el-input>
                    <div class="functionalButton">
                    <el-button type="primary" icon="el-icon-plus" circle v-on:click="addPersonView('FTE', 'None',2)"></el-button>
                    <el-button type="primary" icon="el-icon-minus" circle v-on:click="delPersonView('None',2)"></el-button>
                    </div>
                </el-form-item>
                <el-form-item label="Vendor member">
                    <el-input v-model="teamForm.Vendor" :disabled="!su"></el-input>
                    <div class="functionalButton">
                    <el-button type="primary" icon="el-icon-plus" circle v-on:click="addPersonView('Vendor', 'None',2)"></el-button>
                    <el-button type="primary" icon="el-icon-minus" circle v-on:click="delPersonView('None',2)"></el-button>
                    </div>
                </el-form-item>
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
                    <el-autocomplete class="autoFill"
                        v-model="teamForm.TeamName"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="POD NAME HERE"
                        @select="handleSelect"
                    >
                    </el-autocomplete>
                    <!-- <el-input v-model="teamForm.TeamName" :disabled="!su"></el-input> -->
                </el-form-item>
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
            links: [],
            addTMTA: false,
            su: false,
            globalMonth: new Date().getFullYear() + '/' + (new Date().getMonth() + 1),
            teamView: true,
            shiftView: false,
            reportView: false,
            initView: false,
            addFormVisible1:false,
            addFormVisible2:false,
            addFormVisible:false,
            inputRole:false,
            delFormVisible1:false,
            delFormVisible2:false,
            delFormVisible:false,
            sftFormVisible:false,
            addForm: {
                alias: '',
                name: '',
                role: '',
                principle: ''
            },
            delForm: {
                alias: '',
                principle: ''
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
                MorningShift: '',
                NightShift: '',
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
                let globalform = this.teamForm
                var year = this.globalMonth.split('/')[0]
                var month = (this.globalMonth.split('/')[1] - 1)
                if(month === 0) {
                    year = year - 1
                    month = 12
                }
                this.initForm.Month = year +'/'+ month
                if(this.initView === true) {
                    globalform = this.initForm
                    console.log('test')
                }
                try {
                let res = await this.$http.get(`/api/${globalform.TeamName}/${globalform.Month}`);
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
                this.cleanInitForm()
                res.data.people.forEach(person=> {
                    if(person.principle == 'TM') { globalform.TeamManager += person.name + person.alias + ';'}
                    else if(person.principle == 'TA') { globalform.TeamAdvisor += person.name + person.alias + ';'}
                    
                    if(person.role == 'FTE') { globalform.FTE += person.name + person.alias + ';'}
                    else if(person.role == 'Vendor') { globalform.Vendor += person.name + person.alias + ';'}
                    var cntM = 0, cntN = 0, cntW = 0 
                    person.days.forEach(day => {
                        if(day.workType === 'W') {cntW += 1}
                        else if(day.workType === 'MS') {cntM += 1}
                        else if(day.workType === 'NS') {cntN += 1}
                    })
                    if(cntM > cntW && cntM > cntN) {globalform.MorningShift += person.name + ';'}
                    if(cntN > cntW && cntN > cntM) {globalform.NightShift += person.name + ';'}
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
            this.delForm.principle = ""
        },
        cleanSftForm: function () {
            this.sftForm.alias = ""
        },
        addPersonView(role, principle, num) {
            this.cleanAddForm()
            this.addForm.role = role
            this.addForm.principle = principle
            if(num === 0) {
                this.addFormVisible1 = true
            } else if(num === 1) {
                this.addFormVisible2 = true
            } else if(num === 2) {
                this.addFormVisible = true
            }
        },
        delPersonView: function(principle, num) {
            this.cleanDelForm()
            this.delForm.principle = principle
            
            if(num === 0) {
                this.delFormVisible1 = true
            } else if(num === 1) {
                this.delFormVisible2 = true
            } else if(num === 2) {
                this.delFormVisible = true
            }
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
            // var MontArr = (this.initForm.Month).split("/");
            // if(MontArr.length != 2 || MontArr[1] < 1 || MontArr[1] > 12) {
            //     return -1;
            // }
            var str = this.initForm.TeamName
            var ilen
            for(ilen=0;ilen<str.length;ilen++)
            {
                if(str.charAt(ilen) > '0' && str.charAt(ilen) < '9' )
                {
                    return -1
                } 
                if(str.charAt(ilen) === '/' || str.charAt(ilen) === '\\' || str.charAt(ilen) === ' ')
                {
                    return -2
                } 
            }
            // if the last letter is not ';' then insert ';'
            if((this.initForm.Vendor).length !== 0 && (this.initForm.Vendor)[(this.initForm.Vendor).length - 1] != ';') {
                this.initForm.Vendor = this.initForm.Vendor + ";"
            }
            if((this.initForm.FTE).length !== 0 && (this.initForm.FTE)[(this.initForm.FTE).length - 1] != ';') {
                this.initForm.FTE = this.initForm.FTE + ";"
            }
        },
        initiateCalendar: function () {
            if(this.initFormatCheck() === -1) {
                this.addFeedback('notify', 'Team-Name can not include a number')
                return;
            }
            else if(this.initFormatCheck() === -2) {
                this.addFeedback('notify', 'Team-Name can not include \'/\'  or \'\\\' or SPACE')
                return;
            }
            var peopleArr = (this.initForm.Vendor + this.initForm.FTE).split(";");
            for(var cnt = 1; cnt<peopleArr.length-1; cnt++) {
                this.people[cnt] = Object.assign({}, this.people[0])
            }
            var vendorArr = (this.initForm.Vendor).split(";");
            for(var cnt = 0; cnt<vendorArr.length-1; cnt++) {
                var tempArr = peopleArr[cnt].split("(")[0].split(" ")
                if(tempArr.length <= 1) {this.addFeedback('notify', 'Employee Name invalid: '+ peopleArr[cnt].split("(")[0]); return;}
                this.people[cnt].name = peopleArr[cnt].split("(")[0]
                this.people[cnt].alias = '(' + peopleArr[cnt].split("(")[1]
                if(this.people[cnt].alias.match('v-') != 'v-') 
                { this.addFeedback('notify', 'vendor alias with no \'v-\' is invalid:' + '(' + peopleArr[cnt].split("(")[1]); return }
                this.people[cnt].role = "Vendor"
            }
            var fteArr = (this.initForm.FTE).split(";");
            for(var cnt = vendorArr.length-1; cnt<peopleArr.length-1; cnt++) {
                var tempArr = peopleArr[cnt].split("(")[0].split(" ")
                if(tempArr.length <= 1) {this.addFeedback('notify', 'Employee Name invalid: '+ peopleArr[cnt].split("(")[0]); return;}
                this.people[cnt].name = peopleArr[cnt].split("(")[0]
                if(peopleArr[cnt].split("(")[1] === undefined) {this.addFeedback('notify', 'Alias invalid: '+ peopleArr[cnt].split("(")[0]); return;}
                this.people[cnt].alias = '(' + peopleArr[cnt].split("(")[1]
                this.people[cnt].role = "FTE"
            }
            var teamManager = (this.initForm.TeamManager).split(";");
            var teamAdvisor = (this.initForm.TeamAdvisor).split(";");
            this.people.forEach(person => {
                teamManager.forEach(tm => {
                    console.log(tm)
                    if(person.alias == '(' + tm.split('(')[1]){person.principle = "TM";}
                })
                teamAdvisor.forEach(ta => {
                    console.log(ta)
                    if(person.alias == '(' + ta.split('(')[1]){person.principle = "TA";}
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
            if(this.addForm.alias == "") {
                this.addFeedback('notify', 'Please fill the alias.')
            return;
            }
            if(this.addTMTA === false && this.addForm.name == "") {
                this.addFeedback('notify', 'Please fill the name.')
            return;
            }
            var nameArr = this.addForm.name.toString().toLowerCase().trim().split(" ");
            if( nameArr.length > 1) { 
                // apply name to default format: First Name + Last Name and Capital the first letter
                nameArr[0] = (nameArr[0].toString())[0].toUpperCase() + (nameArr[0].toString()).substr(1);
                nameArr[nameArr.length - 1] = nameArr[nameArr.length - 1][0].toUpperCase() + nameArr[nameArr.length - 1].substr(1);
                this.addForm.name = nameArr[0] + " " + nameArr[nameArr.length - 1];
            }else if(this.addTMTA === false) {
                this.addFeedback('notify', 'Name length invalid. eg. Danielle Zhao')
                return;
            }
            // role
            if(this.addForm.role == "FTE" || this.addForm.role == "fte"|| this.addForm.role == "Fte" || this.addForm.role == "FTe"){
                this.addForm.role = "FTE";
            }else if(this.addForm.role == "Vendor" || this.addForm.role == "vendor" || this.addForm.role == "v") {
                this.addForm.role = "Vendor"
            }else if(this.addTMTA === false) {
                this.addFeedback('notify', "Role invalid. Please use 'FTE' or 'Vendor'")
            return;
            }
            // alias
            this.addForm.alias = this.addForm.alias.trim()
            if(this.addForm.role == "Vendor") {
                if(this.addForm.alias.toString().match('v-') != 'v-') {
                    this.addFeedback('notify', 'vendor alias with no \'v-\' is invalid.')
                    return;
                }
            }
            if(this.addForm.alias[0] == "(" && this.addForm.alias[(this.addForm.alias).length-1] == ")") {
                ;
            }else { this.addForm.alias = "(" + this.addForm.alias + ")";}

            if(this.admin) {
                new Promise((resolve, reject) => {
                    this.$http.post(this.apiPathAddPerson, this.apiPayloadAddPerson)
                    .then((response)=> {
                        if(response.data == 'Person is Added to the Team' || response.data == 'Permission is Added to the Person') { 
                            // the below lines is a stupid way to sync the display memeber which should be replaced by stocket.io later QwQ
                            this.teamForm.Month = this.teamForm.Month.split('/')[0] + '/' + (this.teamForm.Month.split('/')[1]-1).toString()
                            this.teamForm.Month = this.teamForm.Month.split('/')[0] + '/' + (this.teamForm.Month.split('/')[1]-(-1)).toString()                            
                            this. addFeedback('success', response.data) }
                        else{
                            console.log(response)
                            this.addFeedback('notify', response.data);   
                        }
                    })
                    .catch((error) => {
                    this.addFeedback('error', 'System Error.' + error + 'Please report to the developer team.');
                    })
                }) 
            }
            this.addTMTA = false
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
                if(response.data == 'Person is Removed from the Team'|| response.data == 'Permission is Removed from the Person')  {
                    // the below lines is a stupid way to sync the display memeber which should be replaced by stocket.io later QwQ
                    this.teamForm.Month = this.teamForm.Month.split('/')[0] + '/' + (this.teamForm.Month.split('/')[1]-1).toString()
                    this.teamForm.Month = this.teamForm.Month.split('/')[0] + '/' + (this.teamForm.Month.split('/')[1]-(-1)).toString()                           
                    this.addFeedback('success', response.data)}
                else{this.addFeedback('notify', response.data);
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
            // console.log(this.apiPathSftPerson)
            return new Promise((resolve, reject) => {
                this.$http.post(this.apiPathSftPerson, this.apiPayloadSftPerson)
                .then((response) => {
                    // console.log("shift success")
                    // the below lines is a stupid way to sync the display memeber which should be replaced by stocket.io later QwQ
                    this.teamForm.Month = this.teamForm.Month.split('/')[0] + '/' + (this.teamForm.Month.split('/')[1]-1).toString()
                    this.teamForm.Month = this.teamForm.Month.split('/')[0] + '/' + (this.teamForm.Month.split('/')[1]-(-1)).toString()
                    if(response.data === 'No Record') { this.addFeedback('notify', 'Person Not Exist') } else { 
                        this.addFeedback('success', 'Shift is Ready')
                    }
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
                
            });
            }
            if(type == 'notify') {
            this.$notify({
                title:'Notification',
                message: msg,
                position:'top-left',
                type:'warning'
            });
            }
            if(type == 'success') {
            this.$notify({
                title: 'Success',
                message: h('i', { style: 'color: teal'}, msg),
                position:'top-left',
                type: 'success',
                
            });
            }
        },
        loadTeamName () {
            console.log('-1')
            new Promise((resolve, reject) => {
                this.$http.get(this.getTeamApiPath)
                .then((response)=> {
                this.links = response.data;
                console.log('hhh')
                console.log(response.data)
                })
                .catch((error) => {
                    this.addFeedback('error', 'System Error. Please turn to the developer.');
                    return [];
                })
            })
        },
        querySearchAsync(queryString, cb) {
            console.log('0')
            var links = this.links;
            var results = queryString ? links.filter(this.createFilter(queryString)) : links;

            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                cb(results);
            }, 1500) //* Math.random());
        },
        createFilter(queryString) {
            console.log('1')
            return (link) => {
                return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        handleSelect(item) {
            console.log('2')
            const path = item.link
            this.teamForm.TeamName = item.value
            // this.$router.push({ path });
            // location.reload();
        },
    },
    mounted() {
        this.loadTeamName()
    },
    computed:{
        admin() {
            var path = '/'
            if(store.get('user')===undefined) {
                this.$message("Please Login.")
                this.$router.push({ path })
                setTimeout(()=>{location.reload()},2000)
            }
            this.alias = store.get('user').alias
            this.su = store.get('user').su
            return store.get('user').admin
        },
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
                this.globalMonth
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
                principle:this.delForm.principle,
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
        getTeamApiPath() {
            if(this.su === true) {
                return ('/api/default/' + new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/allTeamName')
            }
            else {return ('/api/default/' + new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/ownTeamName/'+this.alias)}
        },
        
    }
}
</script>

<style>
    .autoFill {
        display: flex;
        width: 100%;
    }
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
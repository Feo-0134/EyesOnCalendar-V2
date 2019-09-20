<template>
    <el-container>
    <el-header class="headbar">Welcome to Shift Arrangement Tool.</el-header>
    <el-container class="welcomPage">
    <el-autocomplete class="pickTeam InputButton1"
        v-if="podSelect"
        v-model="teamName"
        :fetch-suggestions="querySearchAsync"
        placeholder="SEARCH POD"
        @select="handleSelect"
    >
    </el-autocomplete>
    <h2 v-if="podSelect" class="pickTeam InputButton2" >OR</h2>
    <h2 v-if="podSelect" class="goto" >Go to</h2>
    <el-button  v-if="podSelect" class="pickTeam InputButton3">
        <a :href="goPortal" class="navigationLink ">Portal</a>
    </el-button>
    <h2 v-if="noInform">Sorry we can not find your information in the system. Please turn to your TM/TA for permission.</h2>
    </el-container>
    <div class="PersonalInfo" v-loading="loading" v-if="loading"> 
        {{accessmsg}}
    </div>
    </el-container>
</template>

<script>
var store = require('store')
import moment from 'moment'
export default {
    name: 'AccessCell',
    data() {
        return {
            teamName: '',
            podSelect: false,
            loading: true,
            displayName: '',
            title: '',
            admin: false,
            su: false,
            noInform: false,
            alias: '',
            accessmsg: '',
            msalConfig: 
                {
                    auth: {
                        clientId: "c6c7e163-aa0b-4185-b95d-0073ee49fa22", //This is your client ID
                        authority:
                        "https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47" //This is your tenant info
                    },
                    cache: {
                        cacheLocation: "localStorage",
                        storeAuthStateInCookie: true
                    }
                },
            graphConfig:
                {
                    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
                },
            requestObj: {
                    scopes: ["user.read"]
                },

        }
    },
    mounted() {
        this.acquireTokenPopupAndCallMSGraph();
    },
    computed: {
        goPortal() {
            return (`/portal`);
        },
        getTeamApiPath() {
            if(this.su === true) {return ('/api/default/' + new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/allTeamName')}
            else {return ('/api/default/' + new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/ownTeamName/'+this.alias)}
        },
    },
    methods: {
        loadTeamName () {
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
            var links = this.links;
            var results = queryString ? links.filter(this.createFilter(queryString)) : links;

            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                cb(results);
            }, 3000 * Math.random());
        },
        createFilter(queryString) {
            return (link) => {
                return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        handleSelect(item) {
            const path = item.link
            this.$router.push({ path });
            location.reload();
        },
        // AAD函数调用入口
        acquireTokenPopupAndCallMSGraph() {
            var that = this
            //Always start with acquireTokenSilent to obtain a token in the signed in user from cache
            var myMSALObj = new Msal.UserAgentApplication(this.msalConfig);
            
            //myMSALObj.handleRedirectCallback(this.authRedirectCallBack);
            
            myMSALObj.acquireTokenSilent(this.requestObj)
            .then(function (tokenResponse) {
                that.callMSGraph(that.graphConfig.graphMeEndpoint, tokenResponse.accessToken, that.graphAPICallback);
            })
            .catch(function (error) {
                console.log(error);
                // Upon acquireTokenSilent failure (due to consent or interaction or login required ONLY)
                // Call acquireTokenPopup(popup window)
                if (that.requiresInteraction(error.errorCode)) {
                    myMSALObj.acquireTokenPopup(that.requestObj).then(function (tokenResponse) {
                        that.callMSGraph(that.graphConfig.graphMeEndpoint, tokenResponse.accessToken, that.graphAPICallback);
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            });
        },
        // 获取本地 access_token
        authRedirectCallBack(error, response) {
            if (error) {
                console.log(error);
            } else {
                if (response.tokenType === "access_token") {
                    callMSGraph(this.graphConfig.graphMeEndpoint, response.accessToken, this.graphAPICallback);
                } else {
                    console.log("token type is:" + response.tokenType);
                }
            }
        },
        // 获得传回数据后向前端页面数据
        graphAPICallback(data) {
            console.log('graphAPICallback');
            let result = JSON.stringify(data, null, 4);
            let jsonresult = JSON.parse(result);
            this.title = jsonresult.jobTitle
            this.displayName = jsonresult.displayName
            this.alias = '(' + (jsonresult.userPrincipalName.split('@'))[0] + ')'
            if( jsonresult.jobTitle.match('TECHNICAL ADVISOR') == 'TECHNICAL ADVISOR'
                || jsonresult.jobTitle.match('MGR') == 'MGR'
                || jsonresult.jobTitle.match('MANAGER') == 'MANAGER'
                || jsonresult.userPrincipalName == 'Jianan.Lu@microsoft.com'
                || jsonresult.userPrincipalName == 't-junzhu@microsoft.com'
                )
            { this.admin = true; console.log('admin')}
            
            if(jsonresult.userPrincipalName == 'Jianan.Lu@microsoft.com' 
                || jsonresult.userPrincipalName == 't-junzhu@microsoft.com') {
                    this.accessmsg = result;
            }

            if(jsonresult.userPrincipalName == 'Jianan.Lu@microsoft.com' 
                || jsonresult.userPrincipalName == 't-junzhu@microsoft.com'
                || jsonresult.userPrincipalName == 'danzha@microsoft.com') {
                    this.su = true
                    this.accessmsg = result;
                // document.getElementById("json").innerHTML = result;
            } else {
                this.accessmsg = '';
                // document.getElementById("json").innerHTML = 'sorry, this portal is for managers only';
            }
            this.getTeamName()
        },

        getTeamName() {
            var apipath = '/api/getpod/' + new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + this.alias
            this.loadTeamName() 
            return new Promise((resolve, reject) => {
                this.$http.get(apipath)
                .then((response)=> {
                    console.log(response.data)
                    if(response.data == "default") {                            
                        // console.log('Your team hasn\'t joined the tool yet')
                        store.set('user', {displayName:this.displayName, alias: this.alias, admin: this.admin, su: this.su, title: this.title, team: 'default'})
                    } else {
                        store.set('user', {displayName:this.displayName, alias: this.alias, admin: this.admin, su: this.su, title: this.title, team: response.data})
                    }
                    if(response.data === 'default' && this.admin) {
                      // this.$router.push('/portal')
                      this.podSelect = true
                      this.loading = false
                    }else if(response.data === 'default') {
                      this.loading = false
                      this.noInform = true
                      this.$message('Sorry we can not find your information.');
                    } else {
                      this.$router.push(response.data + moment().format('/YYYY/M'))
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
            }) 
        },
        // 此函数是完成一个 http request
        callMSGraph(theUrl, accessToken, callback) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200)
                callback(JSON.parse(this.responseText));
            };
            xmlHttp.open("GET", theUrl, true); // true for asynchronous
            xmlHttp.setRequestHeader("Authorization", "Bearer " + accessToken);
            xmlHttp.send();
        },
        // 错误处理
        requiresInteraction(errorCode) {
            if (!errorCode || !errorCode.length) {
                return false;
            }
            return errorCode === "consent_required" ||
                errorCode === "interaction_required" ||
                errorCode === "login_required";
        },
    }
}
</script>

<style>
.PersonalInfo{
    height: 500px;
    margin: auto;
    display: inline-block;
}
.el-container .el-loading-mask {
    background-color:#262626
}
.welcomPage {
    margin-top: 300px; 
    margin-left: auto;
    margin-right: auto;
}
.pickTeam {
   display: inline;
}
.headbar {
    background-color: inherit;
    font-size: 30px;
}
.navigationLink {
    font-size: 15px;
    color:gray;
}
.InputButton1 {
    width: 200px;
    margin-right: 0px;
    float: right;
}
.InputButton2 {
    width: 200px;
    padding-left: 50px;
    margin-right: 10px;
    margin-left: 10px;
    margin-top: 10px;
}
.goto {
    margin-top: 10px;
    margin-right: 10px;
}
.InputButton3 {
    width: 200px;
    float: left;
    height: fit-content;
    background-color: #373737;
}
.el-autocomplete .el-input__inner {
    background-color: #373737;
}
</style>
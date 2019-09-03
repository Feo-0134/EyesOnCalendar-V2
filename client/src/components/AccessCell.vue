<template>
    <div class="PersonalInfo"> {{accessmsg}} </div>
</template>

<script>
var store = require('store')
export default {
    name: 'AccessCell',
    data() {
        return {
            displayName: '',
            admin: false,
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
    methods: {
        // AAD函数调用入口
        acquireTokenPopupAndCallMSGraph() {
            var that = this
            //Always start with acquireTokenSilent to obtain a token in the signed in user from cache
            var myMSALObj = new Msal.UserAgentApplication(this.msalConfig);
            // myMSALObj.handleRedirectCallback(this.authRedirectCallBack);
            myMSALObj.acquireTokenSilent(this.requestObj)
            .then(function (tokenResponse) {
                that.callMSGraph(that.graphConfig.graphMeEndpoint, tokenResponse.accessToken, that.graphAPICallback);
            })
            .catch(function (error) {
                console.log(error);
                // Upon acquireTokenSilent failure (due to consent or interaction or login required ONLY)
                // Call acquireTokenPopup(popup window)
                if (this.requiresInteraction(error.errorCode)) {
                    myMSALObj.acquireTokenPopup(this.requestObj).then(function (tokenResponse) {
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
            this.displayName = jsonresult.displayName;
            ;
            if(jsonresult.jobTitle.match('TECHNICAL ADVISOR') == 'TECHNICAL ADVISOR'|| jsonresult.jobTitle.match('MANAGER') == 'MANAGER'||jsonresult.userPrincipalName === 'v-jelu@microsoft.com' || jsonresult.userPrincipalName === 't-junzhu@microsoft.com')
            { this.admin = true }
            // use store.js to store hope that works
            store.set('user', {displayName:this.displayName, admin: this.admin})
            if( jsonresult.jobTitle === 'TECHNICAL ADVISOR ASIA' || jsonresult.userPrincipalName === 'v-jelu@microsoft.com' || jsonresult.userPrincipalName === 't-junzhu@microsoft.com') {
                this.accessmsg = result;
                // document.getElementById("json").innerHTML = result;
            } else {
                this.accessmsg = 'sorry, this portal is for managers only';
                // document.getElementById("json").innerHTML = 'sorry, this portal is for managers only';
            }
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
</style>
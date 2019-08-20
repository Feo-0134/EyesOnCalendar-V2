<template>
 	<div>
        <div>
			<p>Welcome to CSS Calender</p>
		</div>
		<div>
			<pre id="json" ></pre>
		</div>
        <button hidden="true" id="showteam" v-on:click="getTeaminfo()"></button>
        <div>
			<pre id="teaminfo" ></pre>
		</div>
        <el-col :span="12" :offset="6">
            <div class="grid-content bg-purple">
                <el-tabs v-model="activeName">
                    <el-tab-pane id="TM" label="TM" name="first">TM</el-tab-pane>
                </el-tabs>
                <el-tabs v-model="activeName">
                    <el-tab-pane id="TA" label="TA" name="first">TA</el-tab-pane>
                </el-tabs>
                <el-tabs v-model="activeName">
                    <el-tab-pane id="FTE" label="FTE" name="first">FTE</el-tab-pane>
                </el-tabs>
                <el-tabs v-model="activeName">
                    <el-tab-pane id="VENDOR" label="VENDOR" name="first">VENDOR</el-tab-pane>
                </el-tabs>
                <el-tabs v-model="activeName">
                    <el-tab-pane id="INTERN" label="INTERN" name="first">INTERN</el-tab-pane>
                </el-tabs>
            </div>
        </el-col>

        <!-- <div id="sidebar">
			<el-menu
                    default-active="1"
                    class="el-menu-vertical-demo"
                    background-color="#252525"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                <el-menu-item index="1">
                    <i class="el-icon-menu"></i>
                    <span slot="title">Navigator Two</span>
                </el-menu-item>
                <el-menu-item index="2">
                    <i class="el-icon-setting"></i>
                    <span slot="title">Navigator Four</span>
                </el-menu-item>
			</el-menu>
		</div> -->
	</div>
</template>


<script>
	var msalConfig = {
		auth: {
			clientId: "c6c7e163-aa0b-4185-b95d-0073ee49fa22", //This is your client ID
			authority:
			"https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47" //This is your tenant info
		},
		cache: {
			cacheLocation: "localStorage",
			storeAuthStateInCookie: true
		}
	};

	var graphConfig = {
		graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
	};

	// create a request object for login or token request calls
	// In scenarios with incremental consent, the request object can be further customized
	var requestObj = {
		scopes: ["user.read"]
	};

	var myMSALObj = new Msal.UserAgentApplication(msalConfig);

	// // Register Callbacks for redirect flow
	// // myMSALObj.handleRedirectCallbacks(acquireTokenRedirectCallBack, acquireTokenErrorRedirectCallBack);
	myMSALObj.handleRedirectCallback(authRedirectCallBack);

	function callMSGraph(theUrl, accessToken, callback) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() {

			if (this.readyState == 4 && this.status == 200)
			callback(JSON.parse(this.responseText));
		};
		xmlHttp.open("GET", theUrl, true); // true for asynchronous
		xmlHttp.setRequestHeader("Authorization", "Bearer " + accessToken);
		xmlHttp.send();
	}

	function graphAPICallback(data) {
		console.log('graphAPICallback');
		let result = JSON.stringify(data, null, 4);
		//document.getElementById("json").innerHTML = result;
		let jsonresult = JSON.parse(result);

		if( jsonresult.jobTitle === 'TECHNICAL ADVISOR ASIA' || jsonresult.userPrincipalName === 'v-jelu@microsoft.com' || jsonresult.userPrincipalName === 't-junzhu@microsoft.com') {
			document.getElementById("json").innerHTML = result;
		} else {
			document.getElementById("json").innerHTML = 'sorry, this portal is for managers only';
        }
        document.getElementById("showteam").click();

    }

    function showteaminfo() {

    }

	function acquireTokenPopupAndCallMSGraph() {
		//Always start with acquireTokenSilent to obtain a token in the signed in user from cache
		myMSALObj.acquireTokenSilent(requestObj)
		.then(function (tokenResponse) {
			callMSGraph(graphConfig.graphMeEndpoint, tokenResponse.accessToken, graphAPICallback);
		})
		.catch(function (error) {
			//console.log(error);
			console.log('catch');
			// Upon acquireTokenSilent failure (due to consent or interaction or login required ONLY)
			// Call acquireTokenPopup(popup window)
			if (requiresInteraction(error.errorCode)) {
				myMSALObj.acquireTokenPopup(requestObj).then(function (tokenResponse) {
					callMSGraph(graphConfig.graphMeEndpoint, tokenResponse.accessToken, graphAPICallback);
				}).catch(function (error) {
					console.log(error);
				});
			}
		});
	}

	//IE support
   	function acquireTokenRedirectAndCallMSGraph() {
        //Always start with acquireTokenSilent to obtain a token in the signed in user from cache
        myMSALObj.acquireTokenSilent(requestObj).then(function (tokenResponse) {
            callMSGraph(graphConfig.graphMeEndpoint, tokenResponse.accessToken, graphAPICallback);
        }).catch(function (error) {
            console.log(error);
            // Upon acquireTokenSilent failure (due to consent or interaction or login required ONLY)
            // Call acquireTokenRedirect
            if (requiresInteraction(error.errorCode)) {
                myMSALObj.acquireTokenRedirect(requestObj);
            }
        });
    }

	function authRedirectCallBack(error, response) {
        if (error) {
            console.log(error);
        } else {
            if (response.tokenType === "access_token") {
                callMSGraph(graphConfig.graphMeEndpoint, response.accessToken, graphAPICallback);
            } else {
                console.log("token type is:" + response.tokenType);
            }
        }
    }

    function requiresInteraction(errorCode) {
        if (!errorCode || !errorCode.length) {
            return false;
        }
        return errorCode === "consent_required" ||
            errorCode === "interaction_required" ||
            errorCode === "login_required";
    }


	export default {
        data() {
            return {
                activeName: 'first'
            };
        },
		mounted() {
            acquireTokenPopupAndCallMSGraph();
		},
		methods: {
            getTeaminfo() {
                return new Promise((resolve, reject) => {
                    axios.get("/api/portal/team/findall").then((response)=> {
                        console.log(response.data[0]);
                        document.getElementById("TM").innerHTML = JSON.stringify(response.data[0].TM);
                        document.getElementById("TA").innerHTML = JSON.stringify(response.data[0].TA);
                        document.getElementById("FTE").innerHTML = JSON.stringify(response.data[0].FTE);
                        document.getElementById("VENDOR").innerHTML = JSON.stringify(response.data[0].VENDOR);
                        document.getElementById("INTERN").innerHTML = JSON.stringify(response.data[0].INTERN);
                        }).catch((error) => {
                            console.log(error);
                    })
                })
            },
		}
	}

</script>


<style>
	.el-menu-vertical-demo:not(.el-menu--collapse) {
		width: 200px;
		min-height: 600px;
	}
</style>

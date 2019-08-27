<template> 
    <el-container>
    <el-header>Portal</el-header>
    <el-container>
        <el-aside width="300px">
            <el-menu>
                <el-submenu index="2">
                    <template slot="title"><i class="el-icon-menu"></i>Navigator</template>
                    <el-menu-item-group>
                    <template slot="title">Group 1</template>
                    <el-menu-item index="2-1" v-on:click="showTeamForm">Team Management</el-menu-item>
                    <el-menu-item index="2-2" v-on:click="showShiftForm">Shift Management</el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group title="Group 2">
                    <el-menu-item index="2-3" v-on:click="showInitForm">Initiate Calendar</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-main>
            <el-form v-if="initForm" ref="form" :model="form" label-width="140px">
                <el-form-item label="Team Name">
                    <el-input v-model="form.TeamName"></el-input>
                </el-form-item>
                <el-form-item label="Month">
                    <el-input v-model="form.Month" ></el-input>
                </el-form-item>
                <el-form-item label="Team Manager">
                    <el-input v-model="form.TeamManage" ></el-input>
                </el-form-item>
                <el-form-item label="Technic Advisor">
                    <el-input v-model="form.TeamAdvisor" placeholder="example: danzha;anikshen;"></el-input> 
                </el-form-item>
                <el-form-item label="FTE">
                    <el-input v-model="form.FTE"></el-input>
                </el-form-item>
                <el-form-item label="Vendor">
                    <el-input v-model="form.Vendor"></el-input>
                </el-form-item>
                <!-- <el-form-item label="Others">
                    <el-input v-model="form.name"></el-input>
                </el-form-item> -->
                <span>
                    <el-button @click=";">Cancel</el-button>
                    <el-button type="primary" @click=";">Confirm</el-button>
                </span>
            </el-form>
            <el-form v-if="shiftForm" ref="form" :model="form" label-width="140px">
                <el-form-item label="Team Name">
                    <el-input v-model="form.TeamName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="Month">
                    <el-input v-model="form.Month" ></el-input>
                </el-form-item>
                <el-form-item label="Morning Shift">
                    <el-input v-model="form.TeamManage" ></el-input>
                    <div class="functionalButton">
                    <el-button type="primary" icon="el-icon-plus" circle></el-button>
                    <el-button type="primary" icon="el-icon-minus" circle></el-button>
                    </div>
                </el-form-item>
                <el-form-item label="Night Shift">
                    <el-input v-model="form.TeamManage" ></el-input>
                    <div class="functionalButton">
                    <el-button type="primary" icon="el-icon-plus" circle></el-button>
                    <el-button type="primary" icon="el-icon-minus" circle></el-button>
                    </div>
                </el-form-item>
                <!-- <el-form-item label="Others">
                    <el-input v-model="form.name"></el-input>
                </el-form-item> -->
                <span>
                    <el-button @click=";">Cancel</el-button>
                    <el-button type="primary" @click=";">Confirm</el-button>
                </span>
            </el-form>
            <el-form v-if="teamForm" ref="form" :model="form" label-width="140px">
                <el-form-item label="Team Name">
                    <el-input v-model="form.TeamName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="Month">
                    <el-input v-model="form.Month" ></el-input>
                </el-form-item>
                <el-form-item label="Team Manager">
                    <el-input v-model="form.TeamManage" ></el-input>
                    <div class="functionalButton">
                    <el-button type="primary" icon="el-icon-plus" circle></el-button>
                    <el-button type="primary" icon="el-icon-minus" circle></el-button>
                    </div>
                </el-form-item>
                <el-form-item label="Technic Advisor">
                    <el-input v-model="form.TeamAdvisor" placeholder="example: danzha;anikshen;"></el-input>
                    <div class="functionalButton">
                    <el-button type="primary" icon="el-icon-plus" circle></el-button>
                    <el-button type="primary" icon="el-icon-minus" circle></el-button>
                    </div>
                </el-form-item>
                <el-form-item label="FTE">
                    <el-input v-model="form.FTE"></el-input>
                    <div class="functionalButton">
                    <el-button type="primary" icon="el-icon-plus" circle></el-button>
                    <el-button type="primary" icon="el-icon-minus" circle></el-button>
                    </div>
                </el-form-item>
                <el-form-item label="Vendor">
                    <el-input v-model="form.Vendor"></el-input>
                    <div class="functionalButton">
                    <el-button type="primary" icon="el-icon-plus" circle></el-button>
                    <el-button type="primary" icon="el-icon-minus" circle></el-button>
                    </div>
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
module.exports = {
    data: function () {
        return {
            teamForm: false,
            shiftForm: false,
            initForm: true,
            form: {
                TeamName: '',
                Month: '',
                TeamManage: '',
                TeamAdvisor: '',
                FTE: '',
                Vendor: '',
            },
        }
    },
    methods: {
        showTeamForm: function () {
            this.teamForm = true
            this.shiftForm = false
            this.initForm = false
        },
        showShiftForm: function () {
            this.teamForm = false
            this.shiftForm = true
            this.initForm = false
        },
        showInitForm: function () {
            this.teamForm = false
            this.shiftForm = false
            this.initForm = true
        },
    }
}
</script>

<style>
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
      margin-top: -10px;
  }
  .el-form-item .el-input {
      width: 80%;
  }
  .el-form-item__content {
      display:flex;
  }
</style>
<template> 
    <el-container>
    <el-header>Portal</el-header>
    <el-container>
        <el-aside width="200px">
            <el-menu>
                <el-submenu index="2">
                    <template slot="title"><i class="el-icon-menu"></i>Navigator</template>
                    <el-menu-item-group>
                    <template slot="title">Group 1</template>
                    <el-menu-item index="2-1">Option 1</el-menu-item>
                    <el-menu-item index="2-2">Option 2</el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group title="Group 2">
                    <el-menu-item index="2-3">Option 3</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-main>
            <el-row>
                <el-col :span="18">
                    <div class="grid-content bg-purple">
                        <div class="subtitle">Team Mananger</div>
                        <div class="member-list">
                            <i class="el-icon-user-solid">(karenzhe)</i>
                        </div>
                        <el-input class="el-input"
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="Please input"
                        v-model="textarea2">
                        </el-input>
                    </div></el-col>
                <el-col :span="6">
                    <div class="grid-content bg-purple-dark">
                        <el-button type="primary" icon="el-icon-plus" plain>Add Person</el-button>
                        <el-button type="primary" icon="el-icon-minus" plain>Del Person</el-button>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="18">
                    <div class="grid-content bg-purple">
                        <div class="subtitle">Team Advisor</div>
                        <div class="member-list">
                            <i class="el-icon-user-solid">(anikshen)</i>
                            <i class="el-icon-user-solid">(danzha)</i>
                        </div>
                        <el-input class="el-input"
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="Please input"
                        v-model="textarea2">
                        </el-input>
                    </div></el-col>
                <el-col :span="6">
                    <div class="grid-content bg-purple-dark">
                        <el-button type="primary" icon="el-icon-plus" plain>Add Person</el-button>
                        <el-button type="primary" icon="el-icon-minus" plain>Del Person</el-button>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="18">
                    <div class="grid-content bg-purple">
                        <div class="subtitle">FTE</div>
                        <div class="member-list">
                            <i class="el-icon-user-solid">(karenzhe)</i>
                            <i class="el-icon-user-solid">(anikshen)</i>
                            <i class="el-icon-user-solid">(danzha)</i>
                        </div>
                        <el-input class="el-input"
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="Please input"
                        v-model="textarea2">
                        </el-input>
                    </div></el-col>
                <el-col :span="6">
                    <div class="grid-content bg-purple-dark">
                        <el-button type="primary" icon="el-icon-plus" plain>Add Person</el-button>
                        <el-button type="primary" icon="el-icon-minus" plain>Del Person</el-button>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="18">
                    <div class="grid-content bg-purple">
                        <div class="subtitle">Vendor</div>
                        <div class="member-list">
                            <i class="el-icon-user-solid">(karenzhe)</i>
                        </div>
                        <el-input class="el-input"
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="Please input"
                        v-model="textarea2">
                        </el-input>
                    </div></el-col>
                <el-col :span="6">
                    <div class="grid-content bg-purple-dark">
                        <el-button type="primary" icon="el-icon-plus" plain>Add Person</el-button>
                        <el-button type="primary" icon="el-icon-minus" plain>Del Person</el-button>
                    </div>
                </el-col>
            </el-row>
             <el-button type="primary" >Initiate Team</el-button>
             <el-button type="primary" >Update Data</el-button>
        </el-main>
    </el-container>
    </el-container>
</template>

<script>
module.exports = {
    data: function () {
        return {
            greeting: 'Hello',
            textarea1: '',
            textarea2: ''
        }
    }
}
</script>

<style>
 p {
     font-size: 2em;
     text-align: center;
 }
 .el-container .el-header {
     background-color: rgb(37, 37, 37);
     text-align: left;
     margin-left: 40px;
     font-size: xx-large;
 }
 .el-container .el-aside {
     border-radius: 7px;
     background-color: #d3dce6;
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
</style>
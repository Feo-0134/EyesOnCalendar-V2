<template>
<div>
  <div class="overlay" v-if="open" @click="open=false">
    <div class="help-dialog">
        <h1>Help</h1>
        <!-- <h5 class="help-subtitle">will improve this dialog, I promise!</h5> -->
        <div class="legenda-container">
            <div class="dayTypes">
                <div class="icon-container">
                <div class="iconPreview" style="background-image: url(&quot;data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzIwMCcgd2lkdGg9JzIwMCcgIGZpbGw9IiMwMDAwMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAxMDAgMTAwIiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48cGF0aCBkPSJNNTAuMSwzMS4yaC0wLjFjLTIuOSwwLTUuMywyLjQtNS4zLDUuM3YxNS4zYzAsMi45LDIuNCw1LjMsNS4zLDUuM2gwLjFjMi45LDAsNS4zLTIuNCw1LjMtNS4zVjM2LjQgICBDNTUuMywzMy41LDUzLDMxLjIsNTAuMSwzMS4yeiI+PC9wYXRoPjxwYXRoIGQ9Ik01My41LDE1LjNoLTAuOWgtNS4zaC0wLjljLTExLjYsMC0yMS4xLDkuNS0yMS4xLDIxLjF2MTIuN3YyMS41QzI1LjQsODQsMzYuMiw5NSw0OS41LDk1LjJsMC41LDBjMCwwLDAsMCwwLDAgICBjNi42LDAsMTIuOC0yLjcsMTcuNC03LjVjNC42LTQuOCw3LjItMTEsNy4yLTE3LjZ2LTIxVjM2LjNDNzQuNiwyNC43LDY1LjIsMTUuMyw1My41LDE1LjN6IE02OS4zLDQzLjhINTguNHY1LjNoMTAuOXYyMSAgIGMwLDUuMi0yLDEwLjItNS43LDE0QzYwLDg3LjksNTUuMSw5MCw1MCw5MGgwbC0wLjQsMGMtMTAuNS0wLjItMTktOC45LTE5LTE5LjNWNDkuMWgxMC45di01LjNIMzAuN3YtNy41YzAtOC43LDcuMS0xNS44LDE1LjgtMTUuOCAgIGgwLjl2Ny45YzAuOC0wLjMsMS43LTAuNCwyLjYtMC40aDAuMWMwLjksMCwxLjgsMC4xLDIuNiwwLjR2LTcuOWgwLjljOC43LDAsMTUuOCw3LjEsMTUuOCwxNS44VjQzLjh6Ij48L3BhdGg+PC9nPjxwYXRoIGQ9Ik0yNC44LDIxLjVsLTUuMS0yLjljLTAuOS0wLjUtMi0wLjItMi41LDAuN2wwLDBjLTAuNSwwLjktMC4yLDIsMC43LDIuNWw1LDIuOWMwLjUsMC4zLDEuMiwwLjEsMS41LTAuNCAgYzAuMi0wLjQsMC41LTAuOCwwLjctMS4yQzI1LjUsMjIuNiwyNS40LDIxLjksMjQuOCwyMS41eiI+PC9wYXRoPjxwYXRoIGQ9Ik0yOS45LDE3LjdjMC40LTAuMywwLjctMC42LDEuMS0wLjljMC41LTAuNCwwLjYtMS4xLDAuMi0xLjZsLTMuOC00LjVjLTAuNy0wLjgtMS44LTAuOS0yLjYtMC4ybDAsMCAgYy0wLjgsMC43LTAuOSwxLjgtMC4yLDIuNmwzLjcsNC41QzI4LjcsMTguMSwyOS40LDE4LjEsMjkuOSwxNy43eiI+PC9wYXRoPjxwYXRoIGQ9Ik0zNy4yLDEzLjNjMC40LTAuMiwwLjktMC4zLDEuMy0wLjVjMC42LTAuMiwwLjktMC44LDAuNy0xLjRsLTItNS41Yy0wLjMtMS0xLjQtMS40LTIuMy0xLjFsMCwwYy0xLDAuMy0xLjQsMS40LTEuMSwyLjMgIGwyLDUuNUMzNS45LDEzLjMsMzYuNiwxMy42LDM3LjIsMTMuM3oiPjwvcGF0aD48L3N2Zz4=&quot;);"></div>
                <h5>Change day type</h5>
                </div>
                <!-- <div class="icon-container">
                <div class="iconPreview large">CTRL+Z</div><h5 style="margin-top: 17px">Undo change(s)</h5>
                </div> -->
            </div>
            <div class="dayTypes">
                <div class="box-container">
                    <div class="box green"></div><h5>Working day</h5>
                </div>
                <div class="box-container">
                    <div class="box red">V</div><h5>Vacation</h5>
                </div>
                <div class="box-container">
                    <div class="box purple">DV</div><h5>Desired Vacation</h5>
                </div>
            </div>
            <div class="dayTypes">
                <div class="box-container">
                    <div class="box red">PH</div><h5>Public Holiday</h5>
                </div>
                <div class="box-container">
                    <div class="box blue">T</div><h5>Training</h5>
                </div>
            </div>
        </div>
        <div class="separator"></div>
        <div class="legenda-container">
            
            <div class="colorCodes">
                <h5>You cannot change weekend days to any other type except OnCall</h5>
                <h5>You cannot set V, DV, T to working</h5>
                <h5>You cannot set a normal working day to Not Working (red), change day type first</h5>
            </div>
        </div>
    </div>
  </div>
  <button @click="open=!open" v-if="!open" class="fab">?</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      open: false
    };
  }
};
</script>

<style>
.colorCodes {
  text-align: left;
}
.dayTypes {
  width: 267px;
}
.separator {
  height: 20px;
  margin: 20px auto 0 auto;
  border-top: 1px gray solid;
  width: 80%;
}
.box-container {
  display: flex;
}

.box {
  margin: 5px;
  width: 40px;
  height: 40px;
  color: white;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  vertical-align: middle;
  flex-direction: column;
}

.grey {
  background-color: #555555;
}
.red {
  background-color: #8c2230;
}

.green {
  background-color: #557037;
}

.blue {
  background-color: #375c8c;
}

.purple {
  background-color: #513567;
}

.orange {
  background-color: #b36b00;
}
.hr {
  text-align: left;
}
.legenda-container {
  display: flex;
  justify-content: left;
}
.icon-container {
  display: flex;
  justify-content: left;
}

.iconPreview {
  width: 50px;
  height: 50px;
  background-size: cover;
  display: flex;
  justify-content: center;
  vertical-align: middle;
}
.large {
  flex-direction: column;
  width: 90px;
  font-weight: 700;
}

.overlay {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
}
.help-dialog {
  background-color: white;
  position: fixed;
  top: 15%;
  left: 50%;
  margin-left: -400px;
  width: 800px;
  padding: 30px;
  color: black;
}
.fab {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 30px;
  border: none;
  background-color: #600;
  color: white;
  font-weight: 700;
  font-size: 30px;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
}

.fab:hover {
  box-shadow: 0 6px 14px 0 #000;
  transform: scale(1.05);
}
</style>

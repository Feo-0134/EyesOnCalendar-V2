<template>
  <div class="row">
      <div class="cell name">{{caldata.name.split(' ')[0]}} {{caldata.name.trim().split(' ')[caldata.name.trim().split(' ').length-1][0]}}</div>
      <div class="cell workday" 
            v-bind:style="{'background-color': getColor(item)}" 
            v-for="(item,index) in caldata.days" 
            :key="index" 
            v-bind:day="index" 
            v-on:click="toggleWork({item,index})"
            v-on:contextmenu="openMenu">{{item.label}}</div>
  </div>
</template>

<script>
export default {
  props: ['caldata','personkey'],
  methods: {
      getColor(data) {
          if (data.work == true)
            return 'green'
        else return 'red'
      },
      openMenu(e) {
          e.preventDefault()
      },
      toggleWork(e) {
          //console.log("Clicked!")
          this.$store.dispatch('toggleWork',{personkey:this.personkey,toggleevent:e,month:this.$store.state.calendar.month})
      }
  }
}
</script>

<style>
    .row {
        display: flex;
        height: 40px;
        justify-content: center;
    }
    .cell {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        vertical-align: middle;
    }
    .name {
        width: 120px;
    }
    .workday {
        width: 40px;
        color: white;
        border: 2px solid white;
    }
</style>

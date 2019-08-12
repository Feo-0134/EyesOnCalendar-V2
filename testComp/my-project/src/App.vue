<template>
  <div id="app">
    <TestDialog />
  </div>
</template>

<script>
import TestDialog from './components/TestDialog.vue'

export default {
  name: 'app',
  components: {
    TestDialog
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<template>
  <div id="app">
    <main>
      <router-view></router-view>
    </main>
    <footer class="footer">
      <p>Hope you enjoy using this app.
        For any issues, please contact eyesoncalendar2@microsoft.com
      </p>
      <p> © 2019 EyesOnCalendar </p>
    </footer>
  </div>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
    };
  },
  created() {
  },
};
</script>

<style>
@import"App.css";
</style>

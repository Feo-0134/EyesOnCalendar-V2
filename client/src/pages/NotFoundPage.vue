<template>
    <div>
        <p class='title_font'> 404 Page Not Found </p>
        <el-button type='primary'>
            <a :href="linkToCalendar" class="link_font">Back To Calendar</a>
        </el-button>
    </div>
</template>

<script>
export default {
  computed: {
    linkToCalendar() {
      return '/';
    },
  },
};
</script>

<style>
@import"test.css";
</style>

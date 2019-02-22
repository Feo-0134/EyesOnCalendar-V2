<template>
  <div>{{current}}</div>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      current: "Loading current month..."
    }
  },
  created() {
    this.$router.push("AppService"+moment().format('/YYYY/M'))
  }
}
</script>
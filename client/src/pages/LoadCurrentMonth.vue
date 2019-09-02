<template>
  <AccessCell />
</template>

<script>
import AccessCell from '@/components/AccessCell'
import moment from 'moment'
export default {
  components: {AccessCell},
  data() {
    return {
      current: "Loading current month..."
    }
  },
  created() {
    // console.log(this.$store.state)
    this.$router.push("AppService"+moment().format('/YYYY/M'))
  },
}
</script>
<template>
  <AccessCell />
</template>

<script>
import AccessCell from '@/components/AccessCell';

export default {
  components: { AccessCell },
  data() {
    return {
      current: 'Loading current month...',
    };
  },
};
</script>

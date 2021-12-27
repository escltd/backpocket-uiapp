<template>
  <div class="dt center">
    <p v-for="(alert, index) in notifications" :key="index"  class=" br1 w5 pa2 f6 fw4 white " :class="{'bg-green':alert.Code==200,'bg-red':alert.Code!==200}">
        <span class="pointer fl" @click="close(index)">&times;</span>
        {{ alert.Message }}
    </p>
  </div>
</template>
<script type="text/javascript">
  export default {
    props: ['notifications'],
    methods: {
      close(index) {
        this.$delete(this.notifications, index)
      }
    },
  }
</script>

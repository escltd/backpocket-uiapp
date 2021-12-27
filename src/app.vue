<template>
    <keep-alive><router-view></router-view> </keep-alive>
</template>

<!-- App specific objects  -->
<script type="text/javascript">
  module.exports = {
    name: "app",
    created() { },
    methods: {
    }
  }
</script>

<!-- App specific stylings  -->
<style lang="scss">
    // @import "assets/scss/tachyons.css";
</style>


<style media="screen">
    @import "assets/css/fontawesomepro.css";
    @import "assets/css/animista.css";
    @import "assets/css/styles.css";

    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }

    /* Firefox */
    input[type=number] {
    -moz-appearance: textfield;
    }
</style>
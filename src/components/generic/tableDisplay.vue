<template id="">
  <section>
    <div class="mt5 bg-black ba b--gold cf">
      <div class="fl w-30">Page :
        <input type="text" name="" value="1" class="w-50 br2 bg-white">
      </div>
      <div class="fr w-50">
        Has :
          <input type="text" name="" value="20" class="w-40 br2 bg-white">
        Records
      </div>
    </div>
    <div class="mt2">
      <table class="bg-light-gray w-100 black">
        <thead class="tl f5">
          <slot name="tableHead" ></slot>
        </thead>
        <tbody>
          <slot name="tableBody" ></slot>
        </tbody>
      </table>1
    </div>
  </section>
</template>
<script type="text/javascript">
  export default {
  }
</script>
<style media="screen">

</style>

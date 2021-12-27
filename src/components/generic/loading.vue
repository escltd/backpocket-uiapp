<template>
  <div class="w-100 vh-100 center fixed top-0 left-0 z-max loading" :class="{'dn':loading,'db':!loading}">
    <div class="center w-100 vh-100 bgBlank" :style="{'background-image': 'url('+screen+')'}">
      <article class="dt center vh-75 w-100">
        <div class="dtc v-mid f6 tc fw3 white overflow-hidden">

          <div class="intro-preloader intro-div">
            <span class="intro-line intro-line-1"></span>
            <span class="intro-line intro-line-2"></span>
            <span class="intro-line intro-line-3"></span>
            <span class="intro-line intro-line-4"></span>
            <span class="intro-line intro-line-5"></span>
            <span class="intro-line intro-line-6"></span>
            <span class="intro-line intro-line-7"></span>
            <span class="intro-line intro-line-8"></span>
            <span class="intro-line intro-line-9"></span>
            <div>Loading</div>
          </div>
        
        </div>
      </article>
    </div>
  </div>
</template>

<script type="text/javascript">
  import screen from "@/assets/pattern.png"

  export default {
    data() {return{
      screen, loading:false
    }},
    created(){
      const that = this  
     // document.getElementsByTagName("html")[0].classList.toggle('overflow-hidden');
      setTimeout(function () {
        that.loading = !that.loading
        //document.getElementsByTagName("html")[0].classList.toggle('overflow-hidden');
      }, 1250);
    }
  }
</script>

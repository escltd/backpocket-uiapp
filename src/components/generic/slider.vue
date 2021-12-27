<template> 
    <div class="w-100 bg-black-10 slider" :style="{'height':'100%','transition':'background-image '+delay+'s ease','background-image': 'url('+image+')'}" > 
    <slot></slot>
    </div>
</template>
<script type="text/javascript">
  export default { 
    data () { return { pos:0, image:"", timeout:"" } },
    props: ['images', 'delay', ],
    methods: {
      goTo(index) {
        if (this.images.length < 1 || this.delay == "" || this.delay == undefined || isNaN(this.delay) || this.delay < 2 ) {
            return
        }
        const that = this  
        that.pos = index
        that.image = this.images[that.pos]
        that.timeout = setTimeout(function () {
            var index = that.pos+1;
            if (index >= that.images.length) {
                index = 0    
            }
            that.goTo(index)
        }, that.delay * 1100);
      },
    },
    created() { this.goTo(0); },
    destroyed(){ clearTimeout(this.timeout) }
  }
</script>
<style> 
    .slider { background-size: cover; background-repeat: no-repeat; background-position: center; } 
</style>
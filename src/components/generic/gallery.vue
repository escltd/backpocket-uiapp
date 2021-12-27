<template> 
    <section class="w-100 fl" style="height:100%">
        <div class="w-100 bg-black-10 gallery" :style="{'height':'80%','transition':'background-image '+delay+'s ease','background-image': 'url('+image+')'}" ></div>
        
        <div class="w-100 fl inline-flex overflow-x-hidden items-center relative bn">
            <span @click="goToPrev()" class="oi absolute left-0 white ml2 bg-black-30 pointer pa3" data-glyph="chevron-left"></span>
            <div class="w-100 fl tl">
                <img class="h3 ma1 dib pointer" :src=" image" v-for="(image, index) in images" :key="index" @click="goTo(index)" :class="{'ba b--white':index==pos}"/>
            </div>
            <span @click="goToNext()" class="oi absolute right-0 white mr2 bg-black-30 pointer pa3" data-glyph="chevron-right"></span>
        </div>
    </section>
</template>
<script type="text/javascript">
  export default { 
    data () { return { pos:0, image:"", timeout:"" } },
    props: ['images', 'delay', ],
    methods: {
        goToPrev() {
            this.goTo(this.pos-1)
        },
        goToNext() {
            this.goTo(this.pos+1)
        },
        goTo(index) {
            if (this.images.length < 1 || this.delay == "" || this.delay == undefined || isNaN(this.delay) || this.delay < 2 ) {
                return
            }
            console.log(index)
            if(index < 0 ){
                index=0
            }
            
            if(index >= this.images.length){
                index= this.images.length-1
            }
            const that = this  
            that.pos = index
            that.image = this.images[that.pos]
        },
    },
    created() { this.goTo(0); },

  }
</script>
<style> 
    .gallery { background-size: cover; background-repeat: no-repeat; background-position: center; } 
</style>
<template>
    <section class="w-100 fl bg-near-white bb b--black-20 f6">
        
            <div  class="mw8 center w-100 flex flex-row items-center ">
                <span class="dn-l"> <i class="pointer fal f4 fa-chevron-left mh2" @click="goLeft" /> </span>

                <div ref="categoryscroller" class="w-100 flex overflow-x-scroll">
                    <div class="flex flex-column pv4 ph3 tc flex-grow-0 flex-shrink-0 w-third-l w-50-m w-100 h-100" v-for="(product, index) in productList" :key="index">
                        <p class="fw6 mv1 ttu"> {{product.Title}} </p>
                        {{product.Description}}
                    </div>    
                </div>

                <span class="dn-l"> <i class="pointer fal f4 fa-chevron-right mh2" @click="goRight" /> </span>
            </div>
        
        
    </section>
</template>

<script type="text/javascript">
    export default {
        props: ["title"],
        data(){return{ 
            lBtn:false,
            productList:[
                {Title:"Sample Product", Description:"Check out whats new in shop now" },
                {Title:"Sample Product", Description:"Check out our new lashes, head wraps, earrings and fanny packs" },
                {Title:"Sample Product", Description:"Shop the new swimwear collection shop now" },
            ],
        }},
        mounted() { 
           this.$refs.categoryscroller.scrollLeft = 0
        },
        methods:{
            goLeft() {
                if (this.$refs.categoryscroller.scrollLeft > 0) {
                    this.$refs.categoryscroller.scrollLeft -= this.$refs.categoryscroller.clientWidth
                }
                if (this.$refs.categoryscroller.scrollLeft < 0){
                    this.$refs.categoryscroller.scrollLeft = 0
                }
            },
            goRight() {
                if (this.$refs.categoryscroller.scrollLeft <= this.$refs.categoryscroller.scrollWidth) {
                    this.$refs.categoryscroller.scrollLeft += this.$refs.categoryscroller.clientWidth
                    
                } 
                
                if (this.$refs.categoryscroller.scrollLeft > this.$refs.categoryscroller.scrollWidth){
                    this.$refs.categoryscroller.scrollLeft = this.$refs.categoryscroller.scrollWidth
                }
            },
        }
    }
</script>
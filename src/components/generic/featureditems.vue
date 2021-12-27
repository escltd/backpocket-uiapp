<template>
    <section class="w-100 near-black fl pv4">
        <div class="tc w-100 mv4">
            <span class="cf f3 center bb b--near-black tracked">{{title}}</span>
        </div>

        <div class="w-100 cf center ph2">
            <div class=" w-100 flex flex-row items-center pv3 fl ">
                <i class="pointer fal f2 fa-chevron-left mr2" @click="goLeft" />
                <div ref="imagescroller" class="w-100 flex overflow-x-scroll " style="height:60vh">

                    
                    <div class="flex flex-column flex-grow-0 flex-shrink-0 w-25 h-100" v-for="(product, index) in productList" :key="index">
                        <div class="dt w-100 h-100 ph1">
                            <div class="dtc v-mid tc bg-light-gray pointer" @mouseenter="product.Focus=true" @mouseleave="product.Focus=false">
                                <button v-if="product.Focus" class="center bg-black pointer hover-bg-light-pink hover-black br1 pa2 bn near-white f6"> Quick View </button>    
                            </div>
                        </div>
                        <div class="w-100 fl tc bg-white f6 pa2"> 
                            {{product.Title}} <span class="db">{{product.Price}} {{product.Currency}}</span>
                        </div>
                    </div>
                    
                </div>
                <i class="pointer fal f2 fa-chevron-right ml2" @click="goRight" />
            </div>
        </div>
        
    </section>
</template>

<script type="text/javascript">
    export default {
        props: ["title"],
        data(){return{ 
            lBtn:false,
            productList:[
                {Focus:false, Title:"Sample Product", Price:"1000", Currency:"NGN" },
                {Focus:false, Title:"Sample Product", Price:"1000", Currency:"NGN" },
                {Focus:false, Title:"Sample Product", Price:"1000", Currency:"NGN" },
                {Focus:false, Title:"Sample Product", Price:"1000", Currency:"NGN" },
                {Focus:false, Title:"Sample Product", Price:"1000", Currency:"NGN" },

                
            ],
        }},
        mounted() { 
           this.$refs.imagescroller.scrollLeft = 0
        },
        methods:{
            goLeft() {
                if (this.$refs.imagescroller.scrollLeft > 0) {
                    this.$refs.imagescroller.scrollLeft -= (250)
                }
                if (this.$refs.imagescroller.scrollLeft < 0){
                    this.$refs.imagescroller.scrollLeft = 0
                }
            },
            goRight() {
                if (this.$refs.imagescroller.scrollLeft <= this.$refs.imagescroller.scrollWidth) {
                    this.$refs.imagescroller.scrollLeft += (250)
                    
                } 
                
                if (this.$refs.imagescroller.scrollLeft > this.$refs.imagescroller.scrollWidth){
                    this.$refs.imagescroller.scrollLeft = this.$refs.imagescroller.scrollWidth
                }
            },
        }
    }
</script>
<template>
  <section class="flex flex-column w-100 vh-100">
    <siteheader page="predict" />
        
    <div class="dt w-100 center mw8 vh-75">
        <div class="w-100 dtc v-mid f6 tc">
            <p><small class="i white-50 ">**coming soon**</small></p>
            <img :src="image" class=""/>
            <br/> <br/> <br/>
            <img :src="imageTwo" class=""/>
        </div>
    </div>

  </section>
</template>

<script type="text/javascript">
import { mapState, mapGetters } from 'vuex';
import { HTTP, humanNumber, humanDate, truncateNumber, sortObjectEntries } from "@/common";
import marketpairs from "@/components/marketpairs";
import siteheader from "@/components/generic/siteheader";


export default {
    components: { siteheader, marketpairs, },
    data() { return {
        wsConnMarket:{}, lLoading: true, notifications: [], marketpairList: {},
        fromDate: new Date().toJSON().slice(0,10), toDate: new Date().toJSON().slice(0,10),
        baseAsset:"", quoteAsset: "", orderStatus: "", orderSide: "", 
        image:"https://miro.medium.com/max/1232/0*a7z1Yd7jHT1ftqlg.jpg",
        imageTwo:"https://coinranking.com/blog/wp-content/uploads/2019/10/Prediction-Contest-game-manual-1440x510.png"
    }},
    computed: {
        ...mapGetters('marketpairs', ['getAllMarketPairs']),
        ...mapGetters('assets', ['getAssetsList','getDefaultAsset']),
        ...mapGetters('orders', ['getOrderHistory','getOrderHistoryCount']),
    },
    mounted() {
       
     },
    methods: {
        humanDate,
        humanNumber,
        truncateNumber,
        sortObjectEntries,
        keyUp(event) {
            if (event.code == "Enter") {
                // this.loadOrders()
            }
        },

        
    },
}; 
</script>


<template>
    <div class="w-100 h-100 relative">
        <TradingVue ref="tradingvue" :data="chart" :legend-buttons="['display']" :width="width" :height="height"
        :title-txt="market.Pair+' 🔥'"
        :toolbar="true"
        :overlays="overlays"
        :color-back="colors.back"
        :color-grid="colors.grid"
        :color-text="colors.text"
        :color-cross="colors.cross"
        :color-candle-dw="colors.candle_dw"
        :color-wick-dw="colors.wick_dw"
        :color-title="colors.tvTitle">
       ></TradingVue>
       <span class="night-mode">
            <input type="checkbox" v-model="night">
            <label>Night Mode</label>
        </span>
    </div>
</template>

<style>
.night-mode {
    position: absolute;
    top: 15px;
    right: 80px;
    color: #888;
    font: 11px -apple-system,BlinkMacSystemFont,
        Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,
        Fira Sans,Droid Sans,Helvetica Neue,
        sans-serif
}
</style>

<script type="text/javascript">
    import Data from "@/data.json"
    import { mapGetters } from 'vuex';
    import {TradingVue, DataCube} from 'trading-vue-js'
    import { humanNumber, truncateNumber } from "@/common"
    import logoCrex24 from "@/assets/img/crex24.png";
    import logoBinance from "@/assets/img/binance.png";
    export default {
        props: ["market"],
        computed: {
            ...mapGetters('orderbooks', ['getOrderBook','orderBookCount','getSampleOrderBook']),
            colors() {
                return this.night ? {
                    back: '#121827',
                    grid: '#3e3e3e',
                    text: '#35a776',
                    cross: '#dd64ef',
                    candle_dw: '#e54077',
                    wick_dw: '#e54077'

                } : {
                    back: '#fff',
                    grid: '#eee',
                    text: '#333',
                    candle_dw: 'black',
                    wick_dw: 'black'
                }
            }
        },
        watch: {
            market: function (newMarket, oldMarket) {
                let timeStamp = Math.round(new Date().getTime()/1000);
                timeStamp -= timeStamp%60
                if(this.chart.get('chart.data')[0].length ==0){
                    timeStamp -= 60
                }
                
                if (newMarket.Pair !== oldMarket.Pair){
                    if (oldMarket.Pair !== "") {
                        this.chart.set('chart.data',
                        [timeStamp, newMarket.Open, newMarket.High, newMarket.Low, newMarket.Close,  newMarket.Volume])
                        // this.chart = new DataCube(Data)
                    }
                }

                this.chart.merge('chart.data', [
                    [timeStamp, newMarket.Open, newMarket.High, newMarket.Low, newMarket.Close,  newMarket.Volume]
                ])
                
            },
        },
        data() { return {
            buyPriceType:"", sellPriceType:"", logoCrex24, logoBinance, spreadIndexAsk:0, spreadIndexBid:0, lShowtrades: true, width:240, height:240,
            chart: new DataCube(Data),
            overlays: [],
          	night: true
            
        }},
        created() { 
            this.defaultOrderbook = {
                Pair : "",
                BaseAsset: "***",
                QuoteAsset: "***",
                Exchange: "***",
                AsksTotal: 0,
                BidsTotal: 0,
                Asks: [{Price:0,Quantity:0,Total:0}],
                Bids: [{Price:0,Quantity:0,Total:0}]
            }
        },
        methods: {
            humanNumber,
            truncateNumber,

            onResize(event) {
                let positionInfo = this.$el.getBoundingClientRect()
                this.width = positionInfo.width
                this.height = positionInfo.height
            }

        },
        components: { TradingVue, },
        updated(){
            this.$nextTick(function () {
                // this.onResize()
                // console.log(this.dc) // -> ohlcv data [ ... ]
            })
        },
        mounted() {  
            this.$nextTick(function () {
                this.onResize()
            })
            window.addEventListener('resize', this.onResize)
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.onResize)
        },

    };
</script>

<template>
    <div class="cf center f7 w-100 ph1" style="max-width:460px">

        <p class="mv0 tl w-100 pa1 inline-flex items-end black"> 
            <span class="fl w-100 tc">
                TECHNICAL ANALYSIS FOR [{{ market.Pair }}]
            </span>
        </p>
        <p class="mv0 tl w-100 pa1 inline-flex items-end white" 
        :class="getTrendColor('')" > 
            <span class="fl w-50 tl">
                <b>{{ defaultInterval }}</b> is {{ getInterval("").Trend }}
            </span>
            <span class="fl w-50 tr">
                RSI: {{getInterval("").RSI }}
            </span>
        </p>

        
        <div key="orderBookCount" class="fl w-100">
          <div class="flex flex-row w-100 fl br--left br--right bg-black-10 white f7 relative">
            <div @click="setInterval('1m')" class="pointer tc pa1 w-20 z-2 fw6 " :class="getTrendColor('1m')"> 
                <small>1m <i v-if="defaultInterval=='1m'" class="fa fa-check"/></small> 
            </div>
            <div @click="setInterval('3m')" class="pointer tc pa1 w-20 z-2 fw6 " :class="getTrendColor('3m')"> 
                <small>3m <i v-if="defaultInterval=='3m'" class="fa fa-check"/></small> 
            </div>
            <div @click="setInterval('15m')" class="pointer tc pa1 w-20 z-2 fw6 " :class="getTrendColor('15m')"> 
                <small>5m <i v-if="defaultInterval=='15m'" class="fa fa-check"/></small> 
            </div>
            <div @click="setInterval('30m')" class="pointer tc pa1 w-20 z-2 fw6 " :class="getTrendColor('30m')"> 
                <small>15m <i v-if="defaultInterval=='30m'" class="fa fa-check"/></small> 
            </div>
            <div @click="setInterval('4h')" class="pointer tc pa1 w-20 z-2 fw6 " :class="getTrendColor('4h')"> 
                <small>4h <i v-if="defaultInterval=='4h'" class="fa fa-check"/></small> 
            </div>
            <div @click="setInterval('1d')" class="pointer tc pa1 w-20 z-2 fw6 " :class="getTrendColor('1d')"> 
                <small>1d <i v-if="defaultInterval=='1d'" class="fa fa-check"/></small> 
            </div>
          </div> 
          <div class="flex flex-row w-100 fl br--left br--right bb bl br b--black-10 f7">
              <div click="toggleBuyPriceType('open')"  class="b pointer tc pa1 w-10"> 
                  <small >SMA</small> 
              </div>
              <div click="toggleBuyPriceType('low')"  class="pointer tc pa1 w-20"> 
                  <small >TREND</small> 
              </div>
              <div click="toggleBuyPriceType('low')"  class="pointer tc pa1 w-20"> 
                  <small >ENTRY</small> 
              </div>
              <div click="toggleSellPriceType('high')" class="pointer tc pa1 w-20"> 
                  <small >SUPPORT</small> 
              </div>
              <div click="toggleSellPriceType('close')" class="pointer tc pa1 w-10"> 
                  <small >SPREAD</small> 
              </div>
              <div click="toggleSellPriceType('close')" class="pointer tc pa1 w-20"> 
                  <small >RESISTANCE</small> 
              </div>
          </div>
          <div class="flex flex-row w-100 fl br--left br--right bb bl br b--black-10 f7">
              <div click="toggleBuyPriceType('open')"  class="b pointer tc pa1 w-10"> 
                  <small >SMA10 </small> 
              </div>
              <div click="toggleBuyPriceType('low')"  class="ttu pointer tc pa1 w-20"> 
                  <small > {{ getInterval("").SMA10.Trend  }}
                    <i v-if="getInterval('').SMA10.Trend=='Bullish'" class="fa fa-arrow-alt-up green" /> 
                    <i v-if="getInterval('').SMA10.Trend=='Bearish'" class="fa fa-arrow-alt-down red" /> 
                  </small> 
              </div>
              <div class="pointer tc pa1 w-20 "> <small> {{getInterval("").SMA10.Entry }}</small> </div>
              <div class="pointer tc pa1 w-20 "> <small> {{getInterval("").SMA10.Support}}</small> </div>
              <div click="toggleSellPriceType('high')" class="pointer tc pa1 w-10"> 
                  <small >{{getInterval("").SMA10.Spread}}</small> 
              </div>
              <div click="toggleSellPriceType('close')" class="pointer tc pa1 w-20 "> 
                  <small >{{getInterval("").SMA10.Resistance}}</small> 
              </div>
          </div>
          <div class="flex flex-row w-100 fl br--left br--right bb bl br b--black-10 f7">
              <div click="toggleBuyPriceType('open')"  class="b pointer tc pa1 w-10"> 
                  <small >SMA20 </small> 
              </div>
              <div click="toggleBuyPriceType('low')"  class="ttu pointer tc pa1 w-20"> 
                  <small > {{ getInterval("").SMA20.Trend }}  
                    <i v-if="getInterval('').SMA20.Trend=='Bullish'" class="fa fa-arrow-alt-up green" /> 
                    <i v-if="getInterval('').SMA20.Trend=='Bearish'" class="fa fa-arrow-alt-down red" /> 
                </small> 
              </div>
              <div class="pointer tc pa1 w-20 "> <small> {{getInterval("").SMA20.Entry }}</small> </div>
              <div class="pointer tc pa1 w-20 "> <small> {{getInterval("").SMA20.Support}}</small> </div>
              <div click="toggleSellPriceType('high')" class="pointer tc pa1 w-10"> 
                  <small >{{getInterval("").SMA20.Spread}}</small> 
              </div>
              <div click="toggleSellPriceType('close')" class="pointer tc pa1 w-20 "> 
                  <small >{{getInterval("").SMA20.Resistance}}</small> 
              </div>
          </div> 
          <div class="flex flex-row w-100 fl br--left br--right bb bl br b--black-10 f7">
              <div click="toggleBuyPriceType('open')"  class="b pointer tc pa1 w-10"> 
                  <small >SMA50 </small> 
              </div>
              <div click="toggleBuyPriceType('low')"  class="ttu pointer tc pa1 w-20"> 
                  <small > {{ getInterval("").SMA50.Trend  }}
                    <i v-if="getInterval('').SMA50.Trend=='Bullish'" class="fa fa-arrow-alt-up green" /> 
                    <i v-if="getInterval('').SMA50.Trend=='Bearish'" class="fa fa-arrow-alt-down red" /> 
                  </small> 
              </div>
              <div class="pointer tc pa1 w-20 "> <small> {{getInterval("").SMA50.Entry }}</small> </div>
              <div class="pointer tc pa1 w-20 "> <small> {{getInterval("").SMA50.Support}}</small> </div>
              <div click="toggleSellPriceType('high')" class="pointer tc pa1 w-10"> 
                  <small >{{getInterval("").SMA50.Spread}}</small> 
              </div>
              <div click="toggleSellPriceType('close')" class="pointer tc pa1 w-20 "> 
                  <small >{{getInterval("").SMA50.Resistance}}</small> 
              </div>
          </div>
          <div class="flex flex-row w-100 fl br--left br--right f7 relative">
              <p class="mv0 tl w-100 pv1 inline-flex items-end" > 
                <span class="fl w-100 tc">
                    FIBONACCI RETRACEMENT LEVELS
                </span>
            </p>
          </div>
          <div class="flex flex-row w-100 fl br--left br--right bg-black-10 black f7 relative">
              <div class="tc pa1 w-20 z-2 fw6 "> <small>0.236</small> </div>
              <div class="tc pa1 w-20 z-2 fw6 "> <small>0.382</small> </div>
              <div class="tc pa1 w-20 z-2 fw6 "> <small>0.500</small> </div>
              <div class="tc pa1 w-20 z-2 fw6 "> <small>0.618</small> </div>
              <div class="tc pa1 w-20 z-2 fw6 "> <small>0.786</small> </div>
          </div> 
          <div class="flex flex-row w-100 fl br--left br--right f7 relative bb bl br b--black-10">
              <div class="tc pa1 w-20 black z-2 fw6 "> <small>{{getInterval("").RetracementLevels["0.236"]}}</small> </div>
              <div class="tc pa1 w-20 black z-2 fw6 "> <small>{{getInterval("").RetracementLevels["0.382"]}}</small> </div>
              <div class="tc pa1 w-20 black z-2 fw6 "> <small>{{getInterval("").RetracementLevels["0.500"]}}</small> </div>
              <div class="tc pa1 w-20 black z-2 fw6 "> <small>{{getInterval("").RetracementLevels["0.618"]}}</small> </div>
              <div class="tc pa1 w-20 black z-2 fw6 "> <small>{{getInterval("").RetracementLevels["0.786"]}}</small> </div>
          </div> 
        </div>
    </div>
</template>


<script type="text/javascript">
    import { mapGetters } from 'vuex';
    import { humanNumber, truncateNumber } from "@/common"
    import logoCrex24 from "@/assets/img/crex24.png";
    import logoBinance from "@/assets/img/binance.png";

    export default {
        props: ["market"],
        computed: {
            ...mapGetters('analysis', ['getAllAnalysis',]),
        },
        data() { return {
            logoCrex24, logoBinance, defaultInterval:"",
        }},
        created() { 
            if (this.defaultInterval == "") {
                this.setInterval("1m")
            }
        },
        methods: {
            humanNumber,
            truncateNumber,
            getInterval(interval) {
                if (interval == "") {
                    interval = this.defaultInterval
                }
                if (this.getAllAnalysis[this.market.Pair].Intervals[interval] !== undefined && this.getAllAnalysis[this.market.Pair].Intervals[interval] !== null) {
                    return this.getAllAnalysis[this.market.Pair].Intervals[interval]
                } 

                var sma = {
                    "Trend": "", "Support": 0,
                    "Resistance": 0, "Spread": 0,
                    "Entry": 0, "StopLoss": 0, "TakeProfit": 0
                }

                return {
                    "Timeframe": "", "Trend": "", "RSI": 0,
                    "BollingerBands": { "lower": 0, "middle": 0, "upper": 0, },
                    "SMA10": sma, "SMA20": sma, "SMA50": sma,
                    "RetracementLevels": { "0.236": 0, "0.382": 0, "0.500": 0, "0.618": 0, "0.786": 0, }    
                }
            },
            getTrendColor(interval) {

                var color = "";
                switch (this.getInterval(interval).Trend) {
                    case "Strong Bullish":
                        color = "bg-dark-green";
                        break;
                    case "Bullish":
                        color = "bg-green";
                        break;
                    case "Bearish":
                        color = "bg-red";
                        break;
                    case "Strong Bearish":
                        color = "bg-dark-red";
                        break;
                    default:
                        color  = "bg-blue";
                        break;
                }
                return color
            },
            setInterval(interval) {
                this.defaultInterval = interval
            },
            toggleBuyPriceType(pricetype) {
                this.$parent.buyPriceType = (this.$parent.buyPriceType==pricetype) ? "" : pricetype
            },
            toggleSellPriceType(pricetype) {
                this.$parent.sellPriceType = (this.$parent.sellPriceType==pricetype) ? "" : pricetype
            },
        },
        components: { },
        mounted() {  
            this.$store.dispatch('analysis/connectWebsocket');
        },
        beforeDestroy() { 
            // this.$store.dispatch('analysis/disconnectWebsocket');
        },
    };
</script>

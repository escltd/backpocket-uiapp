<template>
  <section class="flex flex-column w-100 vh-100">
    <siteheader page="assets" />
        
    <div  class="cf w-100 h-100 overflow-scroll">
        <div class="ph4-l ph2 cf mw8 center">
            <div class="fl w-100">
                
                <div class="fl w-100 pb3">
                    <div class="w-auto pv2 fl">
                        Crypto and Fiat Assets
                    </div>
                    <div class="w-auto pv2 fr">
                        <span class="fl br2 pv1 pointer ph2 tracked bg-light-yellow black flex items-center f7"> 
                            Deposit
                        </span>

                        <span class="fl mh3 br2 pv1 pointer ph2 tracked bg-white-10  flex items-center f7"> 
                            Withdraw
                        </span>

                        <span class="fl br2 pv1 pointer ph2 tracked bg-white-10  flex items-center f7"> 
                            Transfer
                        </span>

                        <span class="ml2 fr br2 pt3 pointer ph2 tracked flex underline washed-yellow f7"> 
                            <small>Transaction History</small>
                        </span>
                    </div>
                </div>

                <div class="ph3-l pv2 fl w-100 bg-white-10 white-90 br1 f7">
                    <div class="fl w-25-l w-50 pa2">
                        <p class="mv0"> Crypto and Fiat balance</p>
                        <p class="mv1"> <span class="f3">0</span> <small>BTC</small></p>
                        <p class="mv0 white-70">≈ $0</p>
                    </div>

                    <div class="fl w-25-l w-50 pa2">
                        <p class="mv0"> Crypto balance</p>
                        <p class="mv1"> <span class="f3">0</span> <small>BTC</small></p>
                        <p class="mv0 white-70">≈ $0</p>
                    </div>
                    
                    <div class="fl w-25-l w-50 pa2">
                        <p class="mv0"> Fiat balance</p>
                        <p class="mv1"> <span class="f3">0</span> <small>BTC</small></p>
                        <p class="mv0 white-70">≈ $0</p>
                    </div>

                    <div class="fl w-25-l w-50 pa2">
                        <p class="mv0"> Today's PNL</p>
                        <p class="mv1"> <span class="f3">+$100</span> <small class="ml1 pa1 ba b--white-30"><small>PNL Analysis</small></small></p>
                        <p class="mv0 white-70">+2.92%</p>
                    </div>
                </div>
            </div>

            <div class="flex flex-wrap w-100">
                <div class="pv2  ">
                    <label class="fl w-100 pb1 f7"></label>
                    <span class="w-100 flex items-center">
                        <input class="w4 pa2 pb1 f7 fw6 bn br2 bg-white-10 white-70" placeholder="Coin" @keyup="searchAssets" v-model="Symbol" type="text"/>
                        <span class="white-50 pl1">
                            <i class="fa fa-search f6" @click="searchAssets" />
                        </span>
                    </span>


                </div>
                
            </div>
        </div>

        
        <div class="mw8 cf center w-100 ph4-l ph2 f7 pb2">
            <div class="flex flex-row w-100 fl br3 br--left br--right bg-white-10">
                <div class="tl pa2 w-10-l w-20 br bl b--white-10">Coin</div>
                <div class="tr pa2 w-20-l w-40 br b--white-10">Total</div>
                <div class="tr pa2 w-20-l w-40 br b--white-10">Available</div>
                <div class="tr pa2 w-20-l w-40 dn dib-ns br b--white-10">Locked</div>
                <div class="tr pa2 w-20 dn dib-l br b--white-10">BTC Value</div>
                <div class="tr pa2 w-20 dn dib-l br b--white-10">Action</div>
            </div>
            <div class="inline-flex flex-column w-100 fl bb b--white-10 vh-50 overflow-scroll">
                <div style="min-height:1.5rem" class="flex flex-row w-100 bl br bb b--white-10 white" v-for="(asset, index) in getValuableAssets()" :key="index">
                    <div class="tl pa2 w-10-l w-20 "> 
                        {{asset.Symbol}}
                    </div>

                    <div class="tr pa2 w-20-l w-40 ">
                        {{humanNumber(truncateNumber(asset.Free + asset.Locked))}}
                    </div>
                    <div class="tr pa2 w-20-l w-40 ">
                        {{humanNumber(truncateNumber(asset.Free))}}
                    </div>
                    <div class="tr pa2 w-20-l w-40 dn dib-ns ">
                        {{humanNumber(truncateNumber(asset.Locked))}}
                    </div>
                    <div class="tr pa2 w-20 dn dib-l ">
                        0.00
                    </div>
                    <div class="tc pa2 w-20 dn dib-l  light-yellow "> 
                        <small class="w-third"> Deposit</small>
                        <small class="w-third ph3"> Withdraw</small>
                        <small class="w-third"> Transfer</small>
                    </div>
                </div>
                <div style="min-height:1.5rem" class="flex flex-row w-100 bl br bb b--white-10 white-30" v-for="(asset, index) in getEmptyAssets()" :key="getValuableAssets()+index">
                    <div class="tl pa2 w-10-l w-20"> 
                        {{asset.Symbol}}
                    </div>

                    <div class="tr pa2 w-20-l w-40 ">
                        {{humanNumber(truncateNumber(asset.Free + asset.Locked))}}
                    </div>
                    <div class="tr pa2 w-20-l w-40 ">
                        {{humanNumber(truncateNumber(asset.Free))}}
                    </div>
                    <div class="tr pa2 w-20-l w-40 dn dib-ns ">
                        {{humanNumber(truncateNumber(asset.Locked))}}
                    </div>
                    <div class="tr pa2 w-20 dn dib-l ">
                        0.00
                    </div>
                    <div class="tc pa2 w-20 dn dib-l  light-yellow "> 
                        <small class="w-third"> Deposit</small>
                        <small class="w-third ph3"> Withdraw</small>
                        <small class="w-third"> Transfer</small>
                    </div>
                </div>
            </div>
        </div>
    </div>

  </section>
</template>

<script type="text/javascript">
import { mapState, mapGetters } from 'vuex';
import { HTTP, humanNumber, humanDate, truncateNumber, sortObjectEntries } from "@/common";
import siteheader from "@/components/generic/siteheader";


export default {
    components: { siteheader, },
    data() { return {
        lLoading: true, notifications: [],  Symbol:"", 
    }},
    computed: {
        ...mapGetters('assets', ['getSearchList']),
    },
    mounted() {
        setTimeout(this.searchAssets, 500);
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
        getValuableAssets() {
            var assetsList = []
            var allAssetsList = this.getSearchList
            for (var symbol in allAssetsList) {
                if(parseFloat(allAssetsList[symbol].Free) > 0) {
                    assetsList.push(allAssetsList[symbol])
                }
            }
            return assetsList
        },
        getEmptyAssets() {
            var emptyAssetsList = []
            var allAssetsList = this.getSearchList
            for (var symbol in allAssetsList) {
                if(parseFloat(allAssetsList[symbol].Free) == 0.00) {
                    emptyAssetsList.push(allAssetsList[symbol])
                }
            }
            return emptyAssetsList
        },
        searchAssets() {
            if (this.Symbol.length > 1 || this.Symbol.length == "") {
                this.$store.dispatch('assets/searchAssets', {Symbol: this.Symbol}) 
            }
        },
        
    },
}; 
</script>


<template>
    <div class="cf w-100 h-100 overflow-scroll">
        <div v-if="notifications.length>0" class="w-100 vh-100 bg-black-20 z-max absolute top-0 left-0"  @click="closeNotification">
            <div class="w-100 dt vh-50">
                <div class="dtc tc w-100 v-mid pa2">
                    <div class="cf card-background dark-gray br1 center items-center flex flex-column w-100 pa2 " style="max-width:360px">
                        <span class="w-100" @click="closeNotification">
                            <span class="w-100 f7">  <i class="fa fa-bell"/> Notification  <i class="fr fa fa-times red pointer" /> </span>
                            <small>
                                <p v-for="(message, index) in notifications" :key="index" class="mv1 pv0 f6">{{message}}</p>
                            </small>
                        </span>
                        <small class="pt2 black w-100 cf mb2" v-if="lShowOverrideBuy || lShowOverrideSell">
                            <span v-if="lShowOverrideBuy" class="pa2 bg-red pointer" @click="notifications=[],lOverrideBuy=true,buyOrder()" > buy at a loss </span>
                            <span v-else class="pa2 bg-red pointer" @click="notifications=[],lOverrideSell=true,sellOrder()" > sell at a loss </span>
                        </small>
                    </div>
                </div>
            </div>
        </div>

        <div class="h-100 dt w-100 center">
            <div class="dtc tc near-black ph2-l ph1 flex-l mw8 center pb2" >

                <div class="cf center">
                    <marketranking :market="market" />

                    <div class="cf center card-marketpair br3 f5-ns f6 w-100 mt1 dn db-l" style="height:25.25rem">
                        <small class="w-100 fl br4 br--bottom mt1">
                            <div class="fl w-100 pb1">
                                <span class="w-30 fl tl f7 dark-gray"> 
                                    <small> Start Date:<br/><input class="bn ph1 br2 bg-black-10 dark-gray" type="date" @change="searchMarketPairOrders" v-model="startDate" /> </small>
                                </span>
                                <span class="w-40 fl tc f7 dark-gray pointer" @click="searchMarketPairOrders()"> 
                                    {{market.BaseAsset}} / {{market.QuoteAsset}}<br/>
                                    Order History <small><i class=" fa fa-redo" /> </small>
                                </span>
                                <span class="w-30 fr tr f7 dark-gray" > 
                                    <small> Stop Date:<br/><input class="bn ph1 br2 bg-black-10 dark-gray" type="date" @change="searchMarketPairOrders" v-model="stopDate" /></small>
                                </span>
                            </div>

                            <marketorder :market="market" @updateBuyQty="updateBuyQty" @updateSellQty="updateSellQty"
                            @updateBuyAmount="updateBuyAmount" @updateSellAmount="updateSellAmount"
                            @updateBuyPrice="updateBuyPrice" @updateSellPrice="updateSellPrice" /> 
                        </small>
                        <div class="w-100 f7">
                            <div class="w-100 flex tc black-50">
                                <div class="w-50 pt1 tl fw6"> 
                                    <small> 
                                        {{market.QuoteAsset}} PnL: <span :class="{'green':truncateNumber(totalPnL-totalFees)>0,'red':truncateNumber(totalPnL-totalFees)<0,}" > 
                                         {{truncateNumber(totalPnL-totalFees)}} </span>
                                    </small>
                                </div>        
                                <div class="fl w1 pt1 tc fw6"> 
                                    <span class="fl w-100 tc">
                                        <i class="fa fa-chevron-up center pointer" @click="lDropdown=!lDropdown" />
                                    </span>
                                </div>
                                <div class="w-50 pt1 tr fw6"> 
                                    <small class="db">{{market.QuoteAsset}} Fees: {{truncateNumber(totalFees)}}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                
                <div class="cf center">
                    <orderbook :market="market" @updateBuyPrice="updateBuyPrice" @updateSellPrice="updateSellPrice" />
                    <analysis :market="market" @updateBuyPrice="updateBuyPrice" @updateSellPrice="updateSellPrice" />

                   <div class="cf center card-marketpair br3 f5-ns f6 w-100 mt1">

                        <div class="flex  w-100 pb3">
                            <div class="w-40 tl f7 black-30" :class="{'black':stoplossPercent>0}">
                                <i class="fas pointer" :class="{'fa-toggle-on ': stoplossPercent>0, 'fa-toggle-off': stoplossPercent<=0}" /> 
                                <select v-model="stoplossPercent"  style="" class=" dib bn  bg-transparent dark-gray" :class="{'black':stoplossPercent>0}"> 
                                    <option class="bg-background" :class="{'selected':0.00 == number}" v-for="(number, index) in stopLossPercentArray" :key="index" :value="number" >{{number}}% Stop Loss</option>
                                </select>
                            </div>
                            <div class="w-25 tc f7 black-30" :class="{'black':neworder.AutoRepeat>0}">
                                
                                <span @click="neworder.AutoRepeat=(neworder.AutoRepeat>0)?0:50"> 
                                    AUTO 
                                    <i class="fas pointer fa-rotate-90 " :class="{'fa-toggle-on ': neworder.AutoRepeat>0, 'fa-toggle-off': neworder.AutoRepeat<=0}" /> 
                                    TRADE
                                </span>
                                
                            </div>
                            <div class="w-40 tr f7 black-30" :class="{'black':takeprofitPercent>0}"> 
                                <select dir="rtl" v-model="takeprofitPercent"  style="" class="tr dib bn bg-transparent dark-gray" :class="{'black':takeprofitPercent>0}"> 
                                    <option class="bg-background" dir="ltr" v-for="number in takeProfitPercentArray" :key="number" :value="number" > {{number}}%  Take Profit </option>
                                </select>
                                <i class="fas pointer" :class="{'fa-toggle-on ': takeprofitPercent>0, 'fa-toggle-off': takeprofitPercent<=0}" />
                            </div>
                        </div>

                        <span class="fl tc f4-ns f5 black " style="width:2.5rem">
                            {{fancyTimeFormat(totalSeconds)}}<span class="w-100 db f7"> <small>seconds</small> </span> 
                        </span>
                        
                        <enabledmarkets :market="market" :enabledmarkets="enabledmarkets" />
                        
                
                        <div class="fl w-100 pt2 tc inline-flex flex-row items-center">
                            <span class="w-25">
                                <div class="tc cf w-100 pa2 fw6 pointer br2 ttu" :class="{'ba b--light-gray bg-green light-gray heartbeat':activateBuy(),'bg-near-white ba b--light-gray ':!activateBuy()}" @click="buyOrder">
                                    BUY <br/> <small><small>{{market.BaseAsset}}</small></small>
                                </div>
                            </span>
                            <span class="w-50 relative orange pt1">
                                    
                                <small class="pointer" click="buyPriceType = (buyPriceType=='marketprice') ? '' : 'marketprice',sellPriceType = (sellPriceType=='marketprice') ? '' : 'marketprice'">

                                    <span @click="neworder.SellPrice = truncateNumber(market.MiddleBand,getDecimalPlaces()), updateQtyBaseSell(), sellPriceType = ''" v-if="market.Price < market.MiddleBand" class="db"><small>MB:</small> {{truncateNumber(market.MiddleBand, getDecimalPlaces())}}</span>
                                    <span @click="neworder.SellPrice = truncateNumber(market.UpperBand,getDecimalPlaces()), updateQtyBaseSell(), sellPriceType = ''" v-else class="db" :class="{'black':market.Price < market.UpperBand, 'green':market.Price > market.UpperBand}"><small>UB:</small> {{truncateNumber(market.UpperBand, getDecimalPlaces())}}</span>
                                    

                                    <small v-if="market.Price > market.MiddleBand">
                                        <i class=" fa fa-arrow-alt-up " :class="{'black':market.Price < market.UpperBand, 'dark-green':market.Price > market.UpperBand, 'heartbeat-faster f5':(((market.UpperBand - market.Price)/market.UpperBand)*100) < 0.066}" />
                                        <i class=" fa fa-arrow-alt-up " :class="{'black':market.Price < market.UpperBand, 'dark-green':market.Price > market.UpperBand, 'heartbeat-faster f5':(((market.UpperBand - market.Price)/market.UpperBand)*100) < 0.066}" />
                                        <i class=" fa fa-arrow-alt-up " :class="{'black':market.Price < market.UpperBand, 'dark-green':market.Price > market.UpperBand, 'heartbeat-faster f5':(((market.UpperBand - market.Price)/market.UpperBand)*100) < 0.066}" />
                                        <i class=" fa fa-arrow-alt-up " :class="{'black':market.Price < market.UpperBand, 'dark-green':market.Price > market.UpperBand, 'heartbeat-faster f5':(((market.UpperBand - market.Price)/market.UpperBand)*100) < 0.066}" />
                                    </small>

                                    <small class="db" v-if="market.Price == market.MiddleBand"> ~~ == ~~ </small>

                                    <small v-if="market.Price < market.MiddleBand">
                                        <i class=" fa fa-arrow-alt-down " :class="{'black':market.Price > market.LowerBand, 'dark-red':market.Price < market.LowerBand, 'heartbeat-faster f5':(((market.Price - market.LowerBand)/market.LowerBand)*100) < 0.066}" />
                                        <i class=" fa fa-arrow-alt-down " :class="{'black':market.Price > market.LowerBand, 'dark-red':market.Price < market.LowerBand, 'heartbeat-faster f5':(((market.Price - market.LowerBand)/market.LowerBand)*100) < 0.066}" />
                                        <i class=" fa fa-arrow-alt-down " :class="{'black':market.Price > market.LowerBand, 'dark-red':market.Price < market.LowerBand, 'heartbeat-faster f5':(((market.Price - market.LowerBand)/market.LowerBand)*100) < 0.066}" />
                                        <i class=" fa fa-arrow-alt-down " :class="{'black':market.Price > market.LowerBand, 'dark-red':market.Price < market.LowerBand, 'heartbeat-faster f5':(((market.Price - market.LowerBand)/market.LowerBand)*100) < 0.066}" />
                                    </small>

                                    
                                    <span @click="neworder.BuyPrice = truncateNumber(market.MiddleBand,getDecimalPlaces()), updateQtyBaseBuy(), buyPriceType = ''" v-if="market.Price > market.MiddleBand" class="db"><small>MB:</small> {{truncateNumber(market.MiddleBand, getDecimalPlaces())}}</span>
                                    <span @click="neworder.BuyPrice = truncateNumber(market.LowerBand,getDecimalPlaces()), updateQtyBaseBuy(), buyPriceType = ''" v-else class="db" :class="{'black':market.Price > market.LowerBand, 'red':market.Price < market.LowerBand}"><small>LB:</small> {{truncateNumber(market.LowerBand, getDecimalPlaces())}}</span>
                                    
                                </small>
                            
                            </span>
                            <span class="w-25">
                                <div class="tc cf w-100 pa2 fw6 pointer br2 ttu" :class="{'ba b--light-gray heartbeat bg-red light-gray':activateSell(),'bg-near-white ba b--light-gray ':!activateSell()}" @click="sellOrder">
                                    SELL <br/> <small><small>{{market.BaseAsset}}</small></small>
                                </div>
                            </span>
                        </div>

                        <div class="f7 pt1 flex fl w-100 tl gray">
                            <div class="w-40 ph1 tl pointer" @click="updateBuyPrice(truncateNumber(market.LowPrice, 5)),buyPriceType=''"><small class="i db">(24hr low)</small> {{truncateNumber(market.LowPrice)}} </div>
                            <div class="w-25 ph1 tc" :class="{'green':market.PriceChangePercent>0,'red':market.PriceChangePercent<0}"> 
                                <small class="i dn">(% change)</small> 
                                <small class="db black" :class="{'green':market.RSI>65,'red':market.RSI<35}">
                                {{ truncateNumber(market.RSI,2) }} RSI
                                 </small>
                                <small>
                                <i class="fa" :class="{'dark-green fa-arrow-alt-up':marketDirection(market),'dark-red fa-arrow-alt-down':!marketDirection(market)}"/>
                                {{market.PriceChangePercent}} %</small> </div> 
                            <div class="w-40 ph1 tr pointer" @click="updateSellPrice(truncateNumber(market.HighPrice, 5)),sellPriceType=''"> <small class="i db">(24hr high)</small> {{truncateNumber(market.HighPrice)}} </div>
                        </div>

                        <div class="fl w-100 br2 br--top tc pb1">
                            <div class="fl w-40  pt0 tl">
                                <input class="ph3 pv2 br2 br2 br--left bn w-100 tl" :class="{' dark-green':market.Price<=neworder.BuyPrice && neworder.BuyPrice !== 0,'bg-black-10 near-black':market.Price>neworder.BuyPrice || neworder.BuyPrice == 0}" type="number" @change="updateQtyBaseBuy" @keyup="updateQtyBaseBuy" v-model="neworder.BuyPrice"/>
                            </div>
                            <div class="fl w-20  pt0 tc">
                                <div class="ph1 pv2 br0 bn w-100 tc bg-light-gray pointer near-black fw6" @click="neworder.BuyPrice=neworder.SellPrice=truncateNumber(market.Price)">
                                    PRICE
                                </div>                            
                            </div>
                            <div class="fl w-40  pt0 tr">
                                <input class="ph3 pv2 br2 br--right bn w-100 tr" :class="{' dark-red':market.Price>=neworder.SellPrice && neworder.SellPrice !== 0,'bg-black-10 near-black':market.Price<neworder.SellPrice || neworder.SellPrice == 0}" type="number" @change="updateQtyBaseSell" @keyup="updateQtyBaseSell" v-model="neworder.SellPrice"/>
                            </div>
                        </div>

                        <div class="f7 flex fl w-100 tl orange" style="">
                            <div class="w-40 ph1 tl green">
                                <span @click="updateBuyPrice(truncateNumber(averagePrice-(market.TickSize*2),getDecimalPlaces())),buyPriceType=''">
                                    <i class="fa fa-arrow-alt-down f7"/> {{truncateNumber(averagePrice)}} <small class="i orange db">(buy below)</small>
                                </span>
                            </div> 
                            <div class="w-30 w-20-ns ph1 tc"> 
                                {{(((averagePrice - averagePrice)/averagePrice) * 100).toFixed(4)}}% 
                                <small class="black db w-100">market maker</small>
                            </div>
                             <div class="w-40 ph1 tr red">  
                                <span @click="updateSellPrice(truncateNumber(averagePrice+(market.TickSize*2),getDecimalPlaces())),sellPriceType=''">
                                    <i class="fa fa-arrow-alt-up f7"/> {{truncateNumber(averagePrice)}} <small class="i orange db">(sell above)</small>
                                </span>
                            </div>
                        </div>

                        <div class="fl w-100 br2 br--top tc f7 ">
                            <div class="fl w-40 pl1 inline-flex items-center pointer">
                                <i class="f7 black-20 fa fa-minus" @click="qtyBaseBuy=truncateNumber(qtyBaseSell-(market.StepSize * 10)), updateQtyBaseBuy()" />
                                <div class="w-70-ns w-60 center fl">
                                    <div @click="setQtyBaseBuyPercent(25)" class="bg-black-20 pa2 fl w-third-ns w-50 tc white"><small>25%</small></div>
                                    <div @click="setQtyBaseBuyPercent(50)" class="bg-black-50 pa2 fl w-third-ns w-50 tc white"><small>50%</small></div>
                                    <div @click="setQtyBaseBuyPercent(75)" class="bg-black pa2 fl w-third-ns w-50 white dn dib-ns"><small>75%</small></div>
                                </div>
                                <i class="f7 black fa fa-plus" @click="qtyBaseBuy=truncateNumber(qtyBaseSell+(market.StepSize * 10)), updateQtyBaseBuy()" />
                            </div>
                            <div class="fl w-20 ">
                                <span>
                                    <i @click="lMarketMaker=!lMarketMaker,neworder.AutoRepeat = (lMarketMaker)?0:0" class="fas pointer fa-rotate-90" :class="{'fa-toggle-on orange': lMarketMaker, 'fa-toggle-off ': !lMarketMaker}" /> 
                                    <small @click="marketSpread=1" class="db w-100">spread x{{marketSpread}} <br/>{{(((neworder.SellPrice - neworder.BuyPrice)/neworder.BuyPrice) * 100).toFixed(4)}}%</small>
                                </span>
                            </div>
                            <div class="fl w-40 pr1 inline-flex items-center pointer">
                                <i class="f7 black fa fa-plus" @click="qtyBaseSell=truncateNumber(qtyBaseSell+(market.StepSize * 10)), updateQtyBaseSell()" />
                                <div class="w-70-ns w-60 center fl">
                                    <div @click="setQtyBaseSellPercent(75)" class="bg-black pa2 fl w-third-ns w-50 tc white dn dib-ns"><small>75%</small></div>
                                    <div @click="setQtyBaseSellPercent(50)" class="bg-black-50 pa2 fl w-third-ns w-50 tc white"><small>50%</small></div>
                                    <div @click="setQtyBaseSellPercent(25)" class="bg-black-20 pa2 fl w-third-ns w-50 tc white"><small>25%</small></div>
                                </div>
                                <i class="f7 black-20 fa fa-minus" @click="qtyBaseSell=truncateNumber(qtyBaseSell-(market.StepSize * 10)), updateQtyBaseSell()" />
                            </div>
                        </div>
                        
                        <div class="fl w-100 br2 br--top tc">
                            <div class="fl w-40  pt2 tl">
                                <input class="ph3 pv2 br2 br--left bn w-100 tl bg-black-10 near-black" type="number" @change="updateQtyBaseBuy" @keyup="updateQtyBaseBuy" v-model="qtyBaseBuy">
                            </div>
                            <div class="fl w-20  pt2 tc">
                                <div class="ph1 pv2 br0 bn w-100 tc bg-light-gray pointer near-black fw6"   @click="marketSpread+=1,setQty()">
                                    <small><small>{{market.BaseAsset}}</small></small>
                                </div>
                            </div>
                            <div class="fl w-40  pt2 tr">
                                <input class="ph3 pv2 br2 br--right bn w-100 tr bg-black-10 near-black" type="number" @change="updateQtyBaseSell" @keyup="updateQtyBaseSell" v-model="qtyBaseSell">
                            </div>
                        </div>
                        
                        <div class="fl w-100 br2 br--top tc">
                            <div class="fl w-40  pt2 tl">
                                <input class="ph3 pv2 br2 br--left bn w-100 tl bg-black-10 near-black " type="number" readonly="readonly" :value="qtyQuoteBuy">
                            </div>                    
                            <div class="fl w-20  pt2 tc">
                                <div class="ph1 pv2 br0 bn w-100 tc bg-light-gray pointer near-black fw6" @click="qtyBaseBuy = qtyBaseSell = 0, updateQtyBaseBuy(), updateQtyBaseSell()"> <small><small>{{market.QuoteAsset}}</small></small> </div>
                            </div>
                            <div class="fl w-40  pt2 tr">
                                <input class="ph3 pv2 br2 br--right bn w-100 tr bg-black-10 near-black " type="number" readonly="readonly" :value="qtyQuoteSell">
                            </div>
                        </div>              
                        
                        <div class="fl w-100 flex tc pb0 mb0">
                            <div class="w-50 pt1 tl f6 fw6 ttu">
                                <span @click="setQtyBaseBuyPercent(100)">
                                    <small class="pointer"> {{truncateNumber(quoteFree).toString()}} {{market.QuoteAsset}}</small> 
                                    <small class="w-100 orange db pt1 tl fw6"> 
                                        <i class="fa fa-wallet" /> {{truncateNumber(Number(quoteFree) + (Number(market.Price) * Number(baseFree)) , 8)}}
                                    </small>
                                </span>
                            </div>        
                            <div class="fl w1 pt1 tc f6 fw6 ttu"> <span class="db fl w-100 tc pt3"><i v-if="!lDropdown" class="fa fa-chevron-down center pointer" @click="lDropdown=!lDropdown,searchMarketPairOrders()" /> </span> </div>
                            <div class="w-50 pt1 tr f6 fw6 ttu">
                                <span @click="setQtyBaseSellPercent(100)">
                                    <small class="pointer"> {{truncateNumber(baseFree).toString()}} {{market.BaseAsset}}</small> 
                                    <small class="w-100 orange db pt1 tr fw6"> 
                                        <i class="fa fa-wallet" /> {{truncateNumber(Number(baseFree) + (Number(quoteFree) / Number(market.Price) ), 8)}}
                                    </small>
                                </span>
                            </div>
                        </div>
                        <small :class="{'bounce-in db':lDropdown, 'dn':!lDropdown}">
                            <div class="flex w-100 pv1">
                                <span class="w-50 fl tl f7 dark-gray"> 
                                    <small> Start Date: <input class="bn ph1 br2 bg-black-10 dark-gray" type="date" @change="searchMarketPairOrders" v-model="startDate" /> </small>
                                </span>
                                <span class="w-10 ph1 fl tc f7 black-50 pointer" @click="searchMarketPairOrders()"> 
                                    <small><i class=" fa fa-redo" /> </small>
                                </span>
                                <span class="w-50 fr tr f7 dark-gray" > 
                                    <small> Stop Date: <input class="bn ph1 br2 bg-black-10 dark-gray" type="date" @change="searchMarketPairOrders" v-model="stopDate" /></small>
                                </span>
                            </div>
                            
                            <marketorder :market="market" @updateBuyQty="updateBuyQty" @updateSellQty="updateSellQty" @updateBuyPrice="updateBuyPrice" @updateSellPrice="updateSellPrice" /> 
                            
                        </small>
                        <div v-if="lDropdown" class="w-100 f7">
                            <div class="w-100 flex tc black-50">
                                <div class="w-50 pt1 tl fw6"> 
                                    <small> 
                                        {{market.QuoteAsset}} PnL: <span :class="{'green':(truncateNumber(totalPnL-totalFees))>0,'red':(truncateNumber(totalPnL-totalFees))<0,}" > 
                                         {{truncateNumber(totalPnL-totalFees)}} </span>
                                    </small>
                                </div>        
                                <div class="fl w1 pt1 tc fw6"> 
                                    <span class="fl w-100 tc">
                                        <i class="fa fa-chevron-up center pointer" @click="lDropdown=!lDropdown" /> 
                                    </span>
                                </div>
                                <div class="w-50 pt1 tr fw6"> 
                                    <small class="db">{{market.QuoteAsset}} Fees: {{truncateNumber(totalFees)}}</small> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

              
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
import { mapGetters } from 'vuex';


import { humanNumber, humanDate, truncateNumber, sortObjectEntries} from "@/common";
import siteheader from "@/components/generic/siteheader";

import analysis from "@/components/generic/analysis";
import orderbook from "@/components/generic/orderbook";
import tradingvue from "@/components/generic/tradingvue";
import marketorder from "@/components/generic/marketorder";
import marketranking from "@/components/generic/marketranking";
import enabledmarkets from "@/components/generic/enabledmarkets.vue";

export default {
    props:["market", "enabledmarkets"],
    computed: {
        ...mapGetters('assets', ['getAssetsList']),
        ...mapGetters('orderbooks', ['getOrderBook']),
        ...mapGetters('notifications', ['getNotificationsList']),
    },
    watch: {
        // whenever market changes, this function will run
        market: function (newMarket, oldMarket) {
            if (newMarket.Pair !== oldMarket.Pair) {
                this.resetMarket()
                // this.rankAsset = ""
                this.searchMarketPairOrders()
                
                if (newMarket.Stoploss > 0) {
                    this.stoplossPercent = newMarket.Stoploss
                }

                if (newMarket.Takeprofit > 0) {
                    this.takeprofitPercent = newMarket.Takeprofit
                }
            }
            if (newMarket.Closed == 1) {
                this.marketSpread=0;
                this.lastClose = newMarket.Close;
                // this.buyPriceType= this.sellPriceType='';
                // this.neworder.BuyPrice = truncateNumber(this.market.Price-(this.market.TickSize)), this.neworder.SellPrice = truncateNumber(this.market.Price+(this.market.TickSize));
                this.startTimer();
            }
            this.baseFree = this.getAssetBalance(newMarket.BaseAsset)
            this.quoteFree = this.getAssetBalance(newMarket.QuoteAsset)
        },
        getNotificationsList: function(newNotificationsList, oldNotificationsList) {
            // getNotificationsList
            if (newNotificationsList.length > 0) {
                var notification = newNotificationsList.pop()
                this.notifications.push(notification.Title)
                this.notifications.push(notification.Message)

                clearTimeout(this.notifyTimeout)
                this.$store.dispatch('notifications/clrNotifications');
                // this.notifyTimeout = setTimeout(this.closeNotification, 15000);
            } 
        }
    },
    components: { siteheader, analysis, orderbook, tradingvue, marketorder, marketranking, enabledmarkets },
    data() { return {
        notifyTimeout:{}, notifications:[], lDropdown: false, lMarketMaker: false, marketSpread:0,
        lShowoveridebuy:false, lShowOverrideBuy:false, lShowOverrideSell:false, lOverrideSell: false, 

        lastClose:0, 
        
        stopLossPercentArray:[], takeProfitPercentArray:[], stoplossPercent:0, takeprofitPercent:0, 

        buyPriceType:"", sellPriceType:"", counterStatus:"", counterInterval:{}, tradeSeconds:0, totalSeconds:0, 

        totalPnL: 0, totalFees: 0, totalBase: 0, totalQuote: 0, averagePrice: 0, 

        qtyBaseBuy:0, qtyBaseSell:0, qtyQuoteBuy:0, qtyQuoteSell:0, neworder: { Price:0, BuyPrice:0, SellPrice:0, Fee:0, AutoRepeat:0},
        showMarketPairs: false, baseFree:0, quoteFree:0,

        startDate: new Date().toJSON().slice(0,10), stopDate: new Date().toJSON().slice(0,10),

    }},
    created() {
        this.resetMarket()

        var maxPercentStoploss = 1;
        var incrementStoploss = 0.0125;
        var maxIncrementStoploss = 80;
    
        this.stopLossPercentArray = [0.00];
        for (var i = 0; i <= maxPercentStoploss ; i++) {
            if (i > 0) {
                incrementStoploss = 1
                maxIncrementStoploss = 15
                // incrementStoploss = incrementStoploss * 4
                // maxIncrementStoploss = maxIncrementStoploss / 4
            }
            for (var x = 1; x <= maxIncrementStoploss; x++) {
                if (i==0 && x < 6) {
                    continue
                }
                this.stopLossPercentArray.push(parseFloat( (i + (x*incrementStoploss)).toFixed(3) ) )
            }
        }

        var maxPercentTakeprofit = 1;
        var incrementTakeprofit = 0.0125;
        var maxIncrementTakeprofit = 80;
        
        this.takeProfitPercentArray = [0.00,];
        for (var i = 0; i <= maxPercentTakeprofit ; i++) {
            if (i > 0) {
                incrementTakeprofit = 1
                maxIncrementTakeprofit = 15
                // incrementTakeprofit = incrementTakeprofit * 4
                // maxIncrementTakeprofit = maxIncrementTakeprofit / 4
            }
            for (var x = 1; x <= maxIncrementTakeprofit; x++) {
                if (i==0 && x < 6) {
                    continue
                }
                this.takeProfitPercentArray.push(  parseFloat( (i + (x*incrementTakeprofit)).toFixed(3) ) )
            }
        }
    },
    mounted() {
        const today = new Date()
        const stopDate = new Date()
        const startDate = new Date()

        startDate.setDate(today.getDate()-90)
        this.startDate = startDate.toJSON().slice(0,10)

        stopDate.setDate(today.getDate()+1)
        this.stopDate = stopDate.toJSON().slice(0,10)
    },
    methods: {
        humanDate,
        humanNumber,
        truncateNumber,
        sortObjectEntries,
        keyUp(event) {
            if (event.code == "Enter") {
                this.buyCrypto();
            }
        },
        resetMarket(){
            this.marketSpread = 0
            this.lMarketMaker = false

            this.lastClose = 0
            this.qtyBaseBuy = 0
            this.qtyBaseSell = 0
            this.qtyQuoteBuy = 0
            this.qtyQuoteSell = 0
            
            this.totalPnL = 0
            this.totalFees = 0
            this.totalBase = 0
            this.totalQuote = 0

            this.neworder = { Price:0, BuyPrice:0, SellPrice:0, Fee:0, AutoRepeat: this.neworder.AutoRepeat}            
        },
        getOrderbookAsks(){
            return (this.getOrderBook !== undefined && this.getOrderBook.Asks !== undefined) ? this.getOrderBook.Asks : [{Price:0}]
        },
        getOrderbookBids(){
            return (this.getOrderBook !== undefined && this.getOrderBook.Bids !== undefined) ? this.getOrderBook.Bids : [{Price:0}]
        },
        searchMarketPairOrders(){
            var  searchOrder = {Action:"list", Start: this.startDate, Stop: this.stopDate, Order:{Pair: this.market.Pair }}
            this.$store.dispatch('orders/searchMarketPairOrders', searchOrder)
        },
        getAssetBalance(asset) {
            var balance = 0
            for (var symbol in this.getAssetsList) {
                if (symbol === asset) {
                   balance = this.getAssetsList[symbol].Free 
                }
            }
            return balance
        },
        marketDirection(market) {
            return (market.Price > (market.HighPrice - ((market.HighPrice-market.LowPrice)/2)))
        },
        setQty(){
            if (this.qtyBaseBuy > 0) {
                this.qtyBaseSell = this.qtyBaseBuy;
                this.updateQtyBaseBuy();
            } else {
                if (this.qtyBaseSell > 0) {
                    this.qtyBaseBuy = this.qtyBaseSell;
                    this.updateQtyBaseSell();
                }
            }
        },
        marketMakerCheckFails(){
            var lErrors = false
            var notifications = []
            
            if (this.lMarketMaker) {
                // this.neworder.AutoRepeat = 0;
                lErrors = this.buyOrderCheckFails()
                lErrors = this.sellOrderCheckFails()
                if (this.neworder.BuyPrice >= this.neworder.SellPrice){
                    this.notifications.push("Buy Price and Sell Price cannot be the same")
                    lErrors = true
                } 

                var takeProfit = this.truncateNumber((((this.neworder.SellPrice - this.neworder.BuyPrice)/this.neworder.BuyPrice) * 100).toFixed(4),4)
                if(takeProfit <= 0.075){
                    this.notifications.push("Market maker spread is below 0.075%")
                    lErrors = true
                }
            }

            return lErrors
        },
        buyOrderCheckFails(){
            var lErrors = false
            var notifications = []

            if (this.qtyBaseBuy <= 0){
                notifications.push("Please specify quantity of "+this.market.QuoteAsset+" to buy")
            }

            if (this.market.MaxQty < this.qtyBaseBuy ) {
                notifications.push("Buy Quantity is above: "+this.market.MaxQty)
            }

            if (this.market.MinPrice > this.neworder.BuyPrice ) {
                notifications.push("Buy Price is below: "+this.market.MinPrice)
            }

            if (this.market.MaxPrice < this.neworder.BuyPrice ) {
                notifications.push("Buy Price is above: "+this.market.MaxPrice)
            }

            if (this.market.MinNotional > this.qtyQuoteBuy ) {
                var qtyBaseBuy = this.truncateNumber(this.truncateNumber(this.market.MinNotional/this.neworder.BuyPrice)+this.market.StepSize)
                notifications.push("Buy Quantity must be above "+qtyBaseBuy+" to buy")
            }

            var lotSizeCheck = Number(((this.qtyBaseBuy-this.market.MinQty) % this.market.StepSize).toFixed())
            if (lotSizeCheck !== 0) {
                notifications.push("Lot Size is incorrect!! ")
            }

            // if (parseFloat(this.qtyQuoteBuy) > 0 && parseFloat(this.qtyQuoteBuy) > this.quoteFree ) {
            //     notifications.push("You do not have "+this.humanNumber(this.truncateNumber(this.qtyQuoteBuy))+" "+this.market.QuoteAsset+" to exchange for "+this.market.BaseAsset)
            // }

            if (notifications.length>0){
                lErrors = true
                for(let i = 0, len = notifications.length; i < len; i++) {
                        this.notifications.push(notifications[i]);
                }
            }

            return lErrors
        },
        buyOrder(){
            if (this.buyOrderCheckFails()) {
                return    
            }

            if(this.marketMakerCheckFails()) {
                this.notifications.push("Market Maker Failed")
                return
            }

            if ((!this.lMarketMaker && this.takeprofitPercent == 0) && (this.neworder.BuyPrice >= this.averagePrice)) {
                if (!this.lOverrideBuy) {
                    this.notifications = [
                        "You will be buying at a loss of",
                        this.humanNumber(this.truncateNumber((this.averagePrice-this.neworder.BuyPrice)*this.qtyBaseBuy))+ " "+this.market.QuoteAsset,
                        "Try to buy below ",
                        this.humanNumber(this.truncateNumber(this.averagePrice))+ " "+this.market.QuoteAsset,
                        "or"
                    ]
                    // this.lShowOverrideBuy = true
                    // return
                } else {
                    this.lShowOverrideBuy = false
                    this.lOverrideBuy = false
                }
            }
            

            var takeprofitPercent = this.takeprofitPercent
            // if(this.lMarketMaker) {
            //     if (takeprofitPercent > 0) {
            //         takeprofitPercent = this.truncateNumber((((this.neworder.SellPrice - this.neworder.BuyPrice)/this.neworder.BuyPrice) * 100).toFixed(4),4)
            //     } else {
            //         takeprofitPercent = 0
            //     }
            // }
            
            var order = {
                Pair:this.market.Pair, Side:"BUY", Price: parseFloat(this.neworder.BuyPrice), 
                Quantity: parseFloat(this.qtyBaseBuy), Stoploss: this.stoplossPercent, 
                Takeprofit: (takeprofitPercent > 0) ? this.truncateNumber(takeprofitPercent += 0.003, 4) : 0 ,
                AutoRepeat: this.neworder.AutoRepeat
            } 

            //create first market maker order to replicate order book
            if(this.lMarketMaker) { //buyer side of order book
                
                //check if free baseFree is enough to make market and double profits
                // if ( (parseFloat(this.qtyBaseBuy) > 0 && parseFloat(this.qtyBaseBuy) > 0) && 
                //     (parseFloat(this.qtyBaseBuy*2) < this.baseFree && parseFloat(this.qtyQuoteBuy*2) < this.quoteFree)) {

                //     //create first market order
                //     //increase price by multiplying ticks with current spread
                //     var marketOrder = order
                //     marketOrder.Takeprofit = (takeprofitPercent > 0) ? this.truncateNumber(takeprofitPercent += 0.004, 4) : 0 
                //     marketOrder.Price = this.truncateNumber(
                //         this.neworder.BuyPrice - this.truncateNumber(33 * this.market.TickSize)
                //     )
                //     this.$store.dispatch('orders/createOrder', marketOrder)
                //     //increase price by multiplying ticks with current spread    
                // }
                //check if free baseFree is enough to make market and double profits

            }
            //create first market maker order to replicate order book



            order.Price = parseFloat(this.neworder.BuyPrice)
            order.Takeprofit = (takeprofitPercent > 0) ? this.truncateNumber(takeprofitPercent, 4) : 0 
            this.$store.dispatch('orders/createOrder', order)
            this.notifications.push("Buy order has been placed")
            this.notifyTimeout = setTimeout(this.closeNotification, 2500);
            
            //buyer side of order book
            if(this.lMarketMaker) {
                takeprofitPercent = this.truncateNumber(takeprofitPercent, 4)

                var marketMakerOrder = {Pair:this.market.Pair, Side:"SELL", Price: parseFloat(this.neworder.SellPrice), 
                    Quantity: parseFloat(this.qtyBaseSell), Stoploss: this.stoplossPercent, 
                    Takeprofit: (takeprofitPercent > 0) ? this.truncateNumber(takeprofitPercent, 4) : 0 ,
                    AutoRepeat: this.neworder.AutoRepeat
                }
                this.$store.dispatch('orders/createOrder', marketMakerOrder)
                this.notifications.push("Sell order has been placed")


                 //check if free baseFree is enough to make market and double profits
                // if ( (parseFloat(this.qtyBaseBuy) > 0 && parseFloat(this.qtyBaseBuy) > 0) && 
                //     (parseFloat(this.qtyBaseBuy*2) < this.baseFree && parseFloat(this.qtyQuoteBuy*2) < this.quoteFree)) {

                //     //create first market order
                //     //increase price by multiplying ticks with current spread
                //     marketMakerOrder.Takeprofit = (takeprofitPercent > 0) ? this.truncateNumber(takeprofitPercent += 0.002, 4) : 0 
                //     marketMakerOrder.Price = this.truncateNumber(
                //         this.neworder.SellPrice + this.truncateNumber(33 * this.market.TickSize)
                //     )
                //     this.$store.dispatch('orders/createOrder', marketMakerOrder)
                //     //increase price by multiplying ticks with current spread    
                //     this.notifications.push("Market Maker placed sell order")
                // }
                //check if free baseFree is enough to make market and double profits

            }
        },
        sellOrderCheckFails(){
            var lErrors = false
            var notifications = []

            if (this.qtyBaseSell <= 0){
                notifications.push("Please specify quantity of "+this.market.BaseAsset+" to sell")
            }

            if (this.market.MaxQty < this.qtyBaseSell ) {
                notifications.push("Sell Quantity is above: "+this.market.MaxQty)
            }

            if (this.market.MinPrice > this.neworder.SellPrice ) {
                notifications.push("Sell Price is below: "+this.market.MinPrice)
            }

            if (this.market.MaxPrice < this.neworder.SellPrice ) {
                notifications.push("Sell Price is above: "+this.market.MaxPrice)
            }

            if (this.market.MinNotional > this.qtyQuoteSell ) {
                var qtyBaseSell = this.truncateNumber(this.truncateNumber(this.market.MinNotional/this.neworder.SellPrice)+this.market.StepSize)
                notifications.push("Sell Quantity must be above "+qtyBaseSell+" to sell")
                // this.updateQtyBaseSell()
            }

            var lotSizeCheck = Number(((this.qtyBaseSell-this.market.MinQty) % this.market.StepSize).toFixed())
            if (lotSizeCheck !== 0) {
                notifications.push("Sell Lot Size is incorrect!! ")
            }

            // if (parseFloat(this.qtyBaseSell) > 0 && parseFloat(this.qtyBaseSell) > this.baseFree ) {
            //     notifications.push("You do not have "+this.humanNumber(this.truncateNumber(this.qtyBaseSell))+" "+this.market.BaseAsset+" to exchange for "+this.market.QuoteAsset)
            // }

            if (notifications.length>0){
                lErrors = true
                for(let i = 0, len = notifications.length; i < len; i++) {
                        this.notifications.push(notifications[i]);
                }
            }

            return lErrors
        },
        sellOrder(){
            
            if (this.sellOrderCheckFails()) {
                return    
            }

            if(this.lMarketMaker && this.marketMakerCheckFails()) {
                this.notifications.push("Market Maker Failed")
                return
            }
            
            if ((!this.lMarketMaker && this.takeprofitPercent == 0) && (this.neworder.SellPrice <= this.averagePrice)) {
                if (!this.lOverrideSell) {
                    this.notifications = [
                        "You will be selling at a loss of",
                        this.humanNumber(this.truncateNumber((this.neworder.SellPrice-this.averagePrice)*this.qtyBaseSell))+ " "+this.market.QuoteAsset,
                        "Try to sell above ",
                        this.humanNumber(this.truncateNumber(this.averagePrice))+ " "+this.market.QuoteAsset,
                        "or"
                    ]
                    this.lShowOverrideSell = true
                    return
                } else {
                    this.lShowOverrideSell = false
                    this.lOverrideSell = false
                }
            }

            var takeprofitPercent = this.takeprofitPercent
            // if(this.lMarketMaker) {
            //     if (takeprofitPercent > 0) {
            //         takeprofitPercent = this.truncateNumber((((this.neworder.SellPrice - this.neworder.BuyPrice)/this.neworder.BuyPrice) * 100).toFixed(4),4)
            //     } else {
            //         takeprofitPercent = 0
            //     }
            // }

            var order = {Pair:this.market.Pair, Side:"SELL", Price: parseFloat(this.neworder.SellPrice), 
                Quantity: parseFloat(this.qtyBaseSell), Stoploss: this.stoplossPercent, 
                Takeprofit: (takeprofitPercent > 0) ? this.truncateNumber(takeprofitPercent, 4) : 0 ,
                AutoRepeat: this.neworder.AutoRepeat
            }

            this.$store.dispatch('orders/createOrder', order)
            this.notifications.push("Your sell order has been placed")
            
            //always send buy orders first regardless
            if(this.lMarketMaker) {
                takeprofitPercent = this.truncateNumber(takeprofitPercent, 4)
     
                var marketMakerOrder = {
                    Pair:this.market.Pair, Side:"BUY", Price: parseFloat(this.neworder.BuyPrice), 
                    Quantity: parseFloat(this.qtyBaseBuy), Stoploss: this.stoplossPercent, 
                    Takeprofit: (takeprofitPercent > 0) ? this.truncateNumber(takeprofitPercent, 4) : 0,
                    AutoRepeat: this.neworder.AutoRepeat
                } 
                
                
                //first BUY in order flow
                //check if free baseFree is enough to make market and double profits
                // if ( (parseFloat(this.qtyBaseBuy) > 0 && parseFloat(this.qtyBaseBuy) > 0) && 
                //     (parseFloat(this.qtyBaseBuy*2) < this.baseFree && parseFloat(this.qtyQuoteBuy*2) < this.quoteFree)) {

                //     //create first market order
                //     //increase price by multiplying ticks with current spread
                //     marketMakerOrder.Takeprofit = (takeprofitPercent > 0) ? this.truncateNumber(takeprofitPercent += 0.004, 4) : 0 
                //     marketMakerOrder.Price = this.truncateNumber(
                //         this.neworder.BuyPrice - this.truncateNumber(33 * this.market.TickSize)
                //     )
                //     this.$store.dispatch('orders/createOrder', marketMakerOrder)
                //     //increase price by multiplying ticks with current spread    
                //     this.notifications.push("Market Maker placed buy order ")
                // }
                //check if free baseFree is enough to make market and double profits

                //second BUY in order flow
                marketMakerOrder.Price = parseFloat(this.neworder.BuyPrice)
                this.$store.dispatch('orders/createOrder', marketMakerOrder)
            }

            
            /* fri 6 2021
            var order = {Pair:this.market.Pair, Side:"SELL", Price: parseFloat(this.neworder.SellPrice), 
                Quantity: parseFloat(this.qtyBaseSell), Stoploss: this.stoplossPercent, 
                Takeprofit: (takeprofitPercent > 0) ? this.truncateNumber(takeprofitPercent, 4) : 0 ,
                AutoRepeat: this.neworder.AutoRepeat
            }

            this.$store.dispatch('orders/createOrder', order)
            this.notifications.push("Your sell order has been placed")
            */

            //check if free baseFree is enough to make market and double profits
            // if(this.lMarketMaker) {
            //     if ( (parseFloat(this.qtyBaseSell) > 0 && parseFloat(this.qtyBaseBuy) > 0) && 
            //         (parseFloat(this.qtyBaseSell*2) < this.baseFree && parseFloat(this.qtyQuoteBuy*2) < this.quoteFree)) {
            //         //increase price by multiplying ticks with current spread

            //         order.Takeprofit = (takeprofitPercent > 0) ? this.truncateNumber(takeprofitPercent += 0.002, 4) : 0 
            //         order.Price = this.truncateNumber(
            //             this.neworder.SellPrice + this.truncateNumber(33 * this.market.TickSize)
            //         )
            //         this.$store.dispatch('orders/createOrder', order)
            //         //increase price by multiplying ticks with current spread    
            //     }
            // }
            //check if free baseFree is enough to make market and double profits

            this.notifyTimeout = setTimeout(this.closeNotification, 2500);            
        },
        closeNotification(){
            this.notifications = []
            this.lOverrideBuy = this.lShowOverrideBuy = false
            this.lOverrideSell = this.lShowOverrideSell = false
        } ,
        updateQtyQuoteBuy() {
            if (this.neworder.BuyPrice == 0 && this.averagePrice > 0){
                this.neworder.BuyPrice = this.averagePrice
            }
            
            if (this.qtyQuoteBuy==='') {
                return
            }
            
            if (this.qtyQuoteBuy >= 0 && this.neworder.BuyPrice > 0){
                // if (this.qtyQuoteBuy < this.market.MinNotional) {
                //     this.qtyQuoteBuy = this.market.MinNotional
                // }
                this.qtyBaseBuy = this.truncateNumber(this.qtyQuoteBuy / this.neworder.BuyPrice)
            } else {
                this.qtyBaseBuy = 0
            }
        },
        setQtyBaseBuyPercent(percent) {
            if(this.quoteFree > this.market.MinNotional){
                if (this.neworder.BuyPrice == 0) {
                    this.neworder.BuyPrice = this.market.Price
                }
                var baseValue = this.truncateNumber(this.quoteFree / this.neworder.BuyPrice)
                var percentOfBaseValue = this.truncateNumber(baseValue * (percent/100)) 
                this.qtyBaseBuy = this.truncateNumber(((percentOfBaseValue/this.market.StepSize).toFixed() * this.market.StepSize))
                this.updateQtyBaseBuy()
            }
        },
        setQtyQuoteBuyPercent(percent) {
            if(this.quoteFree > this.market.MinNotional){
                if (this.neworder.BuyPrice == 0) {
                    this.neworder.BuyPrice = this.market.Price
                }
                this.qtyQuoteBuy = this.truncateNumber(this.quoteFree * (percent/100))
                this.updateQtyQuoteBuy()
            }
        },
        updateQtyBaseBuy() {
            if (this.neworder.BuyPrice == 0){
                this.neworder.BuyPrice = this.averagePrice
            }
            if (this.qtyBaseBuy >= 0 && this.neworder.BuyPrice > 0) {
                this.qtyQuoteBuy = this.truncateNumber((this.qtyBaseBuy * this.neworder.BuyPrice), 5)
            } else {
                this.qtyQuoteBuy = 0
            }
        },
        updateBuyPrice(price) {
            this.neworder.BuyPrice = this.truncateNumber(price)
            this.updateQtyBaseBuy()
        },
        updateBuyQty(qty) {
            this.qtyBaseBuy = qty
            this.updateQtyBaseBuy()
        },
        updateBuyAmount(amount) {
            // this.qtyQuoteBuy = amount
            // this.updateQtyQuoteBuy()
        },
        updateQtyQuoteSell() {
            if (this.qtyQuoteSell==='') {
                return
            }
            if (this.qtyQuoteSell >= 0 && this.neworder.SellPrice > 0){
                // if (this.qtyQuoteSell < this.market.MinNotional) {
                //     this.qtyQuoteSell = this.market.MinNotional
                // }
                this.qtyBaseSell = this.truncateNumber(this.qtyQuoteSell / this.neworder.SellPrice)
            } else {
                this.qtyBaseSell = 0
            }
        },
        setQtyBaseSellPercent(percent) {
            var baseMinNotional = 0
            if (this.market.MinNotional > 0) {
                baseMinNotional = this.truncateNumber((this.market.MinNotional/this.neworder.BuyPrice)+this.market.StepSize)
            }
            if(this.baseFree > baseMinNotional){
                var percentOfBaseValue = this.truncateNumber(this.baseFree * (percent/100)) 
                this.qtyBaseSell = this.truncateNumber(((percentOfBaseValue/this.market.StepSize).toFixed() * this.market.StepSize))
                this.updateQtyBaseSell()
            }
        },
        setQtyQuoteSellPercent(percent) {
            var baseMinNotional = 0
            if (this.market.MinNotional > 0) {
                baseMinNotional = this.truncateNumber((this.market.MinNotional/this.neworder.BuyPrice)+this.market.StepSize)
            }
            if(this.baseFree > baseMinNotional){
                var percentOfBaseValue = this.truncateNumber(this.baseFree * (percent/100)) 
                this.qtyQuoteSell = this.truncateNumber(percentOfBaseValue * this.neworder.SellPrice)
                this.updateQtyQuoteSell()
            }
        },
        updateQtyBaseSell() {
            if (this.qtyBaseSell >= 0 && this.neworder.SellPrice > 0){
                this.qtyQuoteSell = this.truncateNumber((this.qtyBaseSell * this.neworder.SellPrice))
            } else {
                this.qtyQuoteSell = 0
            }
        },
        updateSellPrice(price) {
            this.neworder.SellPrice = this.truncateNumber(price)
            this.updateQtyBaseSell()
        },
        updateSellQty(qty) {
            this.qtyBaseSell = qty
            this.updateQtyBaseSell()
        },
        updateSellAmount(amount) {
            // this.qtyQuoteSell = amount
            // this.updateQtyQuoteSell()
        },
        startTimer(){
            const app = this
            app.totalSeconds = 0;
            clearInterval(app.counterInterval)
            app.counterInterval = setInterval(function(){ app.totalSeconds++ }, 1000, app);
        },
        activateSell() {
            if (this.marketSpread < 0) {
                this.marketSpread = 1
            }
            var sellPrice = this.neworder.SellPrice;
            switch(this.sellPriceType){
                case "marketprice":
                    sellPrice = this.truncateNumber(this.market.Price - this.truncateNumber(this.marketSpread * this.market.TickSize))
                    break;
                case "high":
                    sellPrice = this.truncateNumber(this.market.High - this.truncateNumber(this.marketSpread * this.market.TickSize))
                    break;
                case "close":
                    sellPrice = this.truncateNumber(this.market.Close - this.truncateNumber(this.marketSpread * this.market.TickSize))
                    break;
                case "average":
                    sellPrice = truncateNumber(this.getOrderBook.AsksBaseTotal/this.getOrderBook.AsksQuoteTotal, this.getDecimalPlaces())
                    break;
                
                default:
                    if (parseInt(this.sellPriceType) > 0 && this.getOrderbookBids()[this.sellPriceType-1] !== undefined){
                        sellPrice = this.truncateNumber(this.getOrderbookAsks()[this.sellPriceType-1].Price - this.truncateNumber(this.marketSpread * this.market.TickSize))
                    }
                    break;
            }
            

            var lastBidId = 2
            lastBidId = (lastBidId>0) ? lastBidId - 1 : 0
            var lastBidPrice = 0
            if (this.getOrderbookBids()[lastBidId] !== undefined) {
                lastBidPrice = this.getOrderbookBids()[lastBidId].Price
            }

            if (sellPrice < lastBidPrice) {
                sellPrice = lastBidPrice
            }

            if (sellPrice > this.neworder.SellPrice) {
                this.neworder.SellPrice = this.truncateNumber(sellPrice, 8)
            }
            
            this.updateQtyBaseSell()
            
            return (this.market.Close < this.market.Open && this.market.Price < this.market.LastPrice && this.neworder.SellPrice > this.averagePrice)
        },
        priceRising(market) {
            return (market.Price>market.LastPrice)
        },
        priceDroping(market) {
            return (market.Price<market.LastPrice)
        },
        activateBuy() {
            if (this.marketSpread < 0) {
                this.marketSpread = 1
            }

            var buyPrice = this.neworder.BuyPrice;
            switch(this.buyPriceType){
                case "marketprice":
                    buyPrice = this.truncateNumber(this.market.Price + this.truncateNumber(this.marketSpread * this.market.TickSize))
                    break;
                case "low":
                    buyPrice = this.truncateNumber(this.market.Low + this.truncateNumber(this.marketSpread * this.market.TickSize))
                    break;
                case "open":
                    buyPrice = this.truncateNumber(this.market.Open + this.truncateNumber(this.marketSpread * this.market.TickSize))
                    break;
                case "average":
                    buyPrice = truncateNumber(this.getOrderBook.BidsBaseTotal/this.getOrderBook.BidsQuoteTotal, this.getDecimalPlaces())
                    break;
                    
                default:
                    if (parseInt(this.buyPriceType) > 0 && this.getOrderbookBids()[this.buyPriceType-1] !== undefined){
                        buyPrice = this.truncateNumber(this.getOrderbookBids()[this.buyPriceType-1].Price + this.truncateNumber(this.marketSpread * this.market.TickSize))
                    }
                    break;
            }

            var lastAskId = 2
            lastAskId = (lastAskId>0) ? lastAskId - 1 : 0

            var lastAskPrice = 0
            if (this.getOrderbookAsks()[lastAskId] !== undefined){
                lastAskPrice = this.getOrderbookAsks()[lastAskId].Price
            }
            
            
            
            if (buyPrice > lastAskPrice) {
                buyPrice = lastAskPrice
            }

            if (buyPrice < this.neworder.BuyPrice) {
                this.neworder.BuyPrice = this.truncateNumber(buyPrice, 8)
            }

            this.updateQtyBaseBuy() 

            return (this.market.Close > this.market.Open && this.market.Price > this.market.LastPrice && this.neworder.BuyPrice < this.averagePrice)
        },
        getBidsAverage(){
            return truncateNumber(this.getOrderBook.BidsBaseTotal/this.getOrderBook.BidsQuoteTotal, this.getDecimalPlaces())
        },
        getAsksAverage(){
            return truncateNumber(this.getOrderBook.AsksBaseTotal/this.getOrderBook.AsksQuoteTotal, this.getDecimalPlaces())
        },
        getDecimalPlaces(){
            let bidPrice = this.getOrderBook.Bids[0].Price
            let askPrice = this.getOrderBook.Asks[0].Price
            let bidPriceDecimals = (bidPrice.toString().split('.')[1] || []).length
            let askPriceDecimals = (askPrice.toString().split('.')[1] || []).length
            return (bidPriceDecimals > askPriceDecimals) ? bidPriceDecimals : askPriceDecimals;
        },
        fancyTimeFormat(duration){   
            // Hours, minutes and seconds
            var hrs = ~~(duration / 3600);
            var mins = ~~((duration % 3600) / 60);
            var secs = ~~duration % 60;
            // Output like "1:01" or "4:03:59" or "123:03:59"
            var ret = "";
            if (hrs > 0) {
                ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
            }
            ret += "" + mins + ":" + (secs < 10 ? "0" : "");
            ret += "" + secs;
            return ret;
        },
    },
    };
</script>

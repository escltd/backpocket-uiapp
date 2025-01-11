<template>
  <section class="flex flex-column w-100 vh-100">
    <siteheader page="opportunity" />

    <div class="cf w-100 h-100 overflow-scroll">
      <div class="ph4-l ph2 cf mw8 center">
        <div class="fl w-100 f5 fw6 tr ">
          <div class="w-auto fl">
            Trading Opportunities
          </div>
        </div>
      </div>



      <div class="ph4-l ph2 cf mw8 center">

        <div class="mv2 flex flex-row w-100 fl br3 br--left br--right">
          <input type="text" size="18" class=" pa2 br2 ba b--white-10 bg-white black" placeholder="Pair"
                 v-model="pair" />
          <input type="text" size="10" class="ml2 pa2 br2 ba b--white-10 bg-white black" placeholder="Action"
                 v-model="action" />
          <input type="date" class="ml2 pa2 br2 ba b--white-10 bg-white black" placeholder="Start"
                 v-model="starttime" />
          <input type="date" class="ml2 pa2 br2 ba b--white-10 bg-white black" placeholder="End" v-model="endtime" />
          <span @click="searchOpportunities" class="ml2 pa2 bg-green white pointer">Search</span>
        </div>

        <div class="flex flex-row w-100 fl br3 br--left br--right bg-white-10">
          <div class="tc pv2 w2 br bl b--white-10">#</div>
          <div class="tl pa2 w-20 br bl b--white-10">Date</div>
          <div class="tc pa2 w-10 br b--white-10 dn dib-ns">Trend</div>
          <div class="tc pa2 w-20 br b--white-10 dn dib-ns">Pair</div>
          <div class="tc pa2 w-10 br b--white-10 dn dib-ns">Action</div>
          <div class="tc pa2 w-20 br b--white-10 dn dib-ns">Price</div>
          <div class="tc pa2 w-10 br b--white-10 dn dib-ns">Takeprofit</div>
          <div class="tc pa2 w-10 br b--white-10 dn dib-ns">Stoploss</div>
        </div>


        <div class="inline-flex flex-column w-100 fl br bl bb b--white-10 vh-50 overflow-scroll">
          <div style="height:10rem" class="flex flex-row items-start w-100 bb b--white-10 mv2"
               v-for="(opportunity, index) in opportunities" :key="index">
            <div class="tc pv2 w2 br bl b--white-10">{{ index + 1 }}</div>
            <div class="tl pa2 w-20 br bl b--white-10">
              {{ humanDate(opportunity.Createdate.substring(0, 19)).substring(0, 11) }}
              <small>{{ humanDate(opportunity.Createdate.substring(0, 19)).substring(11, 15) }}</small>
              <small class="db w-100">
                <span> {{ humanDate(opportunity.Createdate.substring(0, 19)).substring(15, 30) }} </span>
              </small>
            </div>
            <div class="tc pa2 w-10 br b--white-10 dn dib-ns">{{ opportunity.Trend }}</div>
            <div class="tc pa2 w-20 br b--white-10 dn dib-ns b">{{ opportunity.Pair }}</div>
            <div class="tc pa2 w-10 br b--white-10 dn dib-ns b">{{ opportunity.Action }}</div>
            <div class="tc pa2 w-20 br b--white-10 dn dib-ns b">{{ truncateNumber(opportunity.Price, 6) }}</div>
            <div class="tc pa2 w-10 br b--white-10 dn dib-ns">{{ truncateNumber(opportunity.Takeprofit, 6) }}</div>
            <div class="tc pa2 w-10 br b--white-10 dn dib-ns">{{ truncateNumber(opportunity.Stoploss, 6) }}</div>
          </div>
        </div>

      </div>



    </div>

  </section>
</template>

<script type="text/javascript">
import { HTTP, humanNumber, humanDate, truncateNumber, sortObjectEntries } from "@/common";
import marketpairs from "@/components/marketpairs";
import siteheader from "@/components/generic/siteheader";


export default {
    components: { siteheader, marketpairs, },
    data() { return {
        lLoading: true, opportunities : [],
        pair:"", action:"", 
        starttime:new Date().toJSON().slice(0,10), 
        endtime:new Date().toJSON().slice(0,10),
    }},
    computed: {
    },
    watch: {
    },
    mounted() {
        const today = new Date()
        const stopDate = new Date()
        const startDate = new Date()

        startDate.setDate(today.getDate()-3)
        this.starttime = startDate.toJSON().slice(0,10)

        stopDate.setDate(today.getDate()+1)
        this.endtime = stopDate.toJSON().slice(0,10)

        setTimeout(this.searchOpportunities, 750)
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
        searchOpportunities() {
          this.opportunities = [];
          var searchParams = `pair=${this.pair}&action=${this.action}&starttime=${this.starttime}&endtime=${this.endtime}`
          HTTP.get('/api/v1/opportunity/search?'+searchParams,{withCredentials: true}).then(response => {
            if (response.status == 200) {
              this.opportunities = response.data
            }
          }).catch(e => {
            console.log(e)
            this.error = e
          })
        },
    },
}; 
</script>

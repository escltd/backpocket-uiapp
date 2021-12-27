<template>
  <footer class="fl w-100 center bg-black-90 pv4 near-white bt b--black-10">
    <newsletter />
    <div class="w-100 bg-near-white near-black">
      <div class="w-70-l w-100 center">
        <div class="pa4 cf w-100">
          <article class="fl w-third-ns w-50 dib-ns mb4-ns mb2">
            <a class="f6 db fw6 pv3 black-70 link dim">Shop</a>
            <a class="f6 db fw6 pv3 black-70 link dim">The Brand</a>
            <a class="f6 db fw6 pv3 black-70 link dim">Size Guide</a>
            <a class="f6 db fw6 pv3 black-70 link dim">Contact</a>
          </article>

          <article class="fl w-third-ns w-50 dib-ns mb4-ns mb2">
            <router-link to="/terms" class="f6 db fw6 pv3 black-70 link dim">Terms & Conditions</router-link>
            <router-link to="/shipping" class="f6 db fw6 pv3 black-70 link dim">Shipping & Returns</router-link>
            <router-link to="/store" class="f6 db fw6 pv3 black-70 link dim">Store Policy</router-link>
            <router-link to="/privacy" class="f6 db fw6 pv3 black-70 link dim">Privacy Policy</router-link>
          </article>

          <article class="fl w-third-ns w-100 dib-ns mb4-ns mb2">
            <div class="dt h2 h4-ns center">
              <div class="dtc v-btm">
                <a class="pr3" href="https://instagram.com/xclassylingerie" target="blank">
                  <i class="fab f2 black fa-instagram"></i>
                </a>
                <a
                  class="pr3"
                  href="https://www.facebook.com/Xclassy-Lingerie-Apparels-516572135503721/"
                  target="blank"
                >
                  <i class="fab f2 black fa-facebook"></i>
                </a>
                <a class="pr3" href="http://wa.me/2347038911441" target="blank">
                  <i class="fab f2 black fa-whatsapp"></i>
                </a>
                <a class href="https://twitter.com/xclassylingeri1" target="blank">
                  <i class="fab f2 black fa-twitter"></i>
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
    <div class="db">
      <p class="f7 mt4 tc">Copyright © Xclassy Lingerine & Apparels {{date}}</p>
    </div>
  </footer>
</template>

<script type="text/javascript">
import newsletter from "@/components/generic/newsletter";

export default {
  components: {
    newsletter,
  },
  data() {
    return { date: new Date().getFullYear() };
  },
  methods: {
    scrollTop() {
      const scrollHeight = window.scrollY,
        scrollStep = Math.PI / (300 / 15),
        cosParameter = scrollHeight / 2;
      var scrollCount = 0,
        scrollMargin,
        scrollInterval = setInterval(function () {
          if (window.scrollY != 0) {
            scrollCount = scrollCount + 1;
            scrollMargin =
              cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
            window.scrollTo(0, scrollHeight - scrollMargin);
          } else clearInterval(scrollInterval);
        }, 15);
    },
  },
};
</script>
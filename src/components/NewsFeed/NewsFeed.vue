<template>
  <div id="newsFeed" class="testcard">
    <h1>News Feed</h1>

    <div class="cards" v-for="item of items" :key="item.title">
      <div class="card">
        <img class="card-img-top" v-bind:src="item.enclosure.link" />
        <div class="card-body">
          <h2 class="card-title " v-bind:class="[readMore ? 'remove-style' : '']" >{{ item.title }}</h2>
          <!-- <p>
            {{ item.description }}
            <a href="#1">Read more...</a>
          </p>
          <p>{{ item.pubDate }}</p> -->
          <br>
          <button @click="toggleClass" v-html="readMore ? 'Read less...' : 'Read more...'"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { ref } from "vue";
export default {
  setup() {
    let items = ref([]);
    let readMore = ref(false);

    async function getRss() {
      // eslint-disable-next-line max-len
      const res = await fetch(
        "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.news-medical.net%2Ftag%2Ffeed%2FCardiomyopathy.aspx"
      );
      const data = await res.json();
      items.value = data.items;
      console.log(items);
    }

    function toggleClass() {
      readMore.value = !readMore.value;
 //   readmore.value = true;
    }
    getRss();
    return {
      items,
      readMore,
      toggleClass
    };
  },
}
</script>

<style>
  @import "./NewsFeed.scss";
</style>

<template>
  <div id="newsFeed">
    <h1>News Feed</h1>
    <div v-for="item of items" :key="item.title">

      <img v-bind:src="item.enclosure.link"/>
      <h1>{{ item.title }}</h1>
      <p>{{ item.description }}</p>
      <p>{{item.pubDate}}</p>
    </div>
  </div>
</template>

<script>
  import { ref } from 'vue';
  export default {
    setup() {
      let items = ref([]);

      async function getRss() {
        // eslint-disable-next-line max-len
        const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.news-medical.net%2Ftag%2Ffeed%2FCardiomyopathy.aspx');
        const data = await res.json();
        items.value = data.items;
        console.log(items);
      }

      getRss();
      return {
        items
      };
    }
  };
</script>

<style></style>

<template>
  <div id="newsFeed">
    <h1>News Feed</h1>
    <div id="myModal" class="modal" v-if="isModalActive">
      <div class="modal-content">
        <div class="modal-header">
          <span class="close" @click="toggleModal()">&times;</span>
          <h2>{{ modalItem.title }}</h2>
        </div>
        <div class="modal-body">
          <p>{{ modalItem.description }}</p>
        </div>
        <div class="modal-footer">
          <h3>{{ modalItem.pubDate }}</h3>
        </div>
      </div>
    </div>
    {{modalItem}}
    <div class="cards" v-for="item of items" :key="item.title">
      <div class="card">
        <img class="card-img-top" v-bind:src="item.enclosure.link" />
        <div class="card-body">
          <h2 class="card-title" v-bind:class="[readMore ? 'remove-style' : '']">
            {{ item.title }}
            <button id="myBtn" @click="toggleModal(item)">View content</button>
          </h2>
          <!-- <p>
            {{ item.description }}
            <a href="#1">Read more...</a>
          </p>
          <p>{{ item.pubDate }}</p> -->
          <br />
          <button @click="toggleClass" v-html="readMore ? 'Read less...' : 'Read more...'"></button
          >
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
    let isModalActive = ref(false);
    let modalItem = ref({});

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
    }

    function toggleModal(item = {}) {
      modalItem.value = item;
      isModalActive.value = !isModalActive.value;
    }

    // // Get the modal
    // var modal = document.getElementById("myModal");

    // // Get the button that opens the modal
    // var btn = document.getElementById("myBtn");

    // // Get the <span> element that closes the modal
    // var span = document.getElementsByClassName("close")[0];

    // // When the user clicks on the button, open the modal
    // btn.onclick = function () {
    //   modal.style.display = "block";
    // };

    // // When the user clicks on <span> (x), close the modal
    // span.onclick = function () {
    //   modal.style.display = "none";
    // };

    // // When the user clicks anywhere outside of the modal, close it
    // window.onclick = function (event) {
    //   if (event.target == modal) {
    //     modal.style.display = "none";
    //   }
    // };
    getRss();
    return {
      items,
      readMore,
      toggleClass,
      toggleModal,
      isModalActive,
      modalItem
    };
  },
};
</script>

<style>
@import "./NewsFeed.scss";
</style>

<template>
  <div id="newsFeed">
    <MDBModal
      id="newsFeedModal"
      v-model="newsFeedModal"
      tabindex="-1"
      labelledby="newsFeedModalLabel"
    >
      <MDBModalHeader>
        <div>
          <MDBModalTitle
            id="newsFeedModalLabel"
            :style="{ fontWeight: 'bold' }"
          >
            {{ modalItem.title }}
          </MDBModalTitle>
          <h4 class="text-muted mt-2">
            Published: {{ dateTime(modalItem.pubDate) }}
          </h4>
        </div>
      </MDBModalHeader>

      <MDBModalBody>
        <MDBRow>
          <MDBCol size="6" class="mb-4">
            <div
              class="
                bg-image
                hover-overlay
                ripple
                shadow-2-strong
                ripple-surface-light
              "
              data-mdb-ripple-color="light"
            >
              <img :src="modalItem.enclosure.link" class="img-fluid" />
              <a href="#!">
                <div
                  class="mask"
                  style="background-color: rgba(251, 251, 251, 0.15)"
                />
              </a>
            </div>
          </MDBCol>
          <MDBCol size="6" class="mb-4">
            {{ modalItem.description }}
          </MDBCol>
        </MDBRow>
      </MDBModalBody>

      <MDBModalFooter>
        <MDBBtn color="primary" @click="newsFeedModal = false"> Close </MDBBtn>
      </MDBModalFooter>
    </MDBModal>
    <div class="text-center mt-3">
      <MDBBtn
        color="primary"
        :class="['animate__animated ', collapse ? 'animate__zoomIn' : 'animate__fadeIn']"
        @click="
          () => {
            collapse = !collapse;
          }
        "
        aria-controls="multiCollapseExample"
        >{{ collapse ? 'Shrink ' : 'Expand ' }}News Feed</MDBBtn
      >
    </div>
    <MDBCollapse v-model="collapse" id="multiCollapseExample">
      <div :class="[[$style.container], 'mt-5']">
        <div
          :class="$style.card"
          v-for="item of items"
          @click="toggleModal(item)"
          :key="item.title"
        >
          <a v-mdb-ripple="{ color: 'light' }">
            <MDBCardImg :src="item.enclosure.link" top :alt="item.title" title="Click to view article"/>
          </a>
          <MDBCardTitle
            :class="[$style['card-text'], 'ms-2', 'mt-3', $style['add-style']]"
          >
            {{ item.title }}
          </MDBCardTitle>
          <div :class="$style.circle">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
              <circle :class="$style.stroke" cx="60" cy="60" r="50" />
            </svg>
          </div>
          <div :class="$style.bar">
            <div :class="$style.emptybar"></div>
            <div :class="$style.filledbar"></div>
          </div>
        </div>
      </div>
    </MDBCollapse>
  </div>
</template>

<script>
import {
  MDBBtn,
  MDBCardBody,
  MDBCardImg,
  MDBCardTitle,
  MDBCol,
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
  MDBModalTitle,
  MDBRow,
  mdbRipple,
  MDBCollapse,
} from "mdb-vue-ui-kit";
import { ref } from "vue";

export default {
  components: {
    MDBBtn,
    MDBCardBody,
    MDBCardImg,
    MDBCardTitle,
    MDBCol,
    MDBModal,
    MDBModalBody,
    MDBModalFooter,
    MDBModalHeader,
    MDBModalTitle,
    MDBRow,
    MDBCollapse,
  },
  directives: {
    mdbRipple,
  },
  setup() {
    let isModalActive = ref(false);
    let items = ref([]);
    let modalItem = ref({});
    const newsFeedModal = ref(false);
    const collapse = ref(false);

    (async () => {
      const res = await fetch(
        "https://api.rss2json.com/v1/api.json?rss_url=" +
          "https%3A%2F%2Fwww.news-medical.net%2Ftag%2Ffeed%2FCardiomyopathy.aspx"
      );
      const data = await res.json();
      items.value = data.items;
    })();

    const toggleModal = (item = {}) => {
      modalItem.value = item;
      newsFeedModal.value = !newsFeedModal.value;
    };

    const dateTime = (value) =>
      new Date(value).toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    return {
      dateTime,
      isModalActive,
      items,
      modalItem,
      newsFeedModal,
      toggleModal,
      collapse,
    };
  },
};
</script>

<style module lang="scss">
@import "./NewsFeed.module.scss";
</style>

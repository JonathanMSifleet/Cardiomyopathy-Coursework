<template>
  <div id="newsFeed">
    <h1>News Feed</h1>
    <!-- Button trigger modal -->

    <MDBModal
      id="newsFeedModal"
      tabindex="-1"
      labelledby="newsFeedModalLabel"
      v-model="newsFeedModal"
    >
      <MDBModalHeader>
        <div>
          <MDBModalTitle id="newsFeedModalLabel" v-bind:style="{ fontWeight: 'bold' }">{{
            modalItem.title
          }}</MDBModalTitle>
          <h4 class="text-muted mt-2">Published: {{ dateTime(modalItem.pubDate) }}</h4>
        </div>
        <!-- <MDBModalTitle id="newsFeedModalLabel" v-bind:style="{ fontWeight: 'bold' }">{{
          modalItem.title
        }}</MDBModalTitle> -->
      </MDBModalHeader>
      <MDBModalBody
        ><div class="row">
          <div class="col-md-6 mb-4">
            <div
              class="bg-image hover-overlay ripple shadow-2-strong ripple-surface-light"
              data-mdb-ripple-color="light"
              style=""
            >
              <img v-bind:src="modalItem.enclosure.link" class="img-fluid" />
              <a href="#!">
                <div class="mask" style="background-color: rgba(251, 251, 251, 0.15)"></div>
              </a>
            </div>
          </div>
          <div class="col-md-6 mb-4">
            {{ modalItem.description }}
          </div>
        </div></MDBModalBody
      >

      <MDBModalFooter>
        <MDBBtn color="success" @click="newsFeedModal = false">Close</MDBBtn>
      </MDBModalFooter>
    </MDBModal>
    <div id="carouselExampleFade" class="carousel slide carousel-fade me-5" data-bs-ride="carousel">
      <div class="carousel-inner">
        <MDBCard
          class="mb-4 carousel-item"
          :class="index == activeCarousel && 'active'"
          v-for="(item, index) of items"
          :key="item.title"
        >
          <a v-mdb-ripple="{ color: 'light' }">
            <MDBCardImg v-bind:src="item.enclosure.link" top v-bind:alt="item.title" />
          </a>

          <div class="text-center">
            <MDBCardBody>
              <MDBCardTitle
                class="card-title"
                v-bind:class="[readMore ? 'remove-style' : 'add-style']"
              >
                {{ item.title }}
                <br />
                <MDBBtn tag="button" class="btn-success mt-3" @click="toggleModal(item)"
                  >View content</MDBBtn
                ></MDBCardTitle
              ><br />
              <button
                class="read-more-link mt-3"
                @click="toggleClass"
                v-html="readMore ? 'Read less...' : 'Read more...'"
              ></button>
            </MDBCardBody>
          </div>
        </MDBCard>
      </div>
      <!-- <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleFade"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleFade"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button> -->
    </div>
  </div>
</template>

<script>
import {
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImg,
  mdbRipple,
} from "mdb-vue-ui-kit";
import { ref, computed } from "vue";
import moment from "moment";
export default {
  components: {
    MDBModal,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBCardImg,
  },
  directives: {
    mdbRipple,
  },
  setup() {
    let items = ref([]);
    let readMore = ref(false);
    let isModalActive = ref(false);
    let modalItem = ref({});
    let carouselIndex = ref(0);
    const newsFeedModal = ref(false);
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
      newsFeedModal.value = !newsFeedModal.value;
    }

    function dateTime(value) {
      return moment(value).format("Do MMMM YYYY");
    }

    const activeCarousel = computed(() => {
      if (carouselIndex.value < 0) {
        carouselIndex.value = items.value.length - 1;
      }
      return carouselIndex.value % items.value.length;
    });

    getRss();
    return {
      items,
      readMore,
      toggleClass,
      toggleModal,
      isModalActive,
      modalItem,
      newsFeedModal,
      dateTime,
      activeCarousel,
    };
  },
};
</script>

<style>
@import "./NewsFeed.scss";
</style>

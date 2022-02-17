<template>
  <div id="newsFeed">
    <h1>News Feed</h1>
    <!-- Button trigger modal -->

    <MDBModal
      id="newsFeedModal"
      v-model="newsFeedModal"
      tabindex="-1"
      labelledby="newsFeedModalLabel"
    >
      <MDBModalHeader>
        <div>
          <MDBModalTitle id="newsFeedModalLabel" :style="{ fontWeight: 'bold' }">
            {{
              modalItem.title
            }}
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
              class="bg-image hover-overlay ripple shadow-2-strong ripple-surface-light"
              data-mdb-ripple-color="light"
              style=""
            >
              <img :src="modalItem.enclosure.link" class="img-fluid">
              <a href="#!">
                <div class="mask" style="background-color: rgba(251, 251, 251, 0.15)" />
              </a>
            </div>
          </MDBCol>
          <MDBCol size="6" class="mb-4">
            {{ modalItem.description }}
          </MDBCol>
        </MDBRow>
      </MDBModalBody>

      <MDBModalFooter>
        <MDBBtn color="success" @click="newsFeedModal = false">
          Close
        </MDBBtn>
      </MDBModalFooter>
    </MDBModal>
    <div id="carouselExampleFade" class="carousel slide carousel-fade me-5" data-bs-ride="carousel">
      <div class="carousel-inner">
        <MDBCard
          v-for="(item, index) of items"
          :key="item.title"
          class="mb-4 carousel-item"
          :class="index == activeCarousel && 'active'"
        >
          <a v-mdb-ripple="{ color: 'light' }">
            <MDBCardImg :src="item.enclosure.link" top :alt="item.title" />
          </a>

          <div class="text-center">
            <MDBCardBody>
              <MDBCardTitle
                class="card-title"
                :class="[readMore ? 'remove-style' : 'add-style']"
              >
                {{ item.title }}
                <br>
                <MDBBtn
                  tag="button"
                  class="btn-success mt-3"
                  @click="toggleModal(item)"
                >
                  View content
                </MDBBtn>
              </MDBCardTitle><br>
              <button
                class="read-more-link mt-3"
                @click="toggleClass"
                v-html="readMore ? 'Read less...' : 'Read more...'"
              />
            </MDBCardBody>
          </div>
        </MDBCard>
      </div>
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
    MDBCardImg,
    MDBCol,
    MDBRow,
    mdbRipple
  } from 'mdb-vue-ui-kit';
  import { ref, computed } from 'vue';
  import moment from 'moment';

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
      MDBCardImg,
      MDBCol,
      MDBRow
    },
    directives: {
      mdbRipple
    },
    setup() {
      let carouselIndex = ref(0);
      let isModalActive = ref(false);
      let items = ref([]);
      let modalItem = ref({});
      const newsFeedModal = ref(false);
      let readMore = ref(false);

      (async () => {
        const res = await fetch(
          'https://api.rss2json.com/v1/api.json?rss_url=' +
            'https%3A%2F%2Fwww.news-medical.net%2Ftag%2Ffeed%2FCardiomyopathy.aspx'
        );
        const data = await res.json();
        items.value = data.items;
        console.log(items);
      })();

      const toggleClass = () => readMore.value = !readMore.value;

      const toggleModal = (item = {}) => {
        modalItem.value = item;
        newsFeedModal.value = !newsFeedModal.value;
      };

      const dateTime = (value) => moment(value).format('Do MMMM YYYY');

      const activeCarousel = computed(() => {
        if (carouselIndex.value < 0) carouselIndex.value = items.value.length - 1;

        return carouselIndex.value % items.value.length;
      });

      return { activeCarousel, dateTime, isModalActive, items,
               modalItem, newsFeedModal, readMore, toggleClass, toggleModal
      };
    }
  };
</script>

<style>
  @import "./NewsFeed.scss";
</style>

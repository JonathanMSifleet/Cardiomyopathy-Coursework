<template>
  <MDBContainer fluid :class="$style.PageWrapper">
    <Header />
    <MDBRow :class="$style.Row">
      <MDBCol :class="$style.SideColumnLeft" md="2" />
      <MDBCol :class="$style.MainContent" md="8">
        <slot />
        <NewsFeed />
      </MDBCol>
      <MDBCol :class="$style.SideColumnRight" md="2">
      </MDBCol>
    </MDBRow>
    <Footer />
  </MDBContainer>
</template>

<script>
import Footer from "../../components/Footer/Footer.vue";
import Header from "../../components/Header/Header.vue";
import NewsFeed from "../../components/NewsFeed/NewsFeed.vue";
import { MDBContainer, MDBCol, MDBRow } from "mdb-vue-ui-kit";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

export default {
  components: {
    Footer,
    Header,
    MDBCol,
    MDBContainer,
    MDBRow,
    NewsFeed,
  },
  setup() {
    const path = ref(false);
    const route = useRoute();

    const commpPath = computed(() => route.path);
    if (commpPath.value == "/") path.value = true;

    return { path };
  },
};
</script>

<style module lang="scss">
@import "./PageWrapper.module.scss";
</style>

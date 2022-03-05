<template>
  <MDBContainer fluid :class="$style.PageWrapper">
    <Header />
    <MDBRow :class="$style.Row">
      <MDBCol :class="$style.SideColumn" md="2" />
      <MDBCol :class="$style.MainContent" md="8">
        <slot />
      </MDBCol>
      <MDBCol :class="$style.SideColumn" md="2">
        <div :class="$style['Newsfeed']">
          <NewsFeed />
        </div>
      </MDBCol>
    </MDBRow>
    <Footer />
  </MDBContainer>
</template>

<script>
  import Footer from '../../components/Footer/Footer.vue';
  import Header from '../../components/Header/Header.vue';
  import NewsFeed from '../../components/NewsFeed/NewsFeed.vue';
  import { MDBContainer, MDBCol, MDBRow } from 'mdb-vue-ui-kit';

  export default {
    components: {
      Footer,
      Header,
      MDBCol,
      MDBContainer,
      MDBRow,
      NewsFeed
    }
  };
</script>

<style module lang="scss">
  @import './PageWrapper.module.scss';
</style>

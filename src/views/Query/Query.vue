<template>
  <PageWrapper>
    <h1 :class="[$style.Heading]">Gene mutation data</h1>

    <div :class="[$style.SwitchWrapper]">
      <MDBSwitch
        label="Advanced search"
        v-model="advancedSearchMode"
        :class="[$style.Switch]"
      />
    </div>

    <SimpleSearch v-if="!advancedSearchMode" />
    <!-- <AdvancedQuery v-else/> -->

  </PageWrapper>
</template>

<script>
  import PageWrapper from '../../components/PageWrapper/PageWrapper.vue';
  import { MDBSwitch } from 'mdb-vue-ui-kit';
  import { ref } from 'vue';
  import SimpleSearch from './SimpleSearch/SimpleSearch.vue';
  // import AdvancedSearch from './AdvancedSearch/AdvancedSearch.vue';

  export default {
    name: 'Home',
    components: {
      MDBSwitch, PageWrapper, SimpleSearch
    },
    setup() {
      let advancedSearchMode = ref(false);

      return {advancedSearchMode};
    }
  };
</script>

<style lang="scss" module scoped>
  @import './Query.module.scss';
</style>

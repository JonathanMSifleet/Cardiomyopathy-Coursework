<template>
  <PageWrapper> {{ title }} </PageWrapper>
</template>

<script>
import PageWrapper from "../../hoc/PageWrapper/PageWrapper.vue";

export default {
  name: "Home",
  components: {
    PageWrapper,
  },
  setup() {
    const title = "Welcome";

    return { title };
  },
};
</script>

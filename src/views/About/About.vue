<template>
  <PageWrapper> {{ title }} </PageWrapper>
</template>

<script>
import PageWrapper from "../../hoc/PageWrapper/PageWrapper.vue";

export default {
  name: "About",
  components: {
    PageWrapper,
  },
  setup() {
    const title = "About";

    return { title };
  },
};
</script>

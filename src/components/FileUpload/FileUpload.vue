<template>
  <div :class="$style.FileUploadWrapper">
    <MDBFile v-model="fileUpload" :class="$style.FileUpload" />
  </div>

  <ButtonSpinner v-if="isSubmitting" />
  <MDBBtn
    v-else
    color="primary"
    :class="$style.SubmitButton"
    :disabled="fileUpload.length === 0"
    @click="shouldSubmitData = true"
  >
    Submit
  </MDBBtn>
</template>

<script>
  import store from '../../services/store';
  import { MDBBtn, MDBFile } from 'mdb-vue-ui-kit';
  import { ref, watch } from 'vue';
  import { collection, addDoc } from 'firebase/firestore';
  import ButtonSpinner from '../ButtonSpinner/ButtonSpinner.vue';

  export default {
    components: {
      ButtonSpinner, MDBBtn, MDBFile
    },
    setup() {
      let fileUpload = ref([]);
      let isSubmitting = ref(false);
      const shouldSubmitData = ref(false);

      const handleFileUpload = async (parsableData) => {
        isSubmitting.value = true;

        try {
          const parsedData = JSON.parse(parsableData);

          const database = await store.database;
          const tasks = [];

          parsedData.forEach(doc => {
            tasks.push(addDoc(collection(database, 'experimentalData'), doc));
          });

          await Promise.all(tasks);
        } catch (error) {
          console.error(error);
        }

        shouldSubmitData.value = false;
        fileUpload.value = [];

        isSubmitting.value = false;
      };

      watch([fileUpload, shouldSubmitData], () => {
        if (!shouldSubmitData.value) return;

        const reader = new FileReader();

        reader.readAsText(fileUpload.value[0]);
        reader.onload = () => {
          handleFileUpload(reader.result);
        };
      });

      return { fileUpload, isSubmitting, shouldSubmitData };
    }
  };
</script>

<style lang="scss" scoped module>
  @import './FileUpload.module.scss';
</style>

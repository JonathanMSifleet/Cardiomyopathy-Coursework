<template>
  <div :class="$style.FileUploadWrapper">
    <div :class="$style.RadioGroup">
      <MDBRadio
        v-for="(formatType) in formatTypes"
        :key="formatType"
        v-model="radioFormat"
        :label="formatType"
        :value="formatType"
        inline
      />
    </div>

    <div :class="[$style.FileUploadComponentWrapper]">
      <MDBFile v-model="fileUpload" :class="$style.FileUpload" />
    </div>

    <MDBBtn
      color="primary"
      aria-controls="collapsibleContent1"
      :class="[[$style.CollapseButton], 'ms-3']"
      @click="showHowToFormat"
    >
      How to format {{ radioFormat }}
    </MDBBtn>
    <ButtonSpinner v-if="isSubmitting" :class="$style.ButtonSpinner" />
    <MDBBtn
      v-else
      color="primary"
      :class="$style.SubmitButton"
      :disabled="fileUpload.length === 0"
      @click="shouldSubmitData = true"
    >
      Upload File
    </MDBBtn>
  </div>
  <div
    v-if="showFormatVisible"
    :class="$style.ExampleWrapper"
  >
    <!-- do not format this pre tag! -->
    <pre
      div
      :class="[$style.InstructionText, ' animate__animated ',
               [showFormatInstructions ? 'animate__bounceInDown' : 'animate__bounceOutUp']]"
      :style="[!showFormatInstructions && 'display: none']"
    >{{ determineFormatInstructions() }}</pre>
  </div>

  <p v-if="statusMessage !== ''" :class="$style.StatusMessage">
    {{ statusMessage }}
  </p>
</template>

<script>
  import ButtonSpinner from '../ButtonSpinner/ButtonSpinner.vue';
  import csv from 'csvtojson';
  import getUser from '../../composables/getUser';
  import store from '../../services/store';
  import { MDBBtn, MDBFile, MDBRadio } from 'mdb-vue-ui-kit';
  import { XMLParser } from 'fast-xml-parser';
  import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
  import { parse as parseYaml } from 'yaml';
  import { ref, watch } from 'vue';

  export default {
    components: { ButtonSpinner, MDBBtn, MDBFile, MDBRadio },
    setup() {
      const { currentUser } = getUser();
      let fileUpload = ref([]);
      const formatTypes = ref([
        'JSON',
        'YAML',
        'XML',
        'CSV'
      ]);
      const shouldSubmitData = ref(false);
      let isSubmitting = ref(false);
      let radioFormat = ref('JSON');
      let showFormatInstructions = ref(false);
      let statusMessage = ref('');

      const determineFormatInstructions = () => {
        const intermediateText = require(`./exampleData/${radioFormat.value.toLowerCase()}.txt`);
        return intermediateText.default.toString().replaceAll('\\n', '\n').trim();
      };

      const handleFileFormat = async parsableData => {
        isSubmitting.value = true;

        try {
          switch (radioFormat.value) {
          case 'YAML':
            return uploadData(parseYaml(parsableData));
          case 'XML':
            return uploadData(new XMLParser().parse(parsableData).root.row);
          case 'CSV':
            return uploadData(await csv().fromString(parsableData));
          default:
            return uploadData(JSON.parse(parsableData));
          }
        } catch (error) {
          isSubmitting.value = false;
          statusMessage.value = 'Data formatted incorrectly';
        }
      };

      const uploadData = async data => {
        const database = await store.database;
        const tasks = [];

        data.forEach(doc =>
          tasks.push(
            addDoc(collection(database, 'hcmData'), {
              ...doc,
              createdAt: serverTimestamp(),
              createdByUser: true,
              userId: currentUser.value.uid
            })
          )
        );

        await Promise.all(tasks);

        shouldSubmitData.value = false;
        fileUpload.value = [];

        isSubmitting.value = false;
        alert('Data uploaded successfully');
      };

      watch([fileUpload, shouldSubmitData], () => {
        statusMessage.value = '';
        if (!shouldSubmitData.value) return;

        const reader = new FileReader();

        reader.readAsText(fileUpload.value[0]);
        reader.onload = () => {
          handleFileFormat(reader.result);
        };
      });

      return { determineFormatInstructions, fileUpload, formatTypes, isSubmitting, radioFormat, shouldSubmitData,
               showFormatInstructions, statusMessage };
    }
  };
</script>

<style lang="scss" scoped module>
@import "./FileUpload.module.scss";
</style>

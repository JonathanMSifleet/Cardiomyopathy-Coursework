<template>
  <PageWrapper>
    <MDBCard text="center" :class="[$style.MainCard]">
      <MDBCardBody :class="$style.CardBody">
        <MDBCardTitle :class="[[$style.CardTitle], 'mt-4']">
          Gene Mutation Data
        </MDBCardTitle>
        <MDBCardText>
          <p
            :class="[[$style.UploadFileInstructions], 'mt-5']"
          >
            Upload a file containing experimental data:
          </p>
          <div :class="$style.FileUploadWrapper">
            <FileUpload />
          </div>
          <p :class="[[$style.ManualDataInstructions], 'mt-5']">
            Or, insert it manually:
          </p>
          <form>
            <MDBRow :class="[$style.Row, 'mt-5', 'mb-5']">
              <MDBCol md="4" class="mt-4">
                <select
                  id="geneMutations"
                  v-model="selectedMutation"
                  name="gene-mutations"
                  :class="[$style.MutationSelect, 'form-select', 'mb-4']"
                  aria-label="Default select example"
                  required
                >
                  <option
                    v-for="key in geneMutations"
                    :key="key"
                    :disabled="key === 'Please select'"
                    :value="key"
                  >
                    {{ key }}
                  </option>
                </select>
              </MDBCol>

              <MDBCol v-if="showGenderInput" md="8">
                <span :class="$style.DeleteInput" @click="showGenderInput = !showGenderInput">x</span>
                <MDBInput v-model="info.gender" type="text" label="Gender" />
              </MDBCol>
            </MDBRow>

            <MDBRow :class="[$style.BottomRow]">
              <MDBCol
                v-for="input in activeDataInputs"
                :key="input"
                md="4"
                class="mb-4"
                :class="$style.InputWrapper"
              >
                <span :class="$style.DeleteInput" @click="deleteInput(input)">x</span>
                <MDBInput
                  v-model="info[input]"
                  :type="defaultInputs.includes(input) ? 'number' : 'text'"
                  :label="mapKeyToWords(input)"
                  :class="$style.ExperimentalDataInput"
                />
              </MDBCol>
              <MDBCol md="4" class="mt-4">
                <MDBInput v-model="newInput" type="text" label="New input name" />
              </MDBCol>
              <MDBCol md="2" class="mt-4">
                <MDBBtn
                  color="primary"
                  :disabled="newInput.length === 0"
                  :class="$style.AddInputButton"
                  @click="createNewInput"
                >
                  Add new input
                </MDBBtn>
              </MDBCol>
            </MDBRow>
            <MDBRow class="mb-4 mt-5">
              <MDBCol md="4">
                <MDBCheckbox v-model="info.scar" label="Fibrosis" />
                <MDBCheckbox v-model="info.ApicalHCM" label="Apical HCM" wrapper-class="mb-2" />
              </MDBCol>
              <MDBCol md="4">
                <MDBCheckbox v-model="info.SuddenCardiacDeath" label="Sudden Cardiac Death" />
                <MDBCheckbox v-model="info.Hypertension" label="Hypertension" wrapper-class="mb-2" />
              </MDBCol>
              <MDBCol md="4">
                <MDBCheckbox v-model="info.Diabetes" label="Diabetes" />
                <MDBCheckbox v-model="info.Myectomy" label="Myectomy" wrapper-class="mb-2" />
              </MDBCol>
            </MDBRow>
            <MDBCardFooter>
              <div
                :class="[$style.Footer, 'w-100', 'p-4', 'd-flex', 'align-items-center', 'justify-content-center']"
              >
                <MDBBtn
                  :disabled="selectedMutation === 'Please select'"
                  color="primary"
                  @click="submitExperimentalData"
                >
                  Submit
                </MDBBtn>
              </div>
            </MDBCardFooter>
          </form>
        </MDBCardText>
      </MDBCardBody>
    </MDBCard>
  </PageWrapper>
</template>

<script>
  import FileUpload from '../../components/FileUpload/FileUpload.vue';
  import PageWrapper from '../../components/PageWrapper/PageWrapper.vue';
  import getUser from '../../composables/getUser';
  import mapKeyToWords from '../../utils/mapKeyToWords';
  import store from '../../services/store';
  import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
  import { ref, reactive } from '@vue/reactivity';
  import { useRouter } from 'vue-router';
  import { watchEffect } from 'vue';
  import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardFooter,
    MDBCardText,
    MDBCardTitle,
    MDBCheckbox,
    MDBCol,
    MDBInput,
    MDBRow
  } from 'mdb-vue-ui-kit';

  export default {
    name: 'ExperimentalData',
    components: {
      FileUpload,
      MDBBtn,
      MDBCard,
      MDBCardBody,
      MDBCardFooter,
      MDBCardText,
      MDBCardTitle,
      MDBCheckbox,
      MDBCol,
      MDBInput,
      MDBRow,
      PageWrapper
    },
    setup() {
      const { currentUser } = getUser();
      const activeDataInputs = reactive([
        'ledv',
        'redv',
        'lesv',
        'resv',
        'lvef',
        'rvef',
        'lvmass',
        'lsv',
        'rsv',
        'AgeatMRI'
      ]);
      const defaultInputs = reactive([
        'ledv',
        'redv',
        'lesv',
        'resv',
        'lvef',
        'rvef',
        'lvmass',
        'lsv',
        'rsv',
        'AgeatMRI'
      ]);
      const geneMutations = reactive([
        'Please select',
        'MYH7',
        'MYBPC3',
        'TNNT2',
        'ACTC',
        'TPM1',
        'TNNCI',
        'TNNI3',
        'MYL2',
        'TTN'
      ]);
      const info = reactive({
        userId: currentUser.value.uid,
        ledv: '',
        redv: '',
        lesv: '',
        resv: '',
        lvef: '',
        rvef: '',
        lvmass: '',
        lsv: '',
        rsv: '',
        Gender: '',
        scar: false,
        AgeatMRI: false,
        ApicalHCM: false,
        SuddenCardiacDeath: false,
        Hypertension: false,
        Diabetes: false,
        Myectomy: false
      });
      let newInput = ref('');
      const router = useRouter();
      const selectedMutation = ref('Please select');
      let showGenderInput = ref(true);

      const createNewInput = () => {
        if (newInput.value) activeDataInputs.push(newInput.value);
        newInput.value = '';
      };

      const deleteInput = key => {
        if (!activeDataInputs.includes(key)) return;

        activeDataInputs.splice(activeDataInputs.indexOf(key), 1);
        delete info[key];
      };

      const submitExperimentalData = async () => {
        if (
          info.gender.toLowerCase() !== 'male' &&
          info.gender.toLowerCase() !== 'female'
        ) {
          alert('Gender must me \'male\' or \'female\''); return;
        }

        for (const key in info) {
          if (info[key] === '' || info[key] === undefined) delete info[key];
        }

        const docRef = await addDoc(collection(await store.database, 'hcmData'), {
          ...info,
          GeneMutation: selectedMutation.value,
          createdAt: serverTimestamp(),
          createdByUser: true,
          deletedAt: null
        });

        if (process.env.DEVELOPMENT)
          console.log('Document written with ID: ', docRef.id);

        alert('A new document has been added.');
        router.push('/');
      };

      //redirects anytime the user is signed out
      //whilst still on this page
      watchEffect(() => {
        if (!currentUser.value) router.push('/login');
      });

      return { activeDataInputs, createNewInput, defaultInputs, deleteInput, geneMutations, info, mapKeyToWords,
               newInput, selectedMutation, showGenderInput, submitExperimentalData };
    }
  };
</script>

<style module lang="scss">
  @import "./ExperimentalData.module.scss";
</style>

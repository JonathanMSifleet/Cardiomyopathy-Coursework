<template>
  <PageWrapper>
    <MDBCard text="center" :class="[$style.MainCard, 'mt-5']">
      <MDBCardBody :class="$style.CardBody">
        <MDBCardTitle :class="$style.CardTitle">
          Gene Mutation Data
        </MDBCardTitle>
        <MDBCardText>
          <p :class="$style.UploadFileInstructions">
            Upload a file containing experimental data:
          </p>
          <div :class="$style.FileUploadWrapper">
            <FileUpload />
          </div>
          <p :class="$style.ManualDataInstructions">
            Or, insert it manually:
          </p>
          <form>
            <MDBRow :class="[$style.Row, 'mt-5', 'mb-5']">
              <MDBCol md="6">
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

              <MDBCol v-if="showGenderInput" md="6">
                <MDBInput v-model="info.gender" type="text" label="Gender" />
                <span
                  :class="$style.DeleteInput"
                  @click="showGenderInput = !showGenderInput"
                >
                  x
                </span>
              </MDBCol>
            </MDBRow>

            <MDBRow :class="[$style.BottomRow, 'mb-5']">
              <MDBCol
                v-for="input in dataInputs"
                :key="input"
                md="4"
                class="mb-4"
                :class="$style.InputWrapper"
              >
                <MDBInput
                  v-model="info[input]"
                  type="number"
                  :label="mapKeyToWords(input)"
                  :class="$style.ExperimentalDataInput"
                />
                <span :class="$style.DeleteInput" @click="deleteInput(input)">
                  x
                </span>
              </MDBCol>
              <MDBCol md="4">
                <MDBInput
                  v-model="newInput"
                  type="text"
                  label="New input name"
                />
              </MDBCol>
              <MDBCol md="2">
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
            <MDBRow class="mb-4">
              <MDBCol md="4">
                <MDBCheckbox v-model="info.fibrosis" label="Fibrosis" />
                <MDBCheckbox
                  v-model="info.apicalHcm"
                  label="Apical HCM"
                  wrapper-class="mb-2"
                />
              </MDBCol>
              <MDBCol md="4">
                <MDBCheckbox
                  v-model="info.suddenCardiacDeath"
                  label="Sudden Cardiac Death"
                />
                <MDBCheckbox
                  v-model="info.hypertension"
                  label="Hypertension"
                  wrapper-class="mb-2"
                />
              </MDBCol>
              <MDBCol md="4">
                <MDBCheckbox v-model="info.diabetes" label="Diabetes" />
                <MDBCheckbox
                  v-model="info.myectomy"
                  label="Myectomy"
                  wrapper-class="mb-2"
                />
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
    MDBRow,
    MDBCol,
    MDBInput,
    MDBCheckbox,
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBCardTitle,
    MDBCardText,
    MDBCardFooter
  } from 'mdb-vue-ui-kit';

  export default {
    name: 'ExperimentalData',
    components: {
      FileUpload,
      MDBBtn,
      MDBCard,
      MDBCardBody,
      MDBCardFooter,
      MDBCardHeader,
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
      let newInput = ref('');
      const router = useRouter();
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
      const selectedMutation = ref('Please select');
      let showGenderInput = ref(true);
      const info = reactive({
        userId: currentUser.value.uid,
        ledv: '',
        redv: '',
        lesv: '',
        resv: '',
        lvef: '',
        rvef: '',
        lvmass: '',
        rvmass: '',
        lsv: '',
        rsv: '',
        gender: '',
        fibrosis: false,
        ageAtMri: false,
        apicalHcm: false,
        suddenCardiacDeath: false,
        hypertension: false,
        diabetes: false,
        myectomy: false
      });
      const dataInputs = reactive([
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

      const createNewInput = () => {
        if (newInput.value) dataInputs.push(newInput.value);
        newInput.value = '';
      };

      const deleteInput = (key) => {
        if (!dataInputs.includes(key)) return;

        dataInputs.splice(dataInputs.indexOf(key), 1);
        delete info[key];
      };

      const submitExperimentalData = async () => {
        if (info.gender.toLowerCase() !== 'male' && info.gender.toLowerCase() !== 'female') {
          alert('Gender must me \'male\' or \'female\''); return;
        }

        for (const key in info) {
          if (info[key] === '' || info[key] === undefined) delete info[key];
        }

        const docRef = await addDoc(collection(await store.database, 'hcmData'), {
          ...info,
          GeneMutation: selectedMutation.value,
          createdAt: serverTimestamp(),
          deletedAt: null
        });
        console.log('Document written with ID: ', docRef.id);

        alert('A new document has been added.');
        router.push('/');
      };

      //redirects anytime the user is signed out
      //whilst still on this page
      watchEffect(() => {
        if (!currentUser.value) router.push('/login');
      });

      return { createNewInput, dataInputs, deleteInput, geneMutations, info, mapKeyToWords, newInput,
               selectedMutation, showGenderInput, submitExperimentalData };
    }
  };
</script>

<style module lang="scss">
  @import "./ExperimentalData.module.scss";
</style>

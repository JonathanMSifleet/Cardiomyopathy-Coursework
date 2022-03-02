<template>
  <PageWrapper>
    <MDBCard text="center" class="mt-5">
      <MDBCardHeader>Featured</MDBCardHeader>
      <MDBCardBody>
        <MDBCardTitle>Gene Mutation Data</MDBCardTitle>
        <MDBCardText>
          <form>
            <MDBRow>
              <MDBCol md="4">
                <select
                  id="geneMutations"
                  v-model="selectedMutation"
                  name="gene-mutations"
                  class="form-select mb-4"
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
            </MDBRow>
            <MDBRow class="mb-3">
              <MDBCol>
                <div v-for="input in dataInputs" :key="input">
                  <MDBInput
                    v-model="info[input]"
                    type="number"
                    :label="input"
                    wrapper-class="mb-4"
                  />
                </div>
                <div>
                  <MDBInput
                    v-model="info[Gender]"
                    type="text"
                    label="Gender"
                    wrapper-class="mb-4"
                  />
                </div>
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
                class="
                  w-100
                  p-4
                  d-flex
                  align-items-center
                  justify-content-center
                "
              >
                <MDBBtn color="primary" @click="experimentalData">
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
  import PageWrapper from '../../components/PageWrapper/PageWrapper.vue';
  import getUser from '../../composables/getUser';
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
        'rvmass',
        'lsv',
        'rsv',
        'AgeatMRI'
      ]);

      const experimentalData = async () => {
        for (const key in info) {
          if (info[key] === '' || info[key] === undefined) delete info[key];
        }

        if (document.getElementById('geneMutations').value === 'Please select') {
          alert('Please select a valid Gene mutation'); return;
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

      return { dataInputs, info, geneMutations, selectedMutation, experimentalData };
    }
  };
</script>

<style module lang="scss">
  @import "./ExperimentalData.module.scss";
</style>

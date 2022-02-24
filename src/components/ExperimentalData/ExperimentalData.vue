<template>
  <div class="container">
    <MDBCard text="center" class="mt-5">
      <MDBCardHeader>Featured</MDBCardHeader>
      <MDBCardBody>
        <MDBCardTitle>Gene Mutation Data</MDBCardTitle>
        <MDBCardText>
          <form>
            <MDBRow>
              <MDBCol md="4">
                <select
                  name="gene-mutations"
                  class="form-select mb-4"
                  aria-label="Default select example"
                  v-model="selectedMutation"
                  required
                >
                  <option value="" disabled>Select Gene Mutation</option>
                  <option value="MYH7">MYH7</option>
                  <option value="MYBPC3">MYBPC3</option>
                  <option value="TNNT2">TNNT2</option>
                  <option value="ACTC">ACTC</option>
                  <option value="TPM1">TPM1</option>
                  <option value="TNNCI">TNNCI</option>
                  <option value="TNNI3">TNNI3</option>
                  <option value="MYL2">MYL2</option>
                  <option value="TTN">TTN</option>
                </select>
              </MDBCol>
            </MDBRow>
            <MDBRow class="mb-3">
              <MDBCol>
                <MDBInput
                  type="number"
                  label="LEDV"
                  id="form2Email"
                  v-model="info.ledv"
                  wrapperClass="mb-4"
                  step="0.00000000001"
                />
                <MDBInput
                  type="number"
                  label="REDV"
                  v-model="info.redv"
                  wrapperClass="mb-4"
                  step="0.00000000001"
                />
                <MDBInput
                  type="number"
                  label="LESV"
                  v-model="info.lesv"
                  wrapperClass="mb-4"
                  step="0.00000000001"
                />
                <MDBInput
                  type="number"
                  label="RESV"
                  v-model="info.resv"
                  wrapperClass="mb-4"
                  step="0.00000000001"
                />
                <MDBInput
                  type="number"
                  label="LVEF "
                  v-model="info.lvef"
                  wrapperClass="mb-4"
                  step="0.00000000001"
                />
                <MDBInput
                  type="number"
                  label="RVEF"
                  v-model="info.rvef"
                  wrapperClass="mb-4"
                  step="0.00000000001"
                />
                <MDBInput
                  type="number"
                  label="LVMASS"
                  v-model="info.lvmass"
                  wrapperClass="mb-4"
                  step="0.00000000001"
                />
                <MDBInput
                  type="number"
                  label="RVMASS"
                  v-model="info.rvmass"
                  wrapperClass="mb-4"
                  step="0.00000000001"
                />
                <MDBInput
                  type="number"
                  label="LSV"
                  v-model="info.lsv"
                  wrapperClass="mb-4"
                  step="0.00000000001"
                />
                <MDBInput
                  type="number"
                  label="RSV"
                  v-model="info.rsv"
                  wrapperClass="mb-4"
                  step="0.00000000001"
                />
                <MDBInput
                  type="number"
                  label="Age at MRI"
                  v-model="info.ageAtMri"
                  wrapperClass="mb-4"
                  step="0.00000000001"
                />
              </MDBCol>
            </MDBRow>
            <MDBRow class="mb-4">
              <MDBCol md="3">
                <MDBCheckbox
                  label="Female"
                  v-model="info.female"
                  wrapperClass="mb-2"
                />
                <MDBCheckbox label="Fibrosis" v-model="info.fibrosis" />
              </MDBCol>
              <MDBCol md="4">
                <MDBCheckbox
                  label="Apical HCM"
                  v-model="info.apicalHcm"
                  wrapperClass="mb-2"
                />
                <MDBCheckbox
                  label="Sudden Cardiac Death"
                  v-model="info.suddenCardiacDeath"
                />
              </MDBCol>
              <MDBCol md="3">
                <MDBCheckbox
                  label="Hypertension"
                  v-model="info.hypertension"
                  wrapperClass="mb-2"
                />
                <MDBCheckbox label="Diabetes" v-model="info.diabetes" />
              </MDBCol>
              <MDBCol md="2">
                <MDBCheckbox
                  label="Myectomy"
                  v-model="info.myectomy"
                  wrapperClass="mb-2"
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
                <MDBBtn @click="experimentalData" color="primary">
                  Submit
                </MDBBtn>
              </div>
            </MDBCardFooter>
          </form>
        </MDBCardText>
      </MDBCardBody>
    </MDBCard>
  </div>
</template>

<script>
import { ref, reactive } from "@vue/reactivity";
import { collection, addDoc } from "firebase/firestore";
import getUser from "../../composables/getUser";
import store from "../../services/store";
import {
  MDBRow,
  MDBCol,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBIcon,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardTitle,
  MDBCardText,
  MDBCardFooter,
} from "mdb-vue-ui-kit";
export default {
  name: "ExperimentalData",
  components: {
    MDBRow,
    MDBCol,
    MDBInput,
    MDBCheckbox,
    MDBBtn,
    MDBIcon,
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBCardTitle,
    MDBCardText,
    MDBCardFooter,
  },
  setup() {
    const { currentUser } = getUser();
    const selectedMutation = ref("");
    const info = reactive({
      userId: currentUser.value.uid,
      ledv: "",
      redv: "",
      lesv: "",
      resv: "",
      lvef: "",
      rvef: "",
      lvmass: "",
      rvmass: "",
      lsv: "",
      rsv: "",
      female: false,
      fibrosis: false,
      ageAtMri: false,
      apicalHcm: false,
      suddenCardiacDeath: false,
      hypertension: false,
      diabetes: false,
      myectomy: false,
    });

    async function experimentalData() {
      for (const key in info) {
        if (info[key] === "" || info[key] === undefined) {
          delete info[key];
        }
      }

      const docRef = await addDoc(collection(await store.database, "hcmData"), {
        ...info,
        [selectedMutation.value]: true,
      });
      console.log("Document written with ID: ", docRef.id);
    }

    return {
      info,
      selectedMutation,
      experimentalData,
    };
  },
};
</script>

<style module lang="scss">
@import "./ExperimentalData.module.scss";
</style>

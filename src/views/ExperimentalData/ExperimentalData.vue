<template>
  <PageWrapper>
    <MDBCard text="center" class="mt-5">
      <MDBCardHeader>Featured</MDBCardHeader>
      <MDBCardBody>
        <MDBCardTitle>Gene Mutation Data</MDBCardTitle>
        <MDBCardText>
          <form>
            <MDBRow class="mt-5 mb-5">
              <MDBCol md="6">
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

              <MDBCol md="6" v-if="showGenderInput">
                <MDBInput v-model="info[Gender]" type="text" label="Gender" />
                <span
                  :class="$style.DeleteInput"
                  @click="showGenderInput = !showGenderInput"
                >
                  x
                </span>
              </MDBCol>
            </MDBRow>

            <MDBRow class="mb-5">
              <MDBCol
                md="4"
                v-for="input in dataInputs"
                :key="input"
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
                  <MDBBtn color="primary" @click="createNewInput">
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
import PageWrapper from "../../components/PageWrapper/PageWrapper.vue";
import getUser from "../../composables/getUser";
import mapKeyToWords from "../../utils/mapKeyToWords";
import store from "../../services/store";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, reactive } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { watchEffect } from "vue";
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
  MDBCardFooter,
} from "mdb-vue-ui-kit";

export default {
  name: "ExperimentalData",
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
    PageWrapper,
  },
  setup() {
    const { currentUser } = getUser();
    let newInput = ref("");
    const router = useRouter();
    const geneMutations = reactive([
      "Please select",
      "MYH7",
      "MYBPC3",
      "TNNT2",
      "ACTC",
      "TPM1",
      "TNNCI",
      "TNNI3",
      "MYL2",
      "TTN",
    ]);
    const selectedMutation = ref("Please select");
    let showGenderInput = ref(true);
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
      gender: "",
      fibrosis: false,
      ageAtMri: false,
      apicalHcm: false,
      suddenCardiacDeath: false,
      hypertension: false,
      diabetes: false,
      myectomy: false,
    });
    const dataInputs = reactive([
      "ledv",
      "redv",
      "lesv",
      "resv",
      "lvef",
      "rvef",
      "lvmass",
      "lsv",
      "rsv",
      "AgeatMRI",
    ]);

    const createNewInput = () => {
      if (newInput.value) dataInputs.push(newInput.value);
      newInput.value = "";
    };

    const deleteInput = (key) => {
      if (!dataInputs.includes(key)) return;

      dataInputs.splice(dataInputs.indexOf(key), 1);
      delete info[key];
    };

    const experimentalData = async () => {
      for (const key in info) {
        if (info[key] === "" || info[key] === undefined) delete info[key];
      }

      if (document.getElementById("geneMutations").value === "Please select") {
        alert("Please select a valid Gene mutation");
        return;
      }

      const docRef = await addDoc(collection(await store.database, "hcmData"), {
        ...info,
        GeneMutation: selectedMutation.value,
        createdAt: serverTimestamp(),
        deletedAt: null,
      });
      console.log("Document written with ID: ", docRef.id);

      alert("A new document has been added.");
      router.push("/");
    };

    //redirects anytime the user is signed out
    //whilst still on this page
    watchEffect(() => {
      if (!currentUser.value) router.push("/login");
    });

    return {
      createNewInput,
      dataInputs,
      deleteInput,
      experimentalData,
      geneMutations,
      info,
      mapKeyToWords,
      newInput,
      selectedMutation,
      showGenderInput,
    };
  },
};
</script>

<style module lang="scss">
@import "./ExperimentalData.module.scss";
</style>

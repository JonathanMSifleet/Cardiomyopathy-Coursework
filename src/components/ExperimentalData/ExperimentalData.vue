<template>
  <div class="container">
    <form>
      <select
        name="gene-mutations"
        class="form-select"
        aria-label="Default select example"
        @change="onChange($event)"
      >
        <option value="">
          ---- Select Gene Mutation ----
        </option>
        <option value="MYH7">
          MYH7
        </option>
        <option value="MYBPC3">
          MYBPC3
        </option>
        <option value="TNNT2">
          TNNT2
        </option>
        <option value="ACTC">
          ACTC
        </option>
        <option value="TPM1">
          TPM1
        </option>
        <option value="TNNCI">
          TNNCI
        </option>
        <option value="TNNI3">
          TNNI3
        </option>
        <option value="MYL2">
          MYL2
        </option>
        <option value="TTN">
          TTN
        </option>
      </select>
      <div class="form-outline mb-4">
        <input
          id="form1Example1"
          v-model="ledv"
          type="number"
          class="form-control"
        >
        <label class="form-label" for="form1Example1">LEDV</label>
      </div>
      <div class="form-outline mb-4">
        <input
          id="form1Example1"
          v-model="redv"
          type="number"
          class="form-control"
        >
        <label class="form-label" for="form1Example1">REDV</label>
      </div>
      <div class="form-outline mb-4">
        <input
          id="form1Example2"
          v-model="lesv"
          type="number"
          class="form-control"
        >
        <label class="form-label" for="form1Example2">LESV</label>
      </div>
      <div class="form-outline mb-4">
        <input
          id="form1Example2"
          v-model="resv"
          type="number"
          class="form-control"
        >
        <label class="form-label" for="form1Example2">RESV</label>
      </div>
      <div class="form-outline mb-4">
        <input
          id="form1Example1"
          v-model="lvef"
          type="number"
          class="form-control"
        >
        <label class="form-label" for="form1Example1">LVEF</label>
      </div>
      <div class="form-outline mb-4">
        <input
          id="form1Example1"
          v-model="rvef"
          type="number"
          class="form-control"
        >
        <label class="form-label" for="form1Example1">RVEF</label>
      </div>
      <div class="form-outline mb-4">
        <input
          id="form1Example2"
          v-model="lvmass"
          type="number"
          class="form-control"
        >
        <label class="form-label" for="form1Example2">LVMASS</label>
      </div>
      <div class="form-outline mb-4">
        <input
          id="form1Example2"
          v-model="rvmass"
          type="number"
          class="form-control"
        >
        <label class="form-label" for="form1Example2">RVMASS</label>
      </div>
      <div class="form-outline mb-4">
        <input
          id="form1Example1"
          v-model="lsv"
          type="number"
          class="form-control"
        >
        <label class="form-label" for="form1Example1">LSV</label>
      </div>
      <div class="form-outline mb-4">
        <input
          id="form1Example1"
          v-model="rsv"
          type="number"
          class="form-control"
        >
        <label class="form-label" for="form1Example1">RSV</label>
      </div>
      <div class="form-outline mb-4">
        <input
          id="form1Example2"
          v-model="ageAtMri"
          type="number"
          class="form-control"
        >
        <label class="form-label" for="form1Example2">Age at MRI</label>
      </div>

      <!-- 2 column grid layout for inline styling -->
      <div class="row mb-4">
        <div class="col d-flex justify-content-center">
          <!-- Checkbox -->
          <div class="form-check">
            <input
              id="form1Example3"
              v-model="female"
              class="form-check-input"
              type="checkbox"
              value=""
            >
            <label class="form-check-label" for="form1Example3">Female</label>
          </div>
          <div class="form-check">
            <input
              id="form1Example3"
              v-model="fibrosis"
              class="form-check-input"
              type="checkbox"
              value=""
            >
            <label class="form-check-label" for="form1Example3">Fibrosis</label>
          </div>
          <div class="form-check">
            <input
              id="form1Example3"
              v-model="apicalHcm"
              class="form-check-input"
              type="checkbox"
              value=""
            >
            <label class="form-check-label" for="form1Example3">Apical HCM</label>
          </div>
          <div class="form-check">
            <input
              id="form1Example3"
              v-model="suddenCardiacDeath"
              class="form-check-input"
              type="checkbox"
              value=""
            >
            <label class="form-check-label" for="form1Example3">Sudden Cardiac Death</label>
          </div>
          <div class="form-check">
            <input
              id="form1Example3"
              v-model="hypertension"
              class="form-check-input"
              type="checkbox"
              value=""
            >
            <label class="form-check-label" for="form1Example3">Hypertension</label>
          </div>
          <div class="form-check">
            <input
              id="form1Example3"
              v-model="diabetes"
              class="form-check-input"
              type="checkbox"
              value=""
            >
            <label class="form-check-label" for="form1Example3">Diabetes</label>
          </div>
          <div class="form-check">
            <input
              id="form1Example3"
              v-model="myectomy"
              class="form-check-input"
              type="checkbox"
              value=""
            >
            <label class="form-check-label" for="form1Example3">Myectomy</label>
          </div>
        </div>
      </div>

      <!-- Submit button -->
      <button type="submit" class="btn btn-primary btn-block" @click="experimentalData">
        Submit
      </button>
    </form>
  </div>
</template>

<script>
  import { ref } from '@vue/reactivity';
  import { doc, setDoc } from 'firebase/firestore';
  import { v4 as uuid } from 'uuid';
  import store from '../../services/store';
  export default {
    name: 'ExperimentalData',
    setup() {
      const selectedMutation = ref('');
      const ledv = ref('');
      const redv = ref('');
      const lesv = ref('');
      const resv = ref('');
      const lvef = ref('');
      const rvef = ref('');
      const lvmass = ref('');
      const rvmass = ref('');
      const lsv = ref('');
      const rsv = ref('');
      const female = ref(false);
      const fibrosis = ref(false);
      const ageAtMri = ref(false);
      const apicalHcm = ref(false);
      const suddenCardiacDeath = ref(false);
      const hypertension = ref(false);
      const diabetes = ref(false);
      const myectomy = ref(false);

      function onChange(e) {
        console.log(e.target.value);
        selectedMutation.value = e.target.value;
      }

      async function experimentalData() {
        const info = {
          geneMutation: selectedMutation.value,
          ledv: ledv.value,
          redv: redv.value,
          lesv: lesv.value,
          resv: resv.value,
          lvef: lvef.value,
          rvef: rvef.value,
          lvmass: lvmass.value,
          rvmass: rvmass.value,
          lsv: lsv.value,
          rsv: rsv.value,
          female: female.value,
          fibrosis: fibrosis.value,
          ageAtMri: ageAtMri.value,
          apicalHcm: apicalHcm.value,
          suddenCardiacDeath: suddenCardiacDeath.value,
          hypertension: hypertension.value,
          diabetes: diabetes.value,
          myectomy: myectomy.value
        };


        for(const key in info) {
          if(info[key] === '' || info[key] === false) {
            delete info[key];
          }
        }

        if (info.geneMutation == '') {
          alert('Please select a Gene mutation');
        } else {
          const result = await setDoc(doc(await store.database, 'hcmData', uuid()), info);
          console.log(result);
        }
      }

      return {
        ledv,
        redv,
        lesv,
        resv,
        lvef,
        rvef,
        lvmass,
        rvmass,
        lsv,
        rsv,
        female,
        fibrosis,
        ageAtMri,
        apicalHcm,
        suddenCardiacDeath,
        hypertension,
        diabetes,
        myectomy,
        experimentalData,
        onChange
      };
    }
  };
</script>

<style module lang="scss">
@import "./ExperimentalData.module.scss";
</style>

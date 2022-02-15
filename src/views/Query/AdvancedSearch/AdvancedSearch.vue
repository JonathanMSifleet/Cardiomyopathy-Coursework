<template>
  <!-- To do:
    - Validate user input
    - Display message on invalid filter
  -->

  <div :class="[$style.ComponentWrapper]">
    <div v-if="filters.length !== 0" :class="[$style.FiltersWrapper]">
      <p> Filters: </p>
      <ul>
        <li
          v-for="(filter, index) in filters"
          :key="index"
          :class="[$style.Filter]"
        >
          {{ filter.fieldPath }} {{ filter.opStr }} {{ filter.value }}
          <img src="../../../assets/svg/Cross.svg" :class="[$style.DeleteFilter]" @click="deleteFilter(index)">
        </li>
      </ul>
    </div>

    <p>Please add a filter:</p>

    <div :class="[$style.FilterWrapper]">
      <div :class="[$style.InputWrapper]">
        <MDBInput
          v-model="queryInput"
          label="Attribute"
          type="text"
          :class="[$style.Input]"
        />
      </div>

      <div :class="[$style.SelectWrapper]">
        <select v-model="selectedOperator" :class="[$style.Select]">
          <option
            v-for="operation in Object.entries(fireStoreOperators)"
            :key="operation"
            :disabled="operation === 'Please select' ? true : false"
          >
            {{ operation[1] }}
          </option>
        </select>
      </div>

      <div :class="[$style.InputWrapper]">
        <MDBInput
          v-model="queryOperand"
          label="Value"
          type="text"
          :class="[$style.Input]"
        />
      </div>

      <MDBBtn
        color="success"
        @click="addFilter"
      >
        Add filter
      </MDBBtn>
    </div>

    <div :class="[$style.CheckboxWrapper]">
      <p>Selected columns:</p>
      <MDBCheckbox
        v-for="(key, index) in optionalTableKeys"
        :key="index"
        :label="key"
        inline
        @click="addKey(key)"
      />
    </div>

    <div :class="[$style.TableWrapper]">
      <p>Results:</p>
      <MDBTable
        bordered
        striped
        responsive
      >
        <thead>
          <tr>
            <th
              v-for="(key, index) in activeTableKeys"
              :key="index"
              scope="col"
            >
              <b>{{ key }}</b>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(dataItem, index) in queryResults" :key="index">
            <td v-for="(key, index2) in activeTableKeys" :key="index2">
              {{ dataItem[key] }}
            </td>
          </tr>
        </tbody>
      </MDBTable>
    </div>
  </div>
</template>

<script>
  import generateQuery from '../../../utils/generateQuery';
  import store from '../../../services/store';
  import { MDBBtn, MDBCheckbox, MDBInput, MDBTable } from 'mdb-vue-ui-kit';
  import { collection, getDocs } from 'firebase/firestore';
  import { reactive, ref, watch } from 'vue';
  import determineKeys from '../../../utils/determineKeys';

  export default {
    name: 'Home',
    components: {
      MDBBtn, MDBCheckbox, MDBInput, MDBTable
    },
    setup() {
      const fireStoreOperators = {
        '<': 'less than',
        '<=': 'less than or equal to',
        '==': 'equal to',
        '>': 'greater than',
        '>=': 'greater than or equal to',
        '!=': 'not equal to'
      };
      let filters = reactive([]);
      let optionalTableKeys = ref([]);
      let queryInput = ref();
      let queryOperand = ref();
      let queryResults = ref([]);
      let selectedOperator = ref();
      const activeTableKeys = ref([
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
        'scar',
        'female',
        'male',
        'AgeatMRI',
        'ApicalHCM',
        'SuddenCardiacDeath',
        'Hypertension',
        'Diabe',
        'Myectomy'
      ]);

      (async () => {
        const results = await getDocs(collection(await store.database, 'hcmData'));
        results.forEach(doc => queryResults.value.push(doc.data()));

        optionalTableKeys.value = determineKeys(queryResults.value);
      })();

      const cleanup = () => {
        queryResults.value = [];
      };

      const addFilter = () => filters.push({
        fieldPath: queryInput.value,
        opStr: Object.keys(fireStoreOperators).find(key => fireStoreOperators[key] === selectedOperator.value),
        value: convertValueToType(queryOperand.value)
      });

      const convertValueToType = (value) => {
        switch(true) {
        case value === 'true' || value === 'True':
          return true;
        case value === 'false' || value === 'False':
          return false;
        default:
          return Number(value);
        }
      };

      const deleteFilter = (index) => filters = filters.splice(index, 1);

      const addKey = (key) => activeTableKeys.value.push(key);

      watch(filters, async () => {
        cleanup();

        console.log('filters', filters);

        queryResults.value = await generateQuery(filters);
      });

      watch(optionalTableKeys, async () => {
        console.log('🚀 ~ file: AdvancedSearch.vue ~ line 179 ~ watch ~ optionalTableKeys', optionalTableKeys.value);
      });

      return { addFilter, addKey, deleteFilter, filters, fireStoreOperators, optionalTableKeys,
               queryInput, queryOperand, queryResults, selectedOperator, activeTableKeys };
    }
  };
</script>

<style lang="scss" scoped module>
  @import './AdvancedSearch.module.scss';
</style>

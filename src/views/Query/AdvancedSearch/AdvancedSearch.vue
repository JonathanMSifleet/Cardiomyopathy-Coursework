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

    <MDBInput
      v-model="queryInput"
      label="Attribute"
      type="text"
      :class="[$style.Input]"
    />

    <select v-model="selectedOperator">
      <option
        v-for="operation in queryOperations"
        :key="operation"
        :disabled="operation === 'Please select' ? true : false"
      >
        {{ operation }}
      </option>
    </select>

    <MDBInput
      v-model="queryOperand"
      label="Value"
      type="text"
      :class="[$style.Input]"
    />
    <MDBBtn
      color="success"
      @click="addFilter"
    >
      Add filter
    </MDBBtn>

    <MDBTable responsive>
      <thead>
        <tr>
          <th
            v-for="(key, index) in tableKeys"
            :key="index"
            scope="col"
          >
            {{ key }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td v-for="(dataItem,index) in queryResults" :key="index">
            {{ dataItem.data[tableKeys[index]] }}
          </td>
        </tr>
      </tbody>
    </MDBTable>
  </div>
</template>

<script>
  import { MDBBtn, MDBInput, MDBTable } from 'mdb-vue-ui-kit';
  import { reactive, ref, watch } from 'vue';
  import generateQuery from '../../../utils/generateQuery';
  import determineKeys from '../../../utils/determineKeys';

  export default {
    name: 'Home',
    components: {
      MDBBtn, MDBInput, MDBTable
    },
    setup() {
      let filters = reactive([]);
      const queryOperations = ['Please select',
                               'less than',
                               'less than or equal to',
                               'equal to',
                               'greater than',
                               'greater than or equal to',
                               'not equal to'];
      let queryInput = ref();
      let queryOperand = ref();
      let queryResults = ref([]);
      let selectedOperator = ref();
      let tableKeys = ref([]);

      const cleanup = () => {
        queryResults.value = [];
      };

      const addFilter = () => filters.push({
        fieldPath: queryInput.value,
        opStr: mapQueryOperationsToFireStoreOperators(selectedOperator.value),
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

      const mapQueryOperationsToFireStoreOperators = (operator) => {
        switch (operator) {
        case 'less than':
          return '<';
        case 'less than or equal to':
          return '<=';
        case 'equal to':
          return '==';
        case 'greater than':
          return '>';
        case 'greater than or equal to':
          return '>=';
        case 'not equal to':
          return '!=';
        }
      };

      watch(filters, async () => {
        cleanup();

        queryResults.value = await generateQuery(filters);
        tableKeys.value = determineKeys(queryResults.value);
        console.log(queryResults.value);
      });

      return { addFilter, deleteFilter, filters, queryOperations, queryInput,
               queryOperand, queryResults, selectedOperator, tableKeys };
    }
  };
</script>

<style lang="scss" scoped module>
  @import './AdvancedSearch.module.scss';
</style>

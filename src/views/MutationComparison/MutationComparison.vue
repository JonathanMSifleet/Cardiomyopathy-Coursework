<template>
  <p> test </p>
  <select v-model="selectedGeneMutationOne" :class="[$style.Select, 'form-select']">
    <option
      v-for="geneMutation in geneMutations"
      :key="geneMutation"
      :disabled="geneMutation === 'Please select'"
    >
      {{ geneMutation }}
    </option>
  </select>

  <select v-model="selectedGeneMutationTwo" :class="[$style.Select, 'form-select']">
    <option
      v-for="geneMutation in geneMutations.splice(indexOf(selectedGeneMutationOne), 1)"
      :key="geneMutation"
      :disabled="geneMutation === 'Please select'"
    >
      {{ geneMutation }}
    </option>
  </select>
</template>

<script>
  import { ref } from 'vue';

  export default {
    name: 'MutationComparison',
    setup() {
      const geneMutations = ref([
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
      let selectedGeneMutationOne = ref('Please select');
      let selectedGeneMutationTwo = ref('Please select');

      return { geneMutations, selectedGeneMutationOne, selectedGeneMutationTwo };
    }
  };
</script>

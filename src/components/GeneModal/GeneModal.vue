<template>
  <!-- Button trigger modal -->
  <MDBBtn
    v-if="showButton()"
    color="primary"
    aria-controls="geneModal"
    @click="geneModal=true, populateModal()"
  >
    Gene Info
  </MDBBtn>
  <MDBModal
    id="geneModal"
    v-model="geneModal"
    tabindex="-1"
    labelledby="geneModalLabel"
  >
    <MDBModalHeader :class="$style.ModalHeader">
      <MDBModalTitle id="geneModalLabel">
        <h2>{{ geneSymbol }}</h2>
      </MDBModalTitle>
    </MDBModalHeader>
    <MDBModalBody>
      <h3 :class="$style.GeneNameHeader">
        {{ geneName }}
      </h3>
      {{ geneDesc }}
    </MDBModalBody>
    <MDBModalFooter>
      <MDBBtn color="primary" @click="geneModal = false">
        Close
      </MDBBtn>
    </MDBModalFooter>
  </MDBModal>
</template>

<script>
  import {
    MDBModal,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBBtn
  } from 'mdb-vue-ui-kit';
  import { onMounted, ref } from 'vue';
  import fetchGeneDetails from '../../composables/getGeneInfo.js';

  export default {
    components: {
      MDBModal,
      MDBModalHeader,
      MDBModalTitle,
      MDBModalBody,
      MDBModalFooter,
      MDBBtn
    },
    props: ['selectedGene'],
    setup (props) {
      const geneModal = ref(false);
      let geneData = null;
      const currentGene = ref('');
      const geneDesc = ref('');
      const geneSymbol = ref('');
      const geneName = ref('');

      //modal is blank for a few seconds on first open
      //maybe add loading spinner?
      const populateModal = async () => {
        if (geneData === null) return;

        currentGene.value = props.selectedGene;
        console.log(currentGene);
        console.log(geneData);

        const geneObj = geneData.filter((gene) => gene.symbol === currentGene.value);

        geneDesc.value = geneObj[0].description;
        geneSymbol.value = geneObj[0].symbol;
        geneName.value = geneObj[0].name;
      };

      const showButton = () => props.selectedGene !== 'Please select';

      onMounted(async () => { geneData = await fetchGeneDetails(); });

      return { geneModal, geneData, currentGene, showButton, geneSymbol, geneName, geneDesc, populateModal };
    }
  };
</script>

<style lang="scss" scoped module>
  @import './GeneModal.module.scss';
</style>

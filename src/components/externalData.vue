<template>
  <div>
    {{result}}
  </div>
</template>

<script>
  import 'regenerator-runtime/runtime';
  export default {
    name: 'externalData',
    setup(){
      //gene symbol with corresponding entrez id in ncbi database
      //possibly store in seperate file
      const geneData = [
        {
          symbol: 'MYH7',
          entrezId: '4625'
        },
        {
          symbol: 'MYBPC3',
          entrezId: '4607'
        },
        {
          symbol: 'TNNT2',
          entrezId: '7139'
        },
        {
          symbol: 'ACTC',
          entrezId: '70'
        },
        {
          symbol: 'TPM1',
          entrezId: '7168'
        },
        {
          symbol: 'LAMP2',
          entrezId: '3920'
        },
        {
          symbol: 'TNNC1',
          entrezId: '7134'
        },
        {
          symbol: 'TNNI3',
          entrezId: '7137'
        },
        {
          symbol: 'DES',
          entrezId: '1674'
        },
        {
          symbol: 'MYL2',
          entrezId: '4633'
        },
        {
          symbol: 'TTR',
          entrezId: '7276'
        },
        {
          symbol: 'ALMS1',
          entrezId: '7840'
        },
        {
          symbol: 'TTN',
          entrezId: '7273'
        },
        {
          symbol: 'MYH2',
          entrezId: '4620'
        },
        {
          symbol: 'MYBP2',
          entrezId: '4606'
        },
        {
          symbol: 'MYH3',
          entrezId: '4621'
        }
      ]
      
      //creates a string of gene ids separated by commas for use in api request url
      const getGeneIdString = (geneObjArray) => {
        let geneIdString='';
        for(let i = 0; i<geneObjArray.length; i++){
          geneObjArray[i].entrezId;
          if( i== geneObjArray.length-1 ){//last gene
            geneIdString = geneIdString + geneObjArray[i].entrezId;
          }
          else{
            geneIdString = geneIdString + geneObjArray[i].entrezId + ',';
          }
        }
        return geneIdString;
      }
      
      const fetchGeneDetails = async (geneIDString) =>{
        const baseURL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
        const geneDataUrl = baseURL + 'efetch.fcgi?db=gene&id=' + geneIDString 
          + '&retmode=xml';
        //fetch genes from ncbi database using gene entrez id's from geneData array
        let genes = [];
        let xml = '';
        fetch(geneDataUrl, { mode: 'cors' })
          .then(response => response.text())
          .then(data=>{
            let parser = new DOMParser();
            xml = parser.parseFromString(data, 'application/xml');
            
            //get list of gene id elements from xml
            let ids = xml.getElementsByTagName('Gene-track_geneid');
            for(let i = 0; i<ids.length; i++){
              let id = ids[i].innerHTML;
              for(let j = 0; j<geneData.length; j++){
                if(geneData[j].entrezId == id){
                  //create gene object
                  let description = xml.getElementsByTagName('Entrezgene_summary')[i].innerHTML
                  let name = xml.getElementsByTagName('Prot-ref_name_E')[i].innerHTML; 
                  let symbol = xml.getElementsByTagName('Gene-ref_locus')[i].innerHTML;
                  let geneObj = {symbol : symbol, name : name, description: description};
                  console.log(geneObj);
                  genes.push(geneObj);
                  break;

                }
              }
            }

          })
          
        return genes;
      }

      fetchGeneDetails(getGeneIdString(geneData)).then(result => 
      {let genes = result; console.log(genes)});
      //console.log(genes);
      

      return {geneData};
    }

  }

</script>

<style>

</style>

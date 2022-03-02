//gene symbol with corresponding entrez id in ncbi database
//genes correspond with csv HCM data
//entrez id is needed to query the ncbi gene db api
//possibly store in seperate file
const geneData = [
  {
    symbol: 'MYH7',
    name: null,
    description: null,
    entrezId: '4625'
  },
  {
    symbol: 'MYBPC3',
    name: null,
    description: null,
    entrezId: '4607'
  },
  {
    symbol: 'TNNT2',
    name: null,
    description: null,
    entrezId: '7139'
  },
  {
    symbol: 'ACTC',
    name: null,
    description: null,
    entrezId: '70'
  },
  {
    symbol: 'TPM1',
    name: null,
    description: null,
    entrezId: '7168'
  },
  {
    symbol: 'LAMP2',
    name: null,
    description: null,
    entrezId: '3920'
  },
  {
    symbol: 'TNNCI',
    name: null,
    description: null,
    entrezId: '7134'
  },
  {
    symbol: 'TNNI3',
    name: null,
    description: null,
    entrezId: '7137'
  },
  {
    symbol: 'DES',
    name: null,
    description: null,
    entrezId: '1674'
  },
  {
    symbol: 'MYL2',
    name: null,
    description: null,
    entrezId: '4633'
  },
  {
    symbol: 'TTR',
    name: null,
    description: null,
    entrezId: '7276'
  },
  {
    symbol: 'ALMS1',
    name: null,
    description: null,
    entrezId: '7840'
  },
  {
    symbol: 'TTN',
    name: null,
    description: null,
    entrezId: '7273'
  },
  {
    symbol: 'MYH2',
    name: null,
    description: null,
    entrezId: '4620'
  },
  {
    symbol: 'MYBP2',
    name: null,
    description: null,
    entrezId: '4606'
  },
  {
    symbol: 'MYH3',
    name: null,
    description: null,
    entrezId: '4621'
  }
];

//returns a string of entrez gene ids separated by commas for use in api request url
const getGeneIdString = (geneObjArray) => {
  let geneIdString = '';

  geneObjArray.forEach(gene => geneIdString += `${gene.entrezId},`);

  // remove last character from string
  return geneIdString.slice(0, -1);
};

//returns array of gene objects with symbol, name, and description
const fetchGeneDetails = async () =>{
  const geneIDString = getGeneIdString(geneData);
  const baseURL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';

  //API request URL, efetch returns xml
  const geneDataUrl = baseURL + 'efetch.fcgi?db=gene&id=' + geneIDString
    + '&retmode=xml';

  //fetch gene data from ncbi database
  try {
    let response = await fetch(geneDataUrl);
    response = await response.text();

    //convert string response to xml doc obj
    const xml = new DOMParser().parseFromString(response, 'application/xml');
    //get gene elements in xml
    const geneElements = xml.getElementsByTagName('Entrezgene');
    //loop through each gene element
    geneElements.forEach(geneElement => {
      //get gene properties from xml
      const geneElemId = geneElement.getElementsByTagName('Gene-track_geneid')[0].innerHTML;

      //checks if id of geneElement in fetched xml matches that of a gene in geneData array
      const correspondingGene = geneData.find(gene => gene.entrezId === geneElemId);
      if(correspondingGene === undefined) return;

      let i = geneData.indexOf(correspondingGene);
      geneData[i].name = geneElement.getElementsByTagName('Gene-ref_desc')[0].innerHTML;
      geneData[i].description = geneElement.getElementsByTagName('Entrezgene_summary')[0].innerHTML;
    });

    return geneData;
  } catch (error) {
    console.error(error.message);
  }
};

export default fetchGeneDetails;

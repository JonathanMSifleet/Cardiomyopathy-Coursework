//gene symbol with corresponding entrez id in ncbi database
//genes correspond with csv HCM data
//entrez id is needed to query the ncbi gene db api
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
];

//returns a string of entrez gene ids separated by commas for use in api request url
const getGeneIdString = (geneObjArray) => {
  let geneIdString = '';

  geneObjArray.forEach(gene => {
    geneIdString += gene.entrezId + ',';
  });

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

  const genes = [];

  //fetch gene data from ncbi database
  try {
    let response = await fetch(geneDataUrl);
    response = await response.text();

    const parser = new DOMParser();
    //convert string response to xml doc obj
    const xml = parser.parseFromString(response, 'application/xml');
    //log xml doc obj to console
    console.log('Fetched Gene Data:', xml);
    //get gene elements in xml
    const geneElements = xml.getElementsByTagName('Entrezgene');
    //loop through each gene element
    geneElements.forEach(geneElement => {
      //get gene properties from xml
      const symbol = geneElement.getElementsByTagName('Gene-ref_locus')[0].innerHTML;
      const name = geneElement.getElementsByTagName('Gene-ref_desc')[0].innerHTML;
      const description = geneElement.getElementsByTagName('Entrezgene_summary')[0].innerHTML;
      //create gene object
      genes.push({ symbol, name, description });
    });
    return genes;
  } catch (error) {
    console.error(error.message);
  }
};

export default fetchGeneDetails;

export default (geneName) => {
  switch(true) {
    case geneName === 'ACTC':
      return 'ACTCmutation';
    case geneName === 'MYBPC3':
      return 'MYBPC3mutation';
    case geneName === 'TNNT2':
      return 'TNNT2mutation';
    default:
      return geneName;
  }
};

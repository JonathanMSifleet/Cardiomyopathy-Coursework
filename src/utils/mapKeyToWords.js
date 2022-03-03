const mapKeyToWords = (key) => {
  switch (key) {
    case 'ledv':
      return 'Left ventricular end diastolic volume';
    case 'redv':
      return 'Right ventricular end diastolic volume';
    case 'lesv':
      return 'Left ventricular end systolic volume';
    case 'resv':
      return 'Right ventricular end systolic volume';
    case 'lvef':
      return 'Left ventricular ejection fraction';
    case 'rvef':
      return 'Right ventricular ejection fraction';
    case 'lvmass':
      return 'Left ventricular mass';
    case 'lsv':
      return 'Left ventricular systolic volume';
    case 'rsv':
      return 'Right ventricular systolic volume';
    case 'scar':
      return 'Scarring';
    case 'AgeatMRI':
      return 'Age at MRI';
    case 'ApicalHCM':
      return 'Apical Hypertrophic Cardiomyopathy';
    case 'SuddenCardiacDeath':
      return 'Sudden Cardiac Death';
    default:
      return key;
  }
};

export default mapKeyToWords;

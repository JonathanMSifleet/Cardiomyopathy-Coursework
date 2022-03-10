import { GoogleCharts } from 'google-charts';
import mapKeyToWords from './mapKeyToWords';

export default (displayChart, divId, isLoadingGraph, keyName, mutationName, results, isComparing) => {
  isLoadingGraph = true;

  const { data, type } = prepareGraphData(results, keyName);

  GoogleCharts.load(() => {
    drawChart(data, divId, keyName, type, isComparing, mutationName);

    isLoadingGraph = false;
    displayChart = true;
  });
};

const prepareGraphData = (results, keyName) => {
  const { data, type } = extractDataFromResults(results, keyName);
  data.unshift(['Test', 'Value']);

  data.forEach((curData) => curData[0] = curData[0][0].toUpperCase()
    + curData[0].slice(1).toLowerCase());

  return { data, type };
};

const drawChart = (data, divId, keyName, type, isComparing, mutationName) => {
  const chartHelper = GoogleCharts.api.visualization;
  const chartData = chartHelper.arrayToDataTable(data);
  chartData.sort([{ column: 1, asc: true }]);

  const divToRenderChart = document.getElementById(divId);

  const chart = type === 'pie'
    ? new chartHelper.PieChart(divToRenderChart)
    : new chartHelper.ColumnChart(divToRenderChart);

  let chartOptions = {
    title: mapKeyToWords(keyName),
    is3D: true,
    vAxis: {
      title: 'Value'
    },
    hAxis: {
      title: 'Record from database'
    },
    chartArea: { width: '82%', height: '80%' }
  };

  if (isComparing) chartOptions.title = `${mutationName} - ${chartOptions.title}`;

  chart.draw(chartData, chartOptions);
};

const extractDataFromResults = (results, keyName) => {
  let data = {};
  let type;

  switch(typeof(results[0][keyName])) {
    case 'boolean':
      type = 'pie';
      break;
    case 'number':
      type = 'bar';
      break;
    case 'string':
      type = 'pie';
      break;
  }

  let counter = 0;
  results.forEach((doc) => {
    const keyValue = doc[keyName];

    switch (typeof keyValue) {
      case 'boolean':
        // add key to object if it doesn't exist
        if (!data[keyValue]) data[keyValue] = [];

        data[keyValue] = ++data[keyValue];
        break;
      case 'number':
        if (!data[counter]) data[counter] = [];

        data[counter] = keyValue;
        counter++;
        break;
      case 'string':
        if (!data[keyValue]) data[keyValue] = 0;

        data[keyValue] = ++data[keyValue];
        break;
    }
  });

  return { data: Object.entries(data), type };
};

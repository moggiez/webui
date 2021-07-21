import HttpClient from "./httpClient";

const metricsApiURL = `https://metrics-api.moggies.io`;
const http = new HttpClient();

const getMetricsData = async (loadtestId) => {
  return await http.get(`${metricsApiURL}/${loadtestId}`);
};

export default {
  getMetricsData: getMetricsData,
};

import config from "../config";
import HttpClient from "./httpClient";

const metricsApiURL = `${config.baseApiUrl}/metrics`;
const http = new HttpClient();

const getMetricsData = async (loadtestId) => {
  return await http.get(`${metricsApiURL}/${loadtestId}`);
};

export default {
  getMetricsData: getMetricsData,
};

import axios from "axios";

const loadtestApiUrl = "https://load-api.moggies.io/loadtest";
const triggerLoadTest = (workflow, onSuccess, onError) => {
  axios
    .post(loadtestApiUrl, workflow)
    .then((response) => onSuccess(response))
    .catch((error) => onError(error));
};
export default {
  triggerLoadTest: triggerLoadTest,
};

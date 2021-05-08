import axios from "axios";

const loadtestApiUrl = "https://load-api.moggies.io/loadtest";
const triggerLoadTest = (currentUser, workflow, onSuccess, onError) => {
  if (currentUser) {
    currentUser.getSession((err, result) => {
      if (err) {
        onError(err);
      } else {
        const config = {
          headers: {
            Authorization: result.getIdToken().getJwtToken(),
          },
        };
        axios
          .post(loadtestApiUrl, workflow, config)
          .then((response) => onSuccess(response))
          .catch((error) => onError(error));
      }
    });
  } else {
    onError("Cannot get current user.");
  }
};
export default {
  triggerLoadTest: triggerLoadTest,
};

import axios from "axios";
import config from "../config";
import loadtestSvc from "../services/loadtestService";
import playbookSvc from "../services/playbookService";

const loadApiURL = `${config.baseLoadApiUrl}/loadtest`;

const triggerLoadTest = (currentUser, playbook, onSuccess, onError) => {
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
          .post(loadApiURL, playbook.Playbook, config)
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

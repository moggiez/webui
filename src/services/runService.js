import axios from "axios";
import config from "../config";
import loadtestSvc from "./loadtestService";
import userSvc from "./userService";

const runUrl = `${config.baseLoadApiUrl}/run`;

const triggerLoadTest = (currentUser, playbook) => {
  return new Promise((resolve, reject) => {
    if (currentUser) {
      userSvc
        .getUserData()
        .then(({ userData, session }) => {
          const orgId = userData.OrganisationId;
          const config = {
            headers: {
              Authorization: session.getIdToken().getJwtToken(),
            },
          };
          loadtestSvc
            .create(orgId, playbook.PlaybookId)
            .then((response) => {
              const loadtestId = response.data.LoadtestId;
              const url = `${runUrl}/${response.data.LoadtestId}`;
              axios
                .post(url, {}, config)
                .then((response) => resolve({ loadtestId, response }))
                .catch((error) => reject(error));
            })
            .catch((err) => reject(err));
        })
        .catch((error) => reject(error));
    } else {
      reject("Cannot get current user.");
    }
  });
};
export default {
  triggerLoadTest: triggerLoadTest,
};

import axios from "axios";
import config from "../config";
import loadtestSvc from "./loadtestService";
import userSvc from "./userService";

const runUrl = `${config.baseLoadApiUrl}/run`;

const triggerLoadTest = (currentUser, playbook) => {
  return new Promise((resolve, reject) => {
    if (currentUser) {
      userSvc
        .getUserData(currentUser)
        .then(({ userData, session }) => {
          console.log("got user, will attempt to create loadtest");
          const orgId = userData.OrganisationId;
          const config = {
            headers: {
              Authorization: session.getIdToken().getJwtToken(),
            },
          };
          loadtestSvc
            .create(orgId, playbook.PlaybookId)
            .then((response) => {
              console.log("CREATE RESPONSE", response.data.LoadtestId);
              const url = `${runUrl}/${response.data.LoadtestId}`;
              axios
                .post(url, playbook.Playbook, config)
                .then((response) => resolve(response))
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

import config from "../config";
import userSvc from "../services/userService";
import axios from "axios";

const playbookApiUrl = `${config.baseApiUrl}/playbook`;

const getPlaybooks = (organisationId, currentUser) => {
  return new Promise((resolve, reject) => {
    if (currentUser) {
      currentUser.getSession((err, session) => {
        if (err) {
          reject(err);
        } else {
          const url = `${playbookApiUrl}/${organisationId}`;
          const config = {
            headers: {
              Authorization: session.getIdToken().getJwtToken(),
            },
          };
          axios
            .get(url, config)
            .then((response) => {
              resolve(response.data.data);
            })
            .catch((error) => reject(error));
        }
      });
    } else {
      reject();
    }
  });
};

const getPlaybook = (playbookId, currentUser) => {
  return new Promise((resolve, reject) => {
    userSvc
      .getUserData(currentUser)
      .then(({ userData, session }) => {
        const url = `${playbookApiUrl}/${userData.OrganisationId}/${playbookId}`;
        const config = {
          headers: {
            Authorization: session.getIdToken().getJwtToken(),
          },
        };
        axios
          .get(url, config)
          .then((response) => {
            const data = response.data;
            console.log("data", data);
            resolve(data);
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
};

export default {
  getPlaybooks: getPlaybooks,
  getPlaybook: getPlaybook,
};

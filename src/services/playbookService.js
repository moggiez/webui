import config from "../config";
import userSvc from "../services/userService";
import axios from "axios";
import HttpClient from "./httpClient";

const http = new HttpClient();

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
      .getUserData()
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
            resolve({ playbook: response.data, session });
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
};

const getAll = async (org) => {
  return await http.get(`${playbookApiUrl}/${org}`);
};

const getById = async (playbookId) => {
  const { userData, session } = await userSvc.getUserData();
  return await http.get(
    `${playbookApiUrl}/${userData.OrganisationId}/${playbookId}`
  );
};

export default {
  getPlaybooks: getPlaybooks,
  getPlaybook: getPlaybook,
  getAll: getAll,
  getById,
};

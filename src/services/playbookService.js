import userSvc from "../services/userService";
import axios from "axios";
import HttpClient from "./httpClient";

const http = new HttpClient();

const playbookApiUrl = `https://playbooks-api.moggies.io`;

const getPlaybooks = (organisationId, currentUser) => {
  return new Promise((resolve, reject) => {
    if (currentUser) {
      currentUser.getSession((err, session) => {
        if (err) {
          reject(err);
        } else {
          const url = `${playbookApiUrl}/${organisationId}/playbooks`;
          const config = {
            headers: {
              Authorization: session.getIdToken().getJwtToken(),
            },
          };
          axios
            .get(url, config)
            .then((response) => {
              resolve(response.data);
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
        const url = `${playbookApiUrl}/${userData.OrganisationId}/playbooks/${playbookId}`;
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
  return await http.get(`${playbookApiUrl}/${org}/playbooks`);
};

const getById = async (playbookId, playbookVersion) => {
  const { userData, session } = await userSvc.getUserData();
  let url = `${playbookApiUrl}/${userData.OrganisationId}/playbooks/${playbookId}`;
  if (playbookVersion) {
    url = `${url}/versions/v${playbookVersion}`;
  }
  return await http.get(url);
};

export default {
  getPlaybooks: getPlaybooks,
  getPlaybook: getPlaybook,
  getAll: getAll,
  getById,
};

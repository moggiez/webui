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

const getPlaybook = async (playbookId, currentUser) => {
  const { userData, session } = await userSvc.getUserData();
  const url = `${playbookApiUrl}/${userData.OrganisationId}/playbooks/${playbookId}`;
  const config = {
    headers: {
      Authorization: session.getIdToken().getJwtToken(),
    },
  };
  const response = await axios.get(url, config);
  return { playbook: response.data, session };
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

const create = async (data) => {
  const { userData, session } = await userSvc.getUserData();
  const url = `${playbookApiUrl}/${userData.OrganisationId}/playbooks`;
  return await http.post(url, data);
};

const update = async (playbookId, data) => {
  const { userData, session } = await userSvc.getUserData();
  const url = `${playbookApiUrl}/${userData.OrganisationId}/playbooks/${playbookId}`;
  return await http.put(url, data);
};

const remove = async (playbookId) => {
  const { userData, session } = await userSvc.getUserData();
  const url = `${playbookApiUrl}/${userData.OrganisationId}/playbooks/${playbookId}`;
  return await http.delete(url);
};

const EMPTY_PLAYBOOK = {
  PlaybookName: "New playbook",
  Latest: 0,
  Steps: [
    {
      requestOptions: {
        hostname: "",
        port: 80,
        path: "/",
        protocol: "http",
      },
      users: 100,
      wait: 0,
      repeats: 5,
      type: "http_get",
    },
  ],
};

export default {
  getPlaybooks: getPlaybooks,
  getPlaybook: getPlaybook,
  getAll: getAll,
  getById,
  create,
  update,
  delete: remove,
  getEmptyPlaybook: () => EMPTY_PLAYBOOK,
};

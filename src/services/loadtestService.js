import axios from "axios";
import HttpClient from "./httpClient";
import { UserPool } from "../services/cognitoAuth";
import userSvc from "../services/userService";

const http = new HttpClient();
const loadtestApiURL = `https://loadtests-api.moggies.io`;

const get = async (id) => {
  const { userData, session } = await userSvc.getUserData();
  const url = `${loadtestApiURL}/${userData.OrganisationId}/${id}`;
  const response = await http.get(url);
  if (response.status === 200) {
    return response.data;
  }

  return null;
};

const create = (organisationId, playbookId) => {
  const proceedAfterUserSessionObtained = (session, resolve, reject) => {
    const config = {
      headers: {
        Authorization: session.getIdToken().getJwtToken(),
      },
    };
    const payload = {
      PlaybookId: playbookId,
    };
    const url = `${loadtestApiURL}/${organisationId}`;
    axios
      .post(url, payload, config)
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  };

  return new Promise((resolve, reject) => {
    const currentUser = UserPool.getCurrentUser();
    const session = currentUser.getSignInUserSession();
    if (session == null) {
      currentUser.getSession((err, session) => {
        if (err) {
          reject(err);
        } else {
          proceedAfterUserSessionObtained(session, resolve, reject);
        }
      });
    } else {
      proceedAfterUserSessionObtained(session, resolve, reject);
    }
  });
};

const getAll = async (org) => {
  return await http.get(`${loadtestApiURL}/${org}`);
};

const remove = async (loadtestId) => {
  const { userData, session } = await userSvc.getUserData();
  return await http.delete(
    `${loadtestApiURL}/${userData.OrganisationId}/${loadtestId}`
  );
};

export default { get, create, getAll, remove };

import axios from "axios";
import config from "../config";
import HttpClient from "./httpClient";
import { UserPool } from "./cognitoAuth";
import userSvc from "./userService";

const http = new HttpClient();
http.setBaseUrl(config.baseDomainsApiUrl);

const getAll = async (org) => {
  const { userData, _ } = await userSvc.getUserData();
  const response = await http.get(`${userData.OrganisationId}/domains`);

  if (response.status == 200) {
    return response.data.data;
  } else {
    return null;
  }
};

const create = async (domainName) => {
  const { userData, _ } = await userSvc.getUserData();
  const response = await http.post(
    `${userData.OrganisationId}/domains/${domainName}`
  );

  return response.status == 200 || response.status == 201
    ? { success: true }
    : { success: false, error: response.text };
};

const remove = async (domain) => {
  const { userData, _ } = await userSvc.getUserData();
  return await http.delete(
    `${domain.OrganisationId}/domains/${domain.DomainName}`
  );
};

export default { create, getAll, remove };

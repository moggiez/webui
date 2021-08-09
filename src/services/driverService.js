import axios from "axios";
import config from "../config";
import loadtestSvc from "./loadtestService";
import userSvc from "./userService";

const triggerLoadTest = async (currentUser, playbook) => {
  if (currentUser) {
    try {
      const { userData, session } = await userSvc.getUserData();
      const orgId = userData.OrganisationId;

      const httpConfig = {
        headers: {
          Authorization: session.getIdToken().getJwtToken(),
        },
      };
      const loadtestResponse = await loadtestSvc.create(
        orgId,
        playbook.PlaybookId
      );

      const loadtestId = loadtestResponse.data.LoadtestId;
      const runUrl = `${config.baseDriverApiUrl}/${orgId}/run/${loadtestId}`;
      const runResponse = await axios.post(runUrl, {}, httpConfig);
      return { loadtestId, runResponse };
    } catch (err) {
      throw err;
    }
  } else {
    throw new Error("Cannot get current user.");
  }
};
export default {
  triggerLoadTest: triggerLoadTest,
};

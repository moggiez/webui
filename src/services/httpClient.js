import axios from "axios";
import { getUserAttributes } from "./cognitoAuth";

class HttpClient {
  constructor() {
    this.instance = null;
  }

  async initialize() {
    try {
      const resp = await getUserAttributes();
      this.instance = axios.create({
        headers: {
          Authorization: resp.session.getIdToken().getJwtToken(),
        },
      });
      Promise.resolve();
    } catch (e) {
      console.log(e);
      Promise.reject(e);
    }
  }

  async get(url) {
    if (this.instance == null) {
      await this.initialize();
    }
    return this.instance.get(url);
  }
}

export default HttpClient;

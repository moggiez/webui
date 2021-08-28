import axios from "axios";
import { getUserAttributes } from "./cognitoAuth";

class HttpClient {
  constructor() {
    this.instance = null;
  }

  setBaseUrl(baseUrl) {
    this.baseUrl = baseUrl;
  }

  _getFullUrl(url) {
    if (this.baseUrl) {
      return `${this.baseUrl}/${url}`;
    } else {
      return url;
    }
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
    return this.instance.get(this._getFullUrl(url));
  }

  async delete(url) {
    if (this.instance == null) {
      await this.initialize();
    }
    return this.instance.delete(this._getFullUrl(url));
  }

  async post(url, data) {
    console.log(data);
    if (this.instance == null) {
      await this.initialize();
    }
    return this.instance.post(this._getFullUrl(url), data);
  }

  async put(url, data) {
    if (this.instance == null) {
      await this.initialize();
    }
    return this.instance.put(this._getFullUrl(url), data);
  }
}

export default HttpClient;

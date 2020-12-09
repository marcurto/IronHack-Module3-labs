import axios from "axios";

class Auth {
  constructor() {
    this.auth = axios.create({
      baseURL: 'http://localhost:4000',
      withCredentials: true,
    });
  }

  signup({ email, password }) {
    return this.auth
      .post("/auth/signup", { email, password })
      .then(({ data }) => data);
  }

  login({ email, password }) {
    return this.auth
      .post("/auth/login", { email, password })
      .then(({ data }) => data);
  }

  logout() {
    return this.auth.get("/auth/logout", {}).then(({ data }) => data);
  }

  me() {
    return this.auth.get("/auth/me").then(({ data }) => data);
  }
}

const axiosRequestFunctions = new Auth();

export default axiosRequestFunctions;

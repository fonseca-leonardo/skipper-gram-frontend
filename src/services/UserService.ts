import api from "./api";

const routes = {
  login: "/users/signin",
  authenticate: "/users/authenticate",
  signup: "/users/signup",
  change: "/users/recoverPassword",
  recoverPassword: "/users/recoverPassword",
};

class UserService {
  public async login(email: string, password: string) {
    const result = await api.post(routes.login, { email, password });

    return result.data as { token: string };
  }

  public async authenticate() {
    const result = await api.get(routes.authenticate);

    return result.data as {
      data: { _id: string; name: string; email: string };
    };
  }

  public async signUp(email: string, password: string, name: string) {
    const result = await api.post(routes.signup, { email, password, name });

    return result.data;
  }

  public async recoverPassword(newPassword: string, token: string) {
    await api.patch(routes.recoverPassword, { newPassword, token });
  }

  public async initRecoverPassword(email: string) {
    await api.post(routes.recoverPassword, { email });
  }
}

export default new UserService();

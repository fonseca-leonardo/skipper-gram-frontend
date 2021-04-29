import React, { useCallback, useState } from "react";

import { useAuth } from '../../../../hooks/auth';
import UserService from '../../../../services/UserService';

import LoginLayout from "./layout";

export type LoginForm = {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const { signIn } = useAuth();


  const _onLogin = useCallback(async ({ email, password }: LoginForm) => {
    try {
      setLoading(true);

      const { token } = await UserService.login(email, password);
  
      signIn({ token });
      
      const { data } = await UserService.authenticate();
  
      signIn({ token, user: data });
  
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [signIn]);

  return (
    <LoginLayout isLoading={isLoading} onLogin={_onLogin} />
  )
}

export default Login;
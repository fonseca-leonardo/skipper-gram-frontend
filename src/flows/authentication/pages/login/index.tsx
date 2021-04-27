import React, { Component } from "react";
import LoginLayout from "./layout";

type LoginProps = {

}

type LoginState = {
  requestLogin: {
    isLoading: boolean;
  }
}

export default class Login extends Component<LoginProps, LoginState> {
  constructor (props: LoginProps) {
    super(props);

    this.state = {
      requestLogin: {
        isLoading: false
      }
    }
  }
  render() {
    return (
      <LoginLayout />
    );
  }
}

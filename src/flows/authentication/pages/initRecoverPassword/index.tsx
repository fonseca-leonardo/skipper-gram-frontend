import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {RouteComponentProps} from "react-router";
import UserService from '../../../../services/UserService';
import InitRecoverPasswordLayout from './layout'

type IState = {
    requestChangePassword: {
        isLoading: boolean;
    }
}

type PropsType = RouteComponentProps<{}>;

 class InitRecoverPasswordPage extends Component<PropsType, IState> {
    constructor(props: RouteComponentProps<{}>) {
        super(props);

        this.state = {
            requestChangePassword: {
                isLoading: false
            }
        }
    }

    _onRecoverPassword = async (email: string) => {
        try {
            this.setState(prev => ({ ...prev, requestChangePassword: { ...prev.requestChangePassword, isLoading: true } }));

            await UserService.initRecoverPassword(email);
            
            this.setState(prev => ({ ...prev, requestChangePassword: { ...prev.requestChangePassword, isLoading: false } }));

            this.props.history.push('/');
            
        } catch (error) {
            this.setState(prev => ({ ...prev, requestChangePassword: { ...prev.requestChangePassword, isLoading: false } }));
        }
    }

    render() {
        const { requestChangePassword } = this.state;

        return (
            <InitRecoverPasswordLayout isLoading={requestChangePassword.isLoading} onRecoverPassword={this._onRecoverPassword} />
        )
    }
}

export default withRouter(InitRecoverPasswordPage)

import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';
import {RouteComponentProps} from "react-router";


import RecoverPasswordLayout from './layout'
import UserService from '../../../../services/UserService';

type PathParamsType = {
    token: string,
}

type IState = {
    requestChangePassword: {
        isLoading: boolean;
    }
}

type PropsType = RouteComponentProps<PathParamsType>;

 class RecoverPasswordPage extends Component<PropsType, IState> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            requestChangePassword: {
                isLoading: false
            }
        }
    }

    _onRecoverPassword = async (newPassword: string) => {
        const { token } = this.props.match.params;

        console.log({ token })

        try {
            this.setState(prev => ({ ...prev, requestChangePassword: { ...prev.requestChangePassword, isLoading: true } }));

            await UserService.recoverPassword(newPassword, token);
            
            this.setState(prev => ({ ...prev, requestChangePassword: { ...prev.requestChangePassword, isLoading: false } }));

            this.props.history.push('/');
        } catch (error) {
            this.setState(prev => ({ ...prev, requestChangePassword: { ...prev.requestChangePassword, isLoading: false } }));
        }
    }

    render() {
        const { requestChangePassword } = this.state;
        return (
            <RecoverPasswordLayout isLoading={requestChangePassword.isLoading} onRecoverPassword={this._onRecoverPassword} />
        )
    }
}

export default withRouter(RecoverPasswordPage);

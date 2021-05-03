import React from 'react';
import { Switch } from 'react-router-dom';

import { LoginPage, SignUpPage, RecoverPasswordPage, InitRecoverPasswordPage } from '../flows/authentication';

import { PrivateRoutes } from '../constants/Routes';

import Route from './Route';

const Routes: React.FC = () => {

    return (
        <Switch>
            <Route path='/' component={LoginPage} exact />
            <Route path='/cadastrar' component={SignUpPage} />
            <Route path='/recuperar/:token' component={RecoverPasswordPage} />
            <Route path='/recuperar' component={InitRecoverPasswordPage} exact/>
            {
                PrivateRoutes.map(route => (
                    <Route key={route.path} path={route.path} component={route.page} exact={route.exact} isPrivate/>
                ))
            }
        </Switch>
    );
}

export default Routes;

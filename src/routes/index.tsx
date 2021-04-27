import React from 'react';
import { Switch } from 'react-router-dom';

import { LoginPage, SignUpPage } from '../flows/authentication';

import { PrivateRoutes } from '../constants/Routes';

import Route from './Route';

const Routes: React.FC = () => {

    return (
        <Switch>
            <Route path='/' component={LoginPage} exact />
            <Route path='/cadastrar' component={SignUpPage} />
            {
                PrivateRoutes.map(route => (
                    <Route key={route.path} path={route.path} component={route.page} exact={route.exact}/>
                ))
            }
        </Switch>
    );
}

export default Routes;

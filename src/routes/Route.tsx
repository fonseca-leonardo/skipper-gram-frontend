/* eslint-disable no-nested-ternary */
import React from 'react';
import {
  Route as ReactDOMRoutes,
  RouteProps as ReactDOMRouteProps,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';

interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { token } = useAuth();

  return (
    <ReactDOMRoutes
      {...rest}
      render={() => {
        return isPrivate === !!token ? (
          token ? (
              <Component />
          ) : (
            <Component />
          )
        ) : (
          <Redirect to={{ pathname: isPrivate ? '/' : '/post' }} />
        );
      }}
    />
  );
};

export default Route;

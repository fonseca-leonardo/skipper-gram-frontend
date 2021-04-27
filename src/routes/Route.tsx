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
  const { user } = useAuth();

  return (
    <ReactDOMRoutes
      {...rest}
      render={() => {
        return isPrivate === !!user ? (
          user ? (
              <Component />
          ) : (
            <Component />
          )
        ) : (
          <Redirect to={{ pathname: isPrivate ? '/' : '/posts' }} />
        );
      }}
    />
  );
};

export default Route;

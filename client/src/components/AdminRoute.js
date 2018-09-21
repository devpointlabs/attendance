import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const AdminRoute = ({ isAuthenticated, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      isAuthenticated
        ? (<Component {...props} />)
        : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />)
    )}
  />
);

const mapStateToProps = state => {
  const { user } = state
  const isAuthenticated = user.id && user.is_admin
  return { isAuthenticated };
};

export default connect(mapStateToProps)(AdminRoute);

import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Loader } from 'semantic-ui-react'
import Loadable from 'react-loadable';
import NavBar from './NavBar';
import ProtectedRoute from './ProtectedRoute';
import FetchUser from './FetchUser';
import AuthRoute from './AuthRoute';
import AdminRoute from './AdminRoute';
import Flash from './Flash';

const Loading = () => <Loader active />

const  NoMatch = Loadable({
  loader: () => import('./NoMatch'),
  loading: Loading,
});

const  Login = Loadable({
  loader: () => import('./Login'),
  loading: Loading,
});

const  Register = Loadable({
  loader: () => import('./Register'),
  loading: Loading,
});

const  Home = Loadable({
  loader: () => import('./Home'),
  loading: Loading,
});

const  Settings = Loadable({
  loader: () => import('./Settings'),
  loading: Loading,
});

const  ResetPW = Loadable({
  loader: () => import('./ResetPW'),
  loading: Loading,
});

const  Course = Loadable({
  loader: () => import('./Course'),
  loading: Loading,
});

const  ArchivedCourses = Loadable({
  loader: () => import('./ArchivedCourses'),
  loading: Loading,
});

const  Students = Loadable({
  loader: () => import('./Students'),
  loading: Loading,
});

const  Reports = Loadable({
  loader: () => import('./Reports'),
  loading: Loading,
});

const  Report = Loadable({
  loader: () => import('./Report'),
  loading: Loading,
});

class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <Flash />
        <FetchUser>
          <Switch>
            <ProtectedRoute exact path='/' component={Home} />
            <ProtectedRoute exact path='/courses' component={Home} />
            <ProtectedRoute exact path='/courses/:id' component={Course} />
            <AdminRoute exact path='/settings' component={Settings} />
            <AdminRoute exact path='/archived' component={ArchivedCourses} />
            <AdminRoute exact path='/students' component={Students} />
            <AdminRoute exact path='/reports' component={Reports} />
            <AdminRoute exact path='/reports/:id' component={Report} />
            <AuthRoute exact path='/login' component={Login} />
            <AuthRoute exact path='/register' component={Register} />
            <AuthRoute exact path='/reset_password' component={ResetPW} />
            <Route component={NoMatch} />
          </Switch>
        </FetchUser>
      </div>
    );
  }
}

export default App;

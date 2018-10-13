import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Loader } from 'semantic-ui-react'
import Loadable from 'react-loadable';

const Loading = () => <Loader active />

const  NoMatch = Loadable({
  loader: () => import('./NoMatch'),
  loading: Loading,
});

const  NavBar = Loadable({
  loader: () => import('./NavBar'),
  loading: Loading,
  delay: 300,
});

const  Flash = Loadable({
  loader: () => import('./Flash'),
  loading: Loading,
  delay: 300,
});

const  ProtectedRoute = Loadable({
  loader: () => import('./ProtectedRoute'),
  loading: Loading,
  delay: 300,
});

const  FetchUser = Loadable({
  loader: () => import('./FetchUser'),
  loading: Loading,
  delay: 300,
});

const  AdminRoute = Loadable({
  loader: () => import('./AdminRoute'),
  loading: Loading,
  delay: 300,
});

const  AuthRoute = Loadable({
  loader: () => import('./AuthRoute'),
  loading: Loading,
  delay: 300,
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

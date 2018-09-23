import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import NoMatch from './NoMatch';
import NavBar from './NavBar';
import Login from './Login';
import Register from './Register';
import Flash from './Flash';
import Home from './Home';
import ProtectedRoute from './ProtectedRoute';
import AuthRoute from './AuthRoute';
import AdminRoute from './AdminRoute';
import FetchUser from './FetchUser';
import Settings  from './Settings';
import ResetPW from './ResetPW';
import Course from './Course';
import ArchivedCourses from './ArchivedCourses';
import Students from './Students';
import Reports from './Reports';

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
            <AuthRoute exact path='/login' component={Login} />
            <AuthRoute exact path='/register' component={Register} />
            <AuthRoute exact path='/api/auth/password/edit' component={ResetPW} />
            <Route component={NoMatch} />
          </Switch>
        </FetchUser>
      </div>
    );
  }
}

export default App;

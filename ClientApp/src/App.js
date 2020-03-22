import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { DailyTasks } from './components/DailyTasks';
import { AdminPanel } from './components/AdminPanel';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import RoleAuthorizeRoute from './components/api-authorization/RoleAuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <AuthorizeRoute path='/dailytasks' component={DailyTasks} />
            <RoleAuthorizeRoute path='/admin' component={AdminPanel} />
        <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
      </Layout>
    );
  }
}

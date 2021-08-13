import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { isAuthenticated } from "./services/auth";

import Login from "./pages/login";
import ForgetPassword from "./pages/forget-password";
import PasswordRecovery from "./pages/password-recovery";
import ResetPassword from "./pages/reset-password";
import Register from "./pages/register";
import EvaluationRegister from "./pages/evaluation-register";
import Main from "./pages/main";
import Project from "./pages/project";
import ProjectEdit from "./pages/project-edit";
import CreateProject from "./pages/create-project";
import ClearCache from "./pages/clear-cache";
import Contacts from "./pages/contacts";
import EditProject from "./pages/edit-project";
import LandingPage from "./pages/landing-page";
import LandingPagePreview from "./pages/landing-page-preview";
import ListUsers from "./pages/list-users";
import ListContacts from "./pages/list-contacts";
import User from "./pages/user";
import ListPublishers from "./pages/list-publishers";
import Publisher from "./pages/publisher";
import ShippingManagement from "./pages/shipping-management";
import ConfidentialityNotAccepted from "./pages/confidentiality-not-accepted";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => <Component {...props} />} />
);

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <PrivateRoute exact path="/index.html" component={Main} />
      <Route exact path="/" component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/forget-password" component={ForgetPassword} />
      <Route path="/reset-password/:token_id" component={ResetPassword} />
      <Route path="/register" component={Register} />
      <Route path="/evaluation-register" component={EvaluationRegister} />
      <Route
        path="/landing-page/:project_id/:token_id"
        component={LandingPage}
      />
      <Route path="/clear-cache/" component={ClearCache} />
      <PrivateRoute exact path="/projects" component={Main} />
      <PrivateRoute
        path="/project/:company_id/:project_id"
        component={Project}
      />
      <PrivateRoute
        path="/project-edit/:company_id/:project_id"
        component={ProjectEdit}
      />
      <PrivateRoute
        path="/create-project/:company_id/:project_id"
        component={CreateProject}
      />
      <PrivateRoute path="/contacts/:page" component={Contacts} />
      <PrivateRoute
        path="/edit-project/:company_id/:project_id"
        component={EditProject}
      />
      <PrivateRoute path="/list-users/:page" component={ListUsers} />
      <PrivateRoute path="/list-contacts/:page" component={ListContacts} />
      <PrivateRoute path="/user/:id" component={User} />
      <PrivateRoute path="/list-publishers/:page" component={ListPublishers} />
      <PrivateRoute path="/publisher/:id" component={Publisher} />
      <PrivateRoute
        path="/landing-page-preview/:company_id/:project_id"
        component={LandingPagePreview}
      />
      <PrivateRoute
        path="/shipping-management/:company_id/:project_id"
        component={ShippingManagement}
      />
      <Route
        path="/without-permission"
        component={ConfidentialityNotAccepted}
      />
      <Route path="*" component={() => <h1>Page not founds</h1>} />
    </Switch>
  </BrowserRouter>
);

export default Routes;

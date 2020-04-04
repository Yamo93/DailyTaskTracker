import React from 'react'
import { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { ApplicationPaths, QueryParameterNames } from './ApiAuthorizationConstants'
import authService from './AuthorizeService'

export default class RoleAuthorizeRoute extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ready: false,
            authenticated: false
        };
    }

    componentDidMount() {
        this._subscription = authService.subscribe(() => this.authenticationChanged());
        this.populateAuthenticationState();
        this.populateAdminAuthorizationState();
    }

    componentWillUnmount() {
        authService.unsubscribe(this._subscription);
    }

    render() {
        const { ready, isAuthenticated, isAuthorized } = this.state;
        const redirectUrl = `${ApplicationPaths.Login}?${QueryParameterNames.ReturnUrl}=${encodeURI(window.location.href)}`
        if (!ready) {
            return <div></div>;
        } else {
            const { component: Component, ...rest } = this.props;
            return <Route {...rest}
                render={(props) => {
                    if (isAuthenticated && isAuthorized) {
                        return <Component {...props} />
                    } else {
                        return <Redirect to={redirectUrl} />
                    }
                }} />
        }
    }

    async populateAuthenticationState() {
        const authenticated = await authService.isAuthenticated();
        this.setState({ ready: true, authenticated });
    }

    async populateAdminAuthorizationState() {
        const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()]);
        this.setState({
            isAuthenticated,
            isAuthorized: user && !!user.role,
            role: user && user.role
        });
    }

    async authenticationChanged() {
        this.setState({ ready: false, authenticated: false });
        await this.populateAuthenticationState();
    }
}

import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { LoginMenu } from './api-authorization/LoginMenu';
import authService from '../components/api-authorization/AuthorizeService';
import './NavMenu.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
        collapsed: true,
        isAuthenticated: false,
        role: null
    };
    }

    componentDidMount() {
        this._subscription = authService.subscribe(() => this.populateState());
        this.populateState();
    }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
    }

    async populateState() {
        const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()])
        this.setState({
            isAuthenticated,
            userName: user && user.name,
            role: user && user.role
        });
    }

    render() {
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" dark color="primary">
          <Container>
            <NavbarBrand tag={Link} to="/">Daily Task Tracker</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} className="text-white" to="/">Home</NavLink>
                </NavItem>
                {this.state.role && this.state.role.includes("Admin") ? <NavItem>
                    <NavLink tag={Link} className="text-white" to="/admin">Admin</NavLink>
                </NavItem> : null}
                {this.state.isAuthenticated ? <NavItem>
                    <NavLink tag={Link} className="text-white" to="/dailytasks">Daily Tasks</NavLink>
                </NavItem> : null}
                <LoginMenu>
                </LoginMenu>
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}

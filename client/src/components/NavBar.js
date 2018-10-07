import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { handleLogout } from '../reducers/user';
import styled from 'styled-components'

const Nav = styled(Menu)`
  background-color: ${ props => props.theme.primary } !important;
`

const Item = styled(Menu.Item)`
  color: #FFF !important;
`

class NavBar extends Component {
  rightNavs = () => {
    const { user, dispatch, history } = this.props;

    if (user.id) {
      const auth = ['settings', 'students', 'reports']
      const authLinks = auth.map( a => 
        <Link to={`/${a}`} key={a}>
            <Item name={a} />
        </Link>
      )

      const links = [
          <Item
            key="logout"
            name="Logout"
            onClick={() => dispatch(handleLogout(history))}
          />
      ]

      const combined = user.is_admin ? [...authLinks, ...links] : links
      return (
        <Menu.Menu position="right">
          { combined }
        </Menu.Menu>
      )
    }
    return (
      <Menu.Menu position='right'>
        <Link to='/register'>
          <Item name='Register' />
        </Link>
        <Link to='/login'>
          <Item name='Login' />
        </Link>
      </Menu.Menu>
    );
  }

  render() {
    return (
      <div>
        <Nav pointing secondary>
          <Link to='/'>
            <Item name='home' />
          </Link>
          { this.rightNavs() }
        </Nav>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { user: state.user };
};

export default withRouter(connect(mapStateToProps)(NavBar));

import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { handleLogout } from '../reducers/user';

class NavBar extends Component {
  rightNavs = () => {
    const { user, dispatch, history } = this.props;

    if (user.id) {
      const auth = ['settings']
      const authLinks = auth.map( a => 
        <Link to={`/${a}`} key={a}>
            <Menu.Item name={a} />
        </Link>
      )

      const links = [
          <Menu.Item
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
          <Menu.Item name='Register' />
        </Link>
        <Link to='/login'>
          <Menu.Item name='Login' />
        </Link>
      </Menu.Menu>
    );
  }

  render() {
    return (
      <div>
        <Menu pointing secondary>
          <Link to='/'>
            <Menu.Item name='home' />
          </Link>
          { this.rightNavs() }
        </Menu>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { user: state.user };
};

export default withRouter(connect(mapStateToProps)(NavBar));

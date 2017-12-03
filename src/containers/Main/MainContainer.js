import React, { Component } from 'react';
import { bool, func, object, oneOfType, string } from 'prop-types';
import { bindActionCreators } from 'redux';
import { Navigation } from 'components';
import { connect } from 'react-redux';
import * as usersLikesActionCreators from 'ducks/usersLikes';
import * as userActionCreators from 'ducks/users';
import { formatUserInfo } from 'helpers/utils';
import { firebaseAuth } from 'config/constants';
import { container, innerContainer } from './styles.css';

class MainContainer extends Component {
  static propTypes = {
    authUser: func.isRequired,
    fetchingUserSuccess: func.isRequired,
    isAuthed: bool.isRequired,
    isFetching: bool.isRequired,
    location: oneOfType([
      object.isRequired,
      string.isRequired
    ]).isRequired,
    removeFetchingUser: func.isRequired,
    setUsersLikes: func.isRequired
  };

  static contextTypes: {
    router: object.isRequired
  };

  componentDidMount() {
    firebaseAuth().onAuthStateChanged(user => {
      if (user) {
        const userData = user.providerData[0];
        const userInfo = formatUserInfo(userData.displayName, userData.photoURL, user.uid);
        this.props.authUser(user.uid);
        this.props.fetchingUserSuccess(user.uid, userInfo, Date.now());
        this.props.setUsersLikes();
        if (this.props.location.pathname === '/') {
          this.context.router.replace('feed');
        }
      } else {
        this.props.removeFetchingUser();
      }
    });
  }

  render() {
    return this.props.isFetching === true
      ? null
      : <div className={container}>
        <Navigation isAuthed={this.props.isAuthed} />
        <div className={innerContainer}>
          {this.props.children}
        </div>
      </div>;
  }
}

function mapStateToProps(state) {
  const { isAuthed, isFetching } = state.users;
  return {
    isAuthed,
    isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...usersLikesActionCreators,
    ...userActionCreators
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);

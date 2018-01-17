import React, { Component } from 'react';
import { bool, func, object, oneOfType, string } from 'prop-types';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Navigation } from 'components';
import styled from 'styled-components';
import { connect } from 'react-redux';
import * as usersLikesActionCreators from 'ducks/usersLikes';
import * as userActionCreators from 'ducks/users';
import { formatUserInfo } from 'helpers/utils';
import { firebaseAuth } from 'config/constants';

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

  componentDidMount() {
    firebaseAuth().onAuthStateChanged(user => {
      if (user) {
        const userData = user.providerData[0];
        const userInfo = formatUserInfo(userData.displayName, userData.photoURL, user.uid);
        this.props.authUser(user.uid);
        this.props.fetchingUserSuccess(user.uid, userInfo, Date.now());
        this.props.setUsersLikes();
        if (this.props.location.pathname === '/') {
          this.props.history.replace('feed');
        }
      } else {
        this.props.removeFetchingUser();
      }
    });
  }

  render() {
    return this.props.isFetching === true
      ? null
      : <OuterWrapper>
        <Navigation isAuthed={this.props.isAuthed} />
        <InnerWrapper>
          {this.props.children}
        </InnerWrapper>
      </OuterWrapper>;
  }
}

const OuterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const InnerWrapper = styled.div`
  max-width: 900px;
  margin: 0px auto;
`;

function mapStateToProps({ users }) {
  const { isAuthed, isFetching } = users;
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainContainer));

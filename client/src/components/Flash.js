import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Message, Header } from 'semantic-ui-react';
import { clearFlash } from '../reducers/flash';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled(Message)`
  margin: 0 2px !important;
`

class Flash extends Component { 
  componentDidUpdate(prevProps) {
    const { location: prevLocation, flash: prevFlash } = prevProps;
    const { location, flash, dispatch } = this.props;
    
    const prevMessage = prevFlash.message;
    const prevUrl = prevLocation.pathname;
    const currentMessage = flash.message;
    const currentUrl = location.pathname;

    if(prevMessage && prevMessage === currentMessage) {
      if(prevUrl !== currentUrl) {
        clearTimeout(this.flashTimeout);
        dispatch(clearFlash());
      }
    }
  }

  fadeFlash = dispatch => {
    setTimeout(() => {
      dispatch(clearFlash());
    }, this.props.duration || 10000);
  }

  render() {
    const { dispatch, flash: { message, color } } = this.props;

    if (message) {
      return (
        <Container
          onDismiss={() => dispatch(clearFlash())}
          color={color}
        >
          <Header as='h5' textAlign='center'>{message}</Header>
          {this.fadeFlash(dispatch)}
        </Container>
      );
    }
    return null;
  }
}

const mapStateToProps = state => {
  const { flash } = state;
  return { flash };
};

export default withRouter(connect(mapStateToProps)(Flash));

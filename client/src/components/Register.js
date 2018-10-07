import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';
import { setFlash } from '../reducers/flash';
import { Text, AuthContainer, Field, AuthWrapper, CommonButton } from './CommonStyles'

class Register extends Component {
  state = { email: '' };

  handleChange = event => {
    const { id, value } = event.target;
    this.setState({ [id]: value });
  }

  handleSubmit = event => {
    event.preventDefault();
    const { dispatch } = this.props;
    const { email } = this.state;
    axios.post(`/api/register`, { email })
      .then( res => { 
        dispatch(setFlash('Please check your email for password instructions', 'green'))
      })
      .catch( err => dispatch(setFlash(err.response.data, 'red')) )
  }

  render() {
    const { email } = this.state;
    return (
      <AuthContainer basic>
        <AuthWrapper basic>
          <Text as='h1' textAlign='center'>Register</Text>
          <Form onSubmit={this.handleSubmit}>
            <Field>
              <label htmlFor='email'>Canvas Email</label>
              <input
                required
                id='email'
                value={email}
                placeholder='Email'
                onChange={this.handleChange}
              />
            </Field>
            <CommonButton fluid type='submit'>Submit</CommonButton>
          </Form>
        </AuthWrapper>
      </AuthContainer>
    );
  }
}

export default connect()(Register);

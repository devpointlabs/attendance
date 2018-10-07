import React, { Component } from 'react';
import { Header, Segment, Form, Button, Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { handleLogin } from '../reducers/user';
import styled from 'styled-components'
import { AuthContainer, Field } from './CommonStyles';

class Login extends Component {
  state = { email: '', password: '' };

  handleChange = event => {
    const { id, value } = event.target;
    this.setState({ [id]: value });
  }

  handleSubmit = event => {
    event.preventDefault();
    const { dispatch, history } = this.props;
    const { email, password } = this.state;
    dispatch(handleLogin({ email, password }, history));
  }

  render() {
    const { email, password } = this.state;
    return (
      <AuthContainer basic>
        <Segment basic>
          <Header as='h1' textAlign='center'>Login</Header>
          <Form onSubmit={this.handleSubmit}>
            <Field>
              <label htmlFor='email'>Email</label>
              <input
                required
                id='email'
                value={email}
                placeholder='Email'
                onChange={this.handleChange}
              />
            </Field>
            <Field>
              <label htmlFor='password'>Password</label>
              <input
                required
                id='password'
                value={password}
                placeholder='Password'
                type='password'
                onChange={this.handleChange}
              />
            </Field>
            <Button fluid primary type='submit'>Submit</Button>
          </Form>
        </Segment>
      </AuthContainer>
    );
  }
}

export default connect()(Login);

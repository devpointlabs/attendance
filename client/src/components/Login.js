import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { handleLogin } from '../reducers/user';
import { 
  Text, 
  AuthContainer, 
  AuthWrapper, 
  Field, 
  CommonButton,
  WhiteLabel,
  FlexForm,
} from './CommonStyles';

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
        <AuthWrapper basic>
          <Text as='h1' textAlign='center'>Login</Text>
          <FlexForm onSubmit={this.handleSubmit}>
            <Field>
              <WhiteLabel htmlFor='email'>Email</WhiteLabel>
              <input
                required
                id='email'
                value={email}
                placeholder='Email'
                onChange={this.handleChange}
              />
            </Field>
            <Field>
              <WhiteLabel htmlFor='password'>Password</WhiteLabel>
              <input
                required
                id='password'
                value={password}
                placeholder='Password'
                type='password'
                onChange={this.handleChange}
              />
            </Field>
            <CommonButton fluid type='submit'>Submit</CommonButton>
          </FlexForm>
        </AuthWrapper>
      </AuthContainer>
    );
  }
}

export default connect()(Login);

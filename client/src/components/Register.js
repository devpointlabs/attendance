import React, { Component } from 'react';
import { Header, Segment, Form, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';
import { setFlash } from '../reducers/flash';

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
      <Segment basic>
        <Header as='h1' textAlign='center'>Register</Header>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label htmlFor='email'>Canvas Email</label>
            <input
              required
              id='email'
              value={email}
              placeholder='Email'
              onChange={this.handleChange}
            />
          </Form.Field>
          <Segment textAlign='center' basic>
            <Button primary type='submit'>Submit</Button>
          </Segment>
        </Form>
      </Segment>
    );
  }
}

export default connect()(Register);

import React from 'react'
import axios from 'axios'
import { Segment, Loader, Dimmer, Form } from 'semantic-ui-react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { setFlash } from '../reducers/flash'
import { Link } from 'react-router-dom'
import { 
  AuthContainer,
  AuthWrapper,
  CommonButton,
  FlexForm, 
  Field,
  WhiteLabel,
  Text,
} from './CommonStyles'

const Error = styled.h4`
  text-align: center;
  color: red;
  font-weight: bold;
  background-color: white !important;
`

class ResetPW extends React.Component {
  state = { loading: true, valid: false, password: '', passwordConfirmation: '', token: '', error: '', isReset: false }

  componentDidMount() {
    const { location: { search } } = this.props
    const token = search.split('reset_password_token=')[1]
    let valid = false
    this.setState({ loading: false, valid, token })
  }

  handleChange = ({ target }) => {
    const { name, value } = target
    this.setState({ [name]: value }, () => {
      const { password, passwordConfirmation } = this.state
      if (password && passwordConfirmation) {
        const error = password === passwordConfirmation ? '' : 'Passwords Must Match' 
        this.setState({ error })
      } else {
        this.setState({ error: '' })
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { token, password, passwordConfirmation } = this.state
    const { dispatch } = this.props
    if (password === passwordConfirmation) {
      axios.post('/api/reset_password', { token, password })
        .then( res => { 
          dispatch(setFlash('Password Reset.  Please Login', 'green'))
          this.setState({ isReset: true, password: '', passwordConfirmation: '' })
        })
        .catch( err => {
          dispatch(setFlash(err.response.data, 'red'))
        })
    }
  }

  render() {
    const { loading, password, passwordConfirmation, error, isReset } = this.state

    if (loading) {
      return (
        <Segment>
          <Dimmer active>
            <Loader />
          </Dimmer>
        </Segment>
      )
    } else {
      return (
        <AuthContainer basic> 
          <AuthWrapper basic>
            { error && <Error>{error}</Error> }
            { isReset  ?
                <Link to="/login">
                  <Text as="h1" textAlign="center">Please Login</Text>
                </Link>
                :
              <FlexForm onSubmit={this.handleSubmit}>
                <Field>
                  <WhiteLabel htmlFor="password">Password</WhiteLabel>
                  <Form.Input
                    id="password"
                    name="password"
                    value={password}
                    onChange={this.handleChange}
                    type="password"
                    required
                  />
                </Field>
                <Field>
                  <WhiteLabel htmlFor="passwordConfirmation">Password</WhiteLabel>
                  <Form.Input
                    id="passwordConfirmation"
                    name="passwordConfirmation"
                    value={passwordConfirmation}
                    onChange={this.handleChange}
                    type="password"
                    required
                  />
                </Field>
                <CommonButton fluid>Submit</CommonButton>
              </FlexForm>
            }
          </AuthWrapper>
        </AuthContainer>
      )
    }
  }
}

export default connect()(ResetPW)

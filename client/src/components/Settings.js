import React, { Component } from 'react';
import { Header, Container, Form, Divider, Dimmer, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux'
import axios from 'axios';
import { Flex } from './CommonStyles';
import { setFlash } from '../reducers/flash'

class Settings extends Component {
  state = { courseId: '', loading: false }

  getCourseInfo = () => {
    const { courseId } = this.state
    const { dispatch } = this.props
    if (courseId) {
      this.setState({ loading: true }, () => {
        axios.get(`/api/init_courses/${courseId}`)
          .then( res => { 
            const { users, enrollments, name } = res.data
            const msg = `Users: ${users} | Enrollments: ${enrollments} added to ${name}`
            dispatch(setFlash(msg, 'green'))
            this.setState({ courseId: '' })
            this.setState({ loading: false })
          })
          .catch( err => {
            dispatch(setFlash('Something went wrong', 'red'))
            this.setState({ loading: false })
          })
      })
    } else {
      dispatch('Add a course id', 'red')
    }
  }

  handleChange = ({ target }) => {
    const { name, value } = target
    this.setState({ [name]: value })
  }

  loader = () => {
    return (
      <Dimmer active>
        <Loader>Loading</Loader>
      </Dimmer>
    )
  }

  render() {
    const { courseId, loading } = this.state
    return (
      <Container>
        <Divider hidden />
        <Flex direction="column" alignItems="center">
          <Header as='h1' textAlign='center'>Add A Course</Header>
          <Form onSubmit={this.getCourseInfo}>
            <Form.Input 
              value={courseId} 
              name="courseId"
              label="Course Id"
              type="number"
              min="1"
              step="1"
              onChange={this.handleChange}
              required
            />
            { loading ? this.loader() : <Form.Button>Import Course Data</Form.Button> }
          </Form>
        </Flex>
      </Container>
    );
  }
}

export default connect()(Settings);

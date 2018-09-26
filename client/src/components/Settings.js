import React, { Component } from 'react';
import { Card, Header, Container, Form, Divider, Dimmer, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux'
import axios from 'axios';
import { Flex } from './CommonStyles';
import { setFlash } from '../reducers/flash'

class Settings extends Component {
  state = { courseId: '', loading: false, courses: [] }

  componentDidMount() {
    axios.get('/api/courses')
    .then( res => this.setState({ courses: res.data }) )
  }

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

  changeWeights = (e, courseId) => {
    const { assignments, attendance } = e.target.elements 
    const { dispatch } = this.props
    const assignValue = parseFloat(assignments.value)
    const attendanceValue = parseFloat(attendance.value)
    const weights = { attendance: attendanceValue, assignments: assignValue }
    if (assignValue + attendanceValue === 100.0) {
      axios.post(`/api/courses/${courseId}/grade_weights`, { weights })
        .then( () => dispatch(setFlash('Weights Adjusted', 'green')) )
    } else {
      dispatch(setFlash("Weights must add up to 100", "red"))
    }
  }

  render() {
    const { courseId, loading, courses } = this.state
    return (
      <Container>
        <Divider hidden />
        <Flex justifyContent="space-around">
          <Card.Group itemsPerRow={4} stackable>
          { courses.map( card =>  {
            const { 
              id, 
              canvas_id,
              name, 
              grade_weight = {}
            } = card
            const { assignments = 0, attendance = 0 } = grade_weight
            return (
              <Card key={id}>
                <Card.Content>
                  <Card.Header>{name}</Card.Header>
                  <Card.Meta>{canvas_id}</Card.Meta>
                  <Card.Description>
                    <Form onSubmit={(e) => this.changeWeights(e, id)}>
                      <Flex direction="column">
                        <Form.Input
                          label="Assignments %"
                          name="assignments"
                          defaultValue={`${assignments}`}
                          type="number"
                          min="0"
                        />
                        <Form.Input
                          label="Attendance %"
                          name="attendance"
                          defaultValue={`${attendance}`}
                          type="number"
                          min="0"
                        />
                        <Form.Button>Save</Form.Button>
                      </Flex>
                    </Form>
                  </Card.Description>
                </Card.Content>
              </Card>
            )
          })
          }
        </Card.Group>
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
      </Flex>
    </Container>
    );
  }
}

export default connect()(Settings);

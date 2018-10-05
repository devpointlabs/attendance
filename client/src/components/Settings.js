import React, { Component } from 'react';
import { Card, Header, Container, Form, Divider, Dimmer, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux'
import axios from 'axios';
import { Flex } from './CommonStyles';
import { setFlash } from '../reducers/flash'
import CourseSetting from './CourseSetting'

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
          const { users, enrollments, name } = res.data.counts
          const { course } = res.data
          const { courses } = this.state
          const msg = `Users: ${users} | Enrollments: ${enrollments} added to ${name}`
          dispatch(setFlash(msg, 'green'))
          this.setState({ courseId: '', loading: false, courses: [...courses, course] })
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
    const itemsPerRow  = courses.length < 4 ? courses.length : 4
    return (
      <Container>
        <Divider hidden />
        <Flex justifyContent="space-around">
          <Card.Group itemsPerRow={itemsPerRow === 0 ? 1 : itemsPerRow} stackable>
          { courses.map( card =>  <CourseSetting key={card.id} course={card} /> ) }
        </Card.Group>
        <Flex paddingLeft={20} direction="column" alignItems="center">
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

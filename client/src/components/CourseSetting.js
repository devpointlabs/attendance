import React, { Component } from 'react';
import { Card, Form } from 'semantic-ui-react';
import { connect } from 'react-redux'
import axios from 'axios';
import { Flex } from './CommonStyles';
import { setFlash } from '../reducers/flash'

class CourseSetting extends Component {

  handleChange = ({ target }) => {
    const { name, value } = target
    this.setState({ [name]: value })
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
    const { course = {} } = this.props
    const { 
      id, 
      canvas_id,
      name, 
      grade_weight = {}
    } = course
    const { assignments = 0, attendance = 0 } = grade_weight
    return (
      <Card>
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
  }
}

export default connect()(CourseSetting);


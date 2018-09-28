import React, { Fragment, Component } from 'react';
import { Divider, Card, Form, List, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux'
import axios from 'axios';
import { Flex } from './CommonStyles';
import { setFlash } from '../reducers/flash'
import styled from 'styled-components'
import { Pointer } from './CommonStyles'

const Scroller = styled.div`
  overflow-y: scroll;
`

class CourseSetting extends Component {
  state = { showSchema: false, standard: [] }

  componentDidMount() {
    const { standard } = this.props.course.grade_weight
    this.setState({ standard })
  }

  toggleShowSchema = () => {
    this.setState( state => ({ showSchema: !state.showSchema }) )
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

  revert = () => {
    const { standard } = this.props.course.grade_weight
    this.setState({ standard })
  }

  removeStandard = (index) => {
    const { standard } = this.state
    this.setState({ standard: standard.filter( (s,i) => i !== index ) })
  }

  showSchema = () => {
    const { standard } = this.state
    return (
      <Fragment>
        <Scroller>
          { standard.map( (standard, i) => 
              <List divided celled key={i}>
                <List.Item>
                  <List.Content>
                    <List.Header>
                      {standard.text}
                    </List.Header>
                    <List.Description>
                      <Flex justifyContent="space-between">
                        <span>
                         {standard.key}
                       </span>
                       <span>
                        {standard.value}
                      </span>
                        <Pointer onClick={() => this.removeStandard(i)}>
                          <Icon name="times" color="red" />
                        </Pointer>
                      </Flex>
                    </List.Description>
                  </List.Content>
                </List.Item>
              </List>
            )
          }
        </Scroller>
        <Divider hidden />
        <Flex justifyContent="space-around">
          <Form.Button type="button" onClick={this.toggleShowSchema}>Weight</Form.Button>
          <Form.Button type="button" onClick={this.revert} icon="sync" />
          <Form.Button type="button" primary onClick={this.updateStandard}>Save</Form.Button>
        </Flex>
      </Fragment>
    )
  }

  render() {
    const { course = {} } = this.props
    const { showSchema } = this.state
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
            { showSchema ?
                this.showSchema() 
                :
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
                    <Flex>
                      <Form.Button onClick={this.toggleShowSchema} type="button">Schema</Form.Button>
                      <Form.Button primary>Save</Form.Button>
                    </Flex>
                  </Flex>
                </Form>
            }
          </Card.Description>
        </Card.Content>
      </Card>
    )
  }
}

export default connect()(CourseSetting);


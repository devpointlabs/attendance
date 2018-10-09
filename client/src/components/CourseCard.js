import React from 'react'
import {
  Card,
  Label,
  Button,
  Divider,
  Icon,
} from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import DatePicker from 'react-date-picker'
import styled from 'styled-components'
import Permission from './Permission'
import { Flex, Pointer } from './CommonStyles'
import { roles } from '../utils/strHelper'


const Picker = styled(DatePicker)`
  .react-date-picker__button {
    border: none !important;
  }
`

const FlexButton = styled(Button)`
  flex-grow: 1;
`

class CourseCard extends React.Component {
  state = { showCal: false }

  handleDateChange = (date) => {
    const { id, updateCourse } = this.props
    axios.put(`/api/courses/${id}/update`, { course: { course_start: date }})
      .then( res => { 
        updateCourse(res.data)
        this.setState({ showCal: false })
      })
  }

  normalizeDate = (date) => {
    if (!date)
      return new Date()

    date = new Date(date)
    return new Date( date.getTime() - date.getTimezoneOffset() * -60000 )
  }

  checkStartDate = (date) => {
    const { showCal } = this.state
    const actualDate = this.normalizeDate(date)

    if (showCal)
      return (
        <Picker 
          value={actualDate}
          onChange={this.handleDateChange}
          clearIcon={null}
          caledarIcon={<Icon name="calendar" />}
        />
      )
    if (!date) {
      return (
        <Pointer onClick={this.toggleShowCal}>
          <Label tag color="red">! Start Date</Label>
        </Pointer>
      )
    } else {
      return (
        <Pointer onClick={this.toggleShowCal}>
          <Label tag color="blue">{actualDate.toLocaleDateString()}</Label>
        </Pointer>
      )
    }
  }

  toggleShowCal = () => {
    this.setState( state => ({ showCal: !state.showCal }) )
  }

  render() {
    const { 
      name, 
      id, 
      weeks, 
      course_start, 
      showConfirm,
      genReport,
      role = 'admin',
      user,
      type,
    } = this.props
    const userRole = roles[role]
    return (
      <Card key={id}>
        <Card.Content>
          <Link to={`/courses/${id}`}>
            <Card.Header>
              {name}
            </Card.Header>
            <Card.Meta>
              {userRole}
            </Card.Meta>
          </Link>
        </Card.Content>
        <Permission permission="isTeacherOrAdmin" user={user.is_admin ? user : { role } }>
          <Card.Content extra>
            <Flex justifyContent="space-between" flexWrap="wrap">
              <span>Weeks: {weeks}</span>
              <Permission permission="isAdmin" user={user}>
                { this.checkStartDate(course_start) }
              </Permission>
            </Flex>
            <Divider />
            <Flex justifyContent="space-between" flexWrap="wrap">
              <FlexButton
                color={ type === 'archived' ? "green" : "red" }
                onClick={() => showConfirm(id)}
              >
                { type === 'archived' ? 'Restore' : 'Archive' }
              </FlexButton>
              <FlexButton
                color="blue"
                onClick={() => genReport(id)}
              >
                Run Report
              </FlexButton>
            </Flex>
          </Card.Content>
        </Permission>
      </Card>
    )
  }
}

export default CourseCard

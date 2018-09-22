import React from 'react'
import axios from 'axios'
import { Header, Button, Container, Divider, List, Image, Icon } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { Flex } from './CommonStyles'
import Marks from './Marks'
import Permission from './Permission'
import Student from './Student'

const Arrow = styled(Icon)`
  cursor: pointer;
`

const Pointer = styled.div`
  cursor: pointer;
`

class Course extends React.Component {
  state = { 
    users: [], 
    currentUser: {}, 
    restricted: false, 
    date: new Date(), 
    records: [], 
    individualView: false
  }

  componentDidMount() {
    const { id } = this.props.match.params
    axios.get(`/api/courses/${id}`)
      .then( res => { 
        const { user, users } = res.data
        const visibleUsers = user.role === 'student' ? [users.find( u => u.id === user.id)] : users
        this.setState({ users: visibleUsers , currentUser: user, individualView: user.role === 'student' ? user.id : false }, () => {
          this.getAttendanceByDate()
        }) 
      })
      .catch( err => {
        if (err.response.data === 'restricted')
          this.setState({ restricted: true }) })
  }

  getAttendanceByDate = () => {
    const { date } = this.state
    const { id } = this.props.match.params
    axios.post(`/api/records/${id}/by_date/`, { date: date.toLocaleDateString() } )
      .then( res => this.setState({ records: res.data }) )
  }

  datePlus = () => {
    const { date } = this.state
    const tomorrow = date
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.setState({ date: tomorrow }, () => this.getAttendanceByDate() )
  }

  dateMinus = () => {
    const { date } = this.state
    const yesterday = date
    yesterday.setDate(yesterday.getDate() - 1);
    this.setState({ date: yesterday }, () => this.getAttendanceByDate() )
  }

  today = () => {
    this.setState({ date: new Date() }, () => this.getAttendanceByDate() )
  }

  datePicker = () => {
    const { date } = this.state
    const dateString = date.toLocaleDateString()
    const today = dateString === new Date().toLocaleDateString()
    return (
      <Flex justifyContent="space-between" alignItems="center">
        <Arrow onClick={this.dateMinus} name="chevron left" />
        <Header as="h2">{dateString}</Header>
        <Arrow onClick={this.datePlus} name="chevron right" />
        { !today && <Button primary onClick={this.today}>Today</Button> }
      </Flex>
    )
  }

  markUser = (id, status) => {
    const { date } = this.state
    axios.post('/api/records', { id, status, date: date.toLocaleDateString() })
      .then( res => { 
        const recs = this.state.records
        const existing = recs.find( r => r.id === id )
        let records
          if (existing) {
            records = recs.map( r => {
            if (r.id === id) 
              return { ...r, status: res.data.status }
            return r
          })
        } else {
          records = [...this.state.records, { id, status: res.data.status }]
        }

        this.setState({ records })
      })
  }

  checkStatus = (user_id) => {
    const { records } = this.state
    const record = records.find( r => r.id === user_id )
    if (record)
      return record.status
    else
      return ''
  }

  setIndividualView = (id) => {
    this.setState({ individualView: id })
  }

  render() {
    const { users, restricted, currentUser, individualView } = this.state
    const { id } = this.props.match.params
    if (restricted) {
      return <Redirect to="/" />
    } else {
      return (
        <Container>
          <Divider hidden />
          { !individualView && this.datePicker() }
          { individualView ?
            <Flex>
              <Permission permission="isStaff" user={currentUser}>
                <Divider hidden/>
                <Button onClick={() => this.setIndividualView(null) }>
                  <Icon name="chevron left" />
                </Button>
              </Permission>
              <Student courseId={id} user={individualView} />
            </Flex>
            :
            <List celled verticalAlign="middle">
              { users.map( user => 
                  <List.Item key={user.id}>
                    <Image avatar src={user.image} alt="user avatar" />
                    <List.Content onClick={() => this.setIndividualView(user.id) }>
                      <List.Header>
                        <Pointer>
                          {user.name}
                        </Pointer>
                      </List.Header>
                    </List.Content>
                      <List.Content floated="right">
                        <Permission permission="isStaff" user={currentUser}>
                          <Marks status={this.checkStatus(user.id)} id={user.id} markUser={this.markUser} />
                        </Permission>
                      </List.Content>
                  </List.Item>
                )
              }
            </List>
          }
        </Container>
      )
    }
  }
}

export default Course

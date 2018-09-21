import React from 'react'
import axios from 'axios'
import { Header, Button, Container, Divider, List, Image, Icon } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { Flex } from './CommonStyles'
import Marks from './Marks'

const Arrow = styled(Icon)`
  cursor: pointer;
`

class Course extends React.Component {
  state = { users: [], user: {}, restricted: false, date: new Date() }

  componentDidMount() {
    const { id } = this.props.match.params
    axios.get(`/api/courses/${id}`)
      .then( res => this.setState({ users: res.data }) )
      .catch( err => {
        if (err.response.data === 'restricted')
          this.setState({ restricted: true })
      })
  }

  datePlus = () => {
    const { date } = this.state
    const tomorrow = date
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.setState({ date: tomorrow })
  }

  dateMinus = () => {
    const { date } = this.state
    const yesterday = date
    yesterday.setDate(yesterday.getDate() - 1);
    this.setState({ date: yesterday })
  }

  today = () => {
    this.setState({ date: new Date() })
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

  render() {
    const { users, user, restricted } = this.state
    if (restricted) {
      return <Redirect to="/" />
    } else if (user.id) {
      return <span>{user.id}</span>
    } else {
      return (
        <Container>
          <Divider hidden />
          { this.datePicker() }
          <List celled verticalAlign="middle">
            { users.map( user => 
                <List.Item key={user.id}>
                  <Image avatar src={user.image} alt="user avatar" />
                  <List.Content>
                    <List.Header>
                      {user.name}
                    </List.Header>
                  </List.Content>
                  <List.Content floated="right">
                    <Marks status={user.status} />
                  </List.Content>
                </List.Item>
              )
            }
          </List>
        </Container>
      )
    }
  }
}

export default Course

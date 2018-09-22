import React from 'react'
import axios from 'axios'
import { Container, Card, List, Image } from 'semantic-ui-react'
import styled from 'styled-components'
import { Flex } from './CommonStyles'

class Student extends React.Component {
  state = { user: {}, Image }

  componentDidMount() {
    const { courseId, user } = this.props
    axios.get(`/api/records/${courseId}/users/${user}`) 
      .then( res => this.setState({ user: res.data }) )
  }

  calcTotals = () => {
    const { user: { records = [] }  } = this.state
    const statuses = ['present', 'absent', 'tardy', 'excused']
    const totals = { present: 0, absent: 0, tardy: 0, excused: 0 }
    for ( const status of statuses ) {
      totals[status] = records.filter( r => r.status === status ).length
    }

    return totals
  }

  render() {
    const { user } = this.state
    const { present, absent, tardy, excused } = this.calcTotals()
    const records = user.records || []
    return (
      <Container>
          <Flex justifyContent="space-around">
            <Image src={user.image} size="medium"/>
            <Card>
              <Card.Content>
                <Card.Header>{user.name}</Card.Header>
              </Card.Content>
              <Card.Content extra>
                <List divided>
                  <List.Item>
                    <List.Header>
                      <Flex justifyContent='space-between'>
                        <span>
                          Present: 
                        </span>
                        <span>
                          {present}
                        </span>
                      </Flex>
                    </List.Header>
                  </List.Item>
                  <List.Item>
                    <List.Header>
                      <Flex justifyContent='space-between'>
                        <span>
                          Absent: 
                        </span>
                        <span>
                          {absent}
                        </span>
                      </Flex>
                    </List.Header>
                  </List.Item>
                  <List.Item>
                    <List.Header>
                      <Flex justifyContent='space-between'>
                        <span>
                          Tardy: 
                        </span>
                        <span>
                          {tardy}
                        </span>
                      </Flex>
                    </List.Header>
                  </List.Item>
                  <List.Item>
                    <List.Header>
                      <Flex justifyContent='space-between'>
                        <span>
                          Excused: 
                        </span>
                        <span>
                          {excused}
                        </span>
                      </Flex>
                    </List.Header>
                  </List.Item>
                </List>
              </Card.Content>
            </Card>
          </Flex>
          <List divided>
            { records.map( r => {
                return (
                  <List.Item key={r}>
                    <List.Header>Status: {r.status}</List.Header>
                    <List.Description>Date: {new Date(r.day).toLocaleDateString()}</List.Description>
                  </List.Item>
                )
              })
            }
          </List>
      </Container>
    )
  }
}

export default Student

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

  render() {
    const { user } = this.state
    return (
      <Container>
          <Flex justifyContent="center">
            <Image avatar src={user.image} size="medium"/>
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
                          {user.present}
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
                          {user.absent}
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
                          {user.tardy}
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
                          {user.excused}
                        </span>
                      </Flex>
                    </List.Header>
                  </List.Item>
                </List>
              </Card.Content>
            </Card>
          </Flex>
      </Container>
    )
  }
}

export default Student

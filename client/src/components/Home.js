import React, { Component } from 'react'
import axios from 'axios'
import { Card, Header, Container } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { roles } from '../utils/strHelper'

class Home extends React.Component {
  state =  { courses: [] }

  componentDidMount() {
    axios.get('/api/courses')
      .then( res => this.setState({ courses: res.data }) )
  }

  render() {
    const { courses } = this.state
    return (
      <Container>
        <Header as="h1" textAlign="center">Courses</Header>
        <Card.Group itemsPerRow={4} stackable>
          { courses.map( c => {
              const { name, id, role } = c
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
                </Card>
              )
            })
          }
        </Card.Group>
      </Container>
    )
  }
}

export default Home;

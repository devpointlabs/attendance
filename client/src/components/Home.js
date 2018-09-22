import React from 'react'
import axios from 'axios'
import { Button, Card, Header, Container, Divider } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { roles } from '../utils/strHelper'
import Permission from './Permission'
import { Flex } from './CommonStyles'

class Home extends React.Component {
  state =  { courses: [] }

  componentDidMount() {
    axios.get(`/api/courses?type=${this.props.type}`)
      .then( res => this.setState({ courses: res.data }) ) 
  }

  archive = (id) => {
    const { type } = this.props
    const method = type ? 'put' : 'delete'
    axios[method](`/api/courses/${id}`)
      .then( res => {
        this.setState({ courses: this.state.courses.filter( c => c.id !== id) })
      })
  }



  render() {
    const { courses } = this.state
    const { user, type } = this.props
    return (
      <Container>
        <Divider hidden />
        { type === 'archived' ? null :
            <Permission permission="isAdmin" user={user}>
              <Flex justifyContent="flex-end">
                <Link to="/archived">Archived Courses</Link>
              </Flex>
            </Permission>
        }
        <Header as="h1" textAlign="center">Courses</Header>
        <Divider />
        <Card.Group itemsPerRow={4} stackable>
          { courses.map( c => {
              const { name, id, role = 'admin' } = c
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
                      <Flex justifyContent="flex-end">
                        <Button 
                          color={ type === 'archived' ? "green" : "red" } 
                          onClick={() => this.archive(id)}
                        >
                          { type === 'archived' ? 'Restore' : 'Archive' }
                        </Button>
                      </Flex>
                    </Card.Content>
                  </Permission>
                </Card>
              )
            })
          }
        </Card.Group>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default connect(mapStateToProps)(Home);

import React from 'react'
import axios from 'axios'
import { Label, Button, Card, Header, Container, Divider } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { roles } from '../utils/strHelper'
import Permission from './Permission'
import { Flex, Pointer } from './CommonStyles'
import { setFlash } from '../reducers/flash'
import Confirm from './Confirm'

class Home extends React.Component {
  state =  { courses: [], showConfirm: false, archiving: null }

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

  genReport = (id) => {
    axios.post(`/api/reports/courses/${id}`)
      .then( res => this.props.dispatch(setFlash('Report is generating', 'green')) )
  }

  checkStatus = (status) => {
     if (status) 
       this.archive(this.state.archiving)
     this.setState({ archiving: null, showConfirm: false })
  }

  showConfirm = (id) => {
    this.setState({ archiving: id, showConfirm: true })
  }

  checkStartDate = (date) => {
    if (!date) {
      return ( 
        <Pointer onClick={this.toggleShowCal}>
          <Label tag color="red">! Start Date</Label>
        </Pointer>
      )
    } else {
      return <span>{date.toLocaleDateString()}</span>
    }
  }

  render() {
    const { courses, showConfirm } = this.state
    const { user, type } = this.props
    const msg = type === 'archived' ? 'Restore' : 'Archive'
    return (
      <Container>
        { showConfirm && <Confirm message={`Really ${msg}?`} dismiss={this.checkStatus} /> }
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
              const { name, id, weeks, course_start, role = 'admin' } = c
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
                      <Flex justifyContent="space-between">
                        <span>Weeks: {weeks}</span>
                        <Permission permission="isAdmin" user={user}>
                          { this.checkStartDate(course_start) }
                        </Permission>
                      </Flex>
                      <Divider />
                      <Flex justifyContent="space-between">
                        <Button 
                          color={ type === 'archived' ? "green" : "red" } 
                          onClick={() => this.showConfirm(id)}
                        >
                          { type === 'archived' ? 'Restore' : 'Archive' }
                        </Button>
                        <Button 
                          color="blue"
                          onClick={() => this.genReport(id)}
                        >
                          Run Report
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

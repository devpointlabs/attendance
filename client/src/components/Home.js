import React from 'react'
import axios from 'axios'
import { Card, Header, Container, Divider } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Permission from './Permission'
import { Flex } from './CommonStyles'
import { setFlash } from '../reducers/flash'
import Confirm from './Confirm'
import CourseCard from './CourseCard'

class Home extends React.Component {
  state =  { courses: [], showConfirm: false, archiving: null }

  componentDidMount() {
    axios.get(`/api/courses?type=${this.props.type}`)
      .then( res => this.setState({ courses: res.data }) ) 
  }

  updateCourse = (course) => {
    this.setState({
      courses: this.state.courses.map( c => {
        if (course.id === c.id)
          return course
        return c
      })
    })
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
          { courses.map( c => 
              <CourseCard
                key={c.id}
                {...c}
                genReport={this.genReport}
                updateCourse={this.updateCourse}
                showConfirm={this.showConfirm}
                user={user}
                type={type}
              />
            )
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

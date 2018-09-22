import React, { Fragment } from 'react'
import { Input, Button, List, Image } from 'semantic-ui-react'
import axios from 'axios'
import Student from './Student'

class Students extends React.Component {
  state = { name: '', students: [], filtered: [], student: { courses: [] } }

  componentDidMount() {
    axios.get('/api/enrollments')
    .then( res => { 
      const students = []
      res.data.forEach( user => {
        const student = students.find( u  => u.id === user.id )
        if (student) {
          student.courses.push({ id: user.course_id, name: user.course_name })
        } else {
          students.push({ 
            id: user.id, 
            name: user.name, 
            email: user.email,
            image: user.image,
            courses: [{ id: user.course_id, name: user.course_name  }]
          })
        }
      })

      this.setState({ students, filtered: students }) 
    })
  }

  search = (e) => {
    const { value } = e.target
    this.setState({ name: value }, () => {
      const reg = new RegExp(value.toLowerCase())
      const { students } = this.state
      let filtered 
      if (value) {
        filtered = students.filter( s => reg.test(s.name.toLowerCase()) || reg.test(s.email.toLowerCase() ) )
      } else {
        filtered = students
      }

      this.setState({ filtered })
    })
  }

  clearSearch = () => {
    const { students } = this.state
    this.setState({ filtered: students, name: '' })
  }

  render() {
    const { name, filtered, student } = this.state
    return (
      <Fragment>
        <Input
          label={
            name ?
              (<Button basic onClick={this.clearSearch}>
                Clear Search
                </Button> 
               )
             :
            'Search'
          }
          value={name}
          onChange={this.search}
        />
        { student.id ? 
            <Fragment>
              <Student courseId={student.course_id} user={student} />
            </Fragment>
            :
            <List divided relaxed>
              { filtered.map( user => 
                  <List.Item key={user.id}>
                    <Image avatar src={user.image} alt="user avatar" />
                    <List.Header>
                      {user.name}
                    </List.Header>
                    <List.Description position="right">
                      { user.courses.map( c => <p key={c.id}>{c.name}</p> ) }
                    </List.Description>
                  </List.Item>
                )
              }
            </List>
        }
      </Fragment>
    )
  }

}

export default Students


import React, { Fragment } from 'react'
import { Container, Divider, Input, Button, List, Image } from 'semantic-ui-react'
import axios from 'axios'
import Student from './Student'
import styled from 'styled-components'
import { CommonButton } from './CommonStyles'

const Course = styled.h3`
  color: blue;
  cursor: pointer;
  text-decoration: underline;
  padding: 5px;
`

class Students extends React.Component {
  state = { name: '', students: [], filtered: [], student: {} }

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

  setUser = (student) => {
    this.setState({ student })
  }

  clearStudent = () => {
    this.setState({ student: {} })
  }

  render() {
    const { name, filtered, student } = this.state
    return (
      <Container>
        <Divider hidden />
        { student.id ? 
            <Fragment>
              <Button onClick={this.clearStudent}>Back To Search</Button>
              <Divider hidden />
              <Student courseId={student.course_id} user={student.id} />
            </Fragment>
            :
            <Fragment>
              <Input
                fluid
                label={
                  name ?
                  (  <CommonButton basic onClick={this.clearSearch}>
                       Clear Search
                     </CommonButton> 
                  )
                  :
                    'Search'
                }
                value={name}
                onChange={this.search}
              />
              <List divided relaxed>
                { filtered.map( user => 
                    <List.Item key={user.id}>
                      <Image avatar src={user.image} alt="user avatar" />
                      <List.Header>
                        {user.name}
                      </List.Header>
                      <List.Description position="right">
                        { user.courses.map( c => 
                            <Course 
                              key={c.id}
                              onClick={ () => {
                                const currentUser = {...user, course_id: c.id } 
                                this.setUser(currentUser)
                              }}
                            >
                              {c.name}
                            </Course> 
                          ) 
                        }
                      </List.Description>
                    </List.Item>
                  )
                }
              </List>
            </Fragment>
        }
      </Container>
    )
  }

}

export default Students


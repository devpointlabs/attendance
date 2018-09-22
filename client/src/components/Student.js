import React from 'react'
import axios from 'axios'

class Student extends React.Component {
  state = { user: {} }

  componentDidMount() {
    const { courseId, user } = this.props
    axios.get(`/api/records/${courseId}/users/${user}`) 
      .then( res => this.setState({ user: res.data }) )
  }

  render() {
    return null
  }
}

export default Student

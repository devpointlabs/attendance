import React from 'react'

export const permissions = {
  isAdmin: (user) =>  user.is_admin,
  isStaff: (user) => { 
    let view = false
    if (user.role === 'ta' || user.role === 'teacher')
      view = true
    if (user.is_admin)
      view = true
    return view
  },
  isStudent: (user) => user.role === 'student',
  isTeacherOrAdmin: (user) => user.is_admin || user.role === 'teacher',
}

class Permission extends React.Component {
  state = { canView: false }

  componentDidMount() {
    const { role, user } = this.props
    const func = permissions[role]
    const canView = func(user)
    this.setState({ canView })
  }

  render() {
    return this.state.canView ? this.props.children : null
  }
}

export default Permission


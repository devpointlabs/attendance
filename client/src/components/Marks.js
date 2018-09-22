import React from 'react'
import { Icon } from 'semantic-ui-react'
import styled from 'styled-components'

const Mark = styled(Icon)`
  cursor: pointer;
  margin: 10px 20px !important;
  font-size: 2em !important;
`

class Marks extends React.Component {
  colors = { present: 'green', absent: 'red', tardy: 'orange', excused: 'blue' }
  actions = [
    { name: 'check', status: 'present' },
    { name: 'times', status: 'absent' },
    { name: 'clock outline', status: 'tardy' },
    { name: 'edit', status: 'excused' },
  ]

  updateRecord = (status) => {
    this.props.markUser(this.props.id, status)
  }

  render() {
    const { status } = this.props
    return this.actions.map( a => {
      return <Mark 
               color={a.status === status ? this.colors[status] : 'black' } 
               onClick={() => this.updateRecord(a.status) } 
               key={a.name} 
               name={a.name} 
             />
    })
  }

}

export default Marks

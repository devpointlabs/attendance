import React from 'react'
import axios from 'axios'
import { 
  Button, 
  Divider, 
  Container, 
  Card, 
  List, 
  Image, 
  Dropdown, 
  Loader,
  Header,
} from 'semantic-ui-react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Flex } from './CommonStyles'
import { Cell, PieChart, Legend, Tooltip, Pie } from 'recharts'
import Permission from './Permission'
import { setFlash } from '../reducers/flash'

const colors = { 
  present: '#c3e6cb',
  absent: '#f5c6cb',
  tardy: '#ffeeba',
  excused: '#bee5eb',
}


const Item = styled(List.Item)`
  background-color: ${ props => colors[props.status] };
  padding: 5px 5px !important;
`

class Student extends React.Component {
  state = { 
    user: {}, 
    Image, 
    filter: 'all', 
    grades: [], 
    gradeWeight: {}, 
    gradesLoaded: false,
    grade: {},
  }

  componentDidMount() {
    const { courseId, user } = this.props
    axios.get(`/api/records/${courseId}/users/${user}`) 
    .then( res => this.setState({ user: res.data }, () => {
      axios.get(`/api/courses/${courseId}/grades/${user}`)
        .then( res => { 
          const { weights, grades } = res.data
          const total = grades.reduce( (total, grade) => total + grade.points, 0)
          const score = grades.reduce( (total, grade) => total + grade.score, 0)
          //Weighted Assignments as percent
          const assignmentPercent = parseFloat((score/total)*(weights.assignments/100).toFixed(2))

          //Weighted Attendance as percent
          const attendance = this.calcTotals()
          const { present = 0, tardy = 0, excused = 0, absent = 0 } = attendance
          const totalRecords = present + tardy + excused + absent
          const presentPercent = (present + excused)/totalRecords
          const tardyPercent = (tardy * .8)/totalRecords
          const attendancePercent = (presentPercent + tardyPercent)*(weights.attendance/100)

          this.setState({ 
            grades, 
            gradeWeight: weights, 
            gradesLoaded: true,
            grade: { assignments: assignmentPercent, attendance: attendancePercent },
          }) 
        })
      })
    ) 
  }

  setFilter = (filter = 'all') => {
    this.setState({ filter })
  }

  dropdownOptions = () => {
    return ['All', 'Present', 'Absent', 'Tardy', 'Excused'].map( text => {
      return { key: text, text, value: text.toLowerCase() }
    })
  }

  calcTotals = () => {
    const { user: { records = [] }  } = this.state
    const statuses = ['present', 'absent', 'tardy', 'excused']
    const totals = { present: 0, absent: 0, tardy: 0, excused: 0 }
    for ( const status of statuses ) {
      totals[status] = records.filter( r => r.status === status ).length
    }

    return totals
  }

  chart = ({ absent, present, tardy, excused }) => {
    const data = [
      { name: 'Present', value: present },
      { name: 'Absent', value: absent },
      { name: 'Tardy', value: tardy },
      { name: 'Excused', value: excused },
    ]

    return (
      <PieChart width={300} height={300}>
        <Legend />
        <Pie 
          data={data} 
          dataKey='value'
          cx={150} 
          cy={150} 
          outerRadius={80} 
          fill="#8884d8" 
          label
        >
          { data.map((entry, index) => <Cell key={index} fill={colors[entry.name.toLowerCase()]} /> )}
        </Pie>
        <Tooltip />
      </PieChart>
    )
  }

  filtered = (records) => {
    const { filter: currentFilter } = this.state
    if (currentFilter === 'all')
      return records
    return records.filter( r => r.status === currentFilter )
  }

  genReport = () => {
    const { courseId, dispatch } = this.props
    const { user } = this.state
    axios.post(`/api/reports/courses/${courseId}/users/${user.id}`)
      .then( () => dispatch(setFlash('Report has been generated', 'green')) )
  }

  grades = () => {
    const { grades } = this.state
    const totalAssignments = grades.length
    const total = grades.reduce( (total, grade) => total + grade.points, 0)
    const score = grades.reduce( (total, grade) => total + grade.score, 0)
    return (
      <div>
        <Header as="h3">Points: {score}/{total}</Header>
        <Header as="h3">Complete: {(score/total * 100).toFixed(2)}%</Header>
        <Header as="h3">Missing: { grades.filter( a => a.score === 0 && a.points !== 0 ).length }/{totalAssignments}</Header> 
      </div>
    )
  }

  render() {
    const { currentUser } = this.props
    const { user, filter, gradesLoaded } = this.state
    const { present, absent, tardy, excused } = this.calcTotals()
    const records = user.records || []
    return (
      <Container>
        <Permission 
          permission="isStaff" 
          user={currentUser.is_admin ? currentUser : this.props.user}
        >
            <Flex justifyContent="flex-end">
              <Button color="green" onClick={this.genReport}>
                Generate Report
              </Button>
            </Flex>
          </Permission>
          <Flex justifyContent="space-around" flexWrap="wrap">
            <Flex direction="column" justifyContent="center" alignItems="center">
              <Image src={user.image} avatar alt="user avatar" size="small"/>
              <Divider />
              { gradesLoaded ? 
                  this.grades() 
                  : 
                  <Loader active inline/>
              }
            </Flex>
            { this.chart({ absent, tardy, present, excused }) }
            <Card>
              <Card.Content>
                <Card.Header>{user.name}</Card.Header>
                <Divider />
                <List divided relaxed>
                  <List.Item>
                    <List.Header>
                      <Flex justifyContent='space-between'>
                        <span>
                          Present: 
                        </span>
                        <span>
                          {present}
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
                          {absent}
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
                          {tardy}
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
                          {excused}
                        </span>
                      </Flex>
                    </List.Header>
                  </List.Item>
                </List>
              </Card.Content>
            </Card>
          </Flex>
          <Dropdown 
            options={this.dropdownOptions()} 
            value={filter}
            onChange={ (_, {value}) => this.setFilter(value) }
            label="Filter"
          />
          <List divided>
            { this.filtered(records).map( r => {
                return (
                  <Item key={r.id} status={r.status}>
                    <Flex justifyContent="space-between">
                      <List.Header>Status: {r.status}</List.Header>
                      <List.Description>Date: {new Date(r.day).toLocaleDateString()}</List.Description>
                    </Flex>
                  </Item>
                )
              })
            }
          </List>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return { currentUser: state.user }
}

export default connect(mapStateToProps)(Student)

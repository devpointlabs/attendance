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
import Calendar from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import '../calendar-overrides.css'
import moment from 'moment'
import { Cell, PieChart, Legend, Tooltip, Pie } from 'recharts'
import Permission from './Permission'
import { setFlash } from '../reducers/flash'
import { capitalize } from '../utils/strHelper'
import { Flex, CommonButton } from './CommonStyles'
import Progress from './Progress'

const colors = { 
  present: '#c3e6cb',
  absent: '#f5c6cb',
  tardy: '#ffeeba',
  excused: '#bee5eb',
}

const localizer = Calendar.momentLocalizer(moment)

const Item = styled(List.Item)`
  background-color: ${ props => colors[props.status] };
  padding: 5px 5px !important;
`

const Status = styled.div`
  border: solid .5px black;
  border-radius: 50px;
  background-color: ${ props => colors[props.title] };
  width: 70%;
  margin-left: auto;
  margin-right: auto;
}
`

const CalContainer = styled.div`
  height: 450px;
`

const StatusHeader = styled(Header)`
  text-align: center;
  padding: 5px 0px !important;
`

const Record = ({ event: { title } }) => (
  <Status title={title}>
    <StatusHeader as="h3">
      {capitalize(title)}
    </StatusHeader>
  </Status>
)

class Student extends React.Component {
  state = { 
    user: {}, 
    filter: 'all', 
    grades: [], 
    gradeWeight: {}, 
    gradesLoaded: false,
    grade: {},
    attendance: {},
    weeks: [],
    progress: false,
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
          const attendancePercent = totalRecords === 0 ? (weights.attendance / 100) : (presentPercent + tardyPercent)*(weights.attendance/100)

          this.setState({ 
            attendance,
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

  toggleProgress = () => {
    this.setState( state => ({ progress: !state.progress }) )
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

  asPercent = (value) => {
    return `${(value * 100).toFixed(2)}%`
  }

  findGrade = () => {
    const { grade, gradeWeight: { standard = [] }} = this.state
    const total = (grade.attendance + grade.assignments) * 100
    const values = standard.map( v => v.value )
    const value = values.sort().reverse().find( v => v < total )
    const gradeObj = standard.find( s => s.value === value )
    return `${gradeObj.key}: ${gradeObj.text}`
  }

  getEvents = () => {
    const { user } = this.state
    const { records = [] } = user
    return records.map( record => {
      const { status, day } = record
      const date = moment(day)
      return {
        title: status,
        start: date,
        end: date,
        allDay: true
      }
    })
  }

  render() {
    const { currentUser } = this.props
    const { user, filter, gradesLoaded, grade, weeks, progress } = this.state
    const { present, absent, tardy, excused } = this.calcTotals()
    const totals = { present, absent, tardy, excused }
    const records = user.records || []
    return (
      <Container>
        <Permission 
          permission="isStaff" 
          user={currentUser.is_admin ? currentUser : this.props.user}
        >
            <Flex>
              <Flex>
                <CommonButton onClick={this.genReport}>
                  Generate Report
                </CommonButton>
                { gradesLoaded &&
                    <CommonButton primary onClick={this.toggleProgress}>
                      { progress ? 'Hide ' : 'Show ' }Progress
                    </CommonButton>
                }
              </Flex>
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
                  { [ 'present', 'absent', 'tardy', 'excused' ].map( record => {
                      const total = totals[record] 
                      const title = capitalize(record)
                      return (
                        <List.Item key={record}>
                          <List.Header>
                            <Flex justifyContent='space-between'>
                              <span>
                                {title}:
                              </span>
                              <span>
                                {total}
                              </span>
                            </Flex>
                          </List.Header>
                        </List.Item>
                      )
                    })
                  }
                  { gradesLoaded ? 
                    <List.Item>
                      <List.Header>
                        <Flex justifyContent='space-between'>
                          <span>
                            Assignments:
                          </span>
                          <span>
                            { this.asPercent(grade.assignments) }
                          </span>
                        </Flex>
                      </List.Header>
                      <List.Header>
                        <Flex justifyContent='space-between'>
                          <span>
                            Attendance:
                          </span>
                          <span>
                            { this.asPercent(grade.attendance) }
                          </span>
                        </Flex>
                      </List.Header>
                      <List.Header>
                        <Flex justifyContent='space-between'>
                          <span>
                            Total:
                          </span>
                          <span>
                            { this.asPercent(grade.assignments + grade.attendance) }
                          </span>
                        </Flex>
                      </List.Header>
                      <Divider />
                      <List.Header>
                        <Flex justifyContent='space-between'>
                          <Header>
                            Grade:
                          </Header>
                          <Header>
                            { this.findGrade() }
                          </Header>
                        </Flex>
                      </List.Header>
                    </List.Item>
                    : 
                    <Loader active inline/>
                  }
                </List>
              </Card.Content>
            </Card>
          </Flex>
          { progress && <Progress weeks={weeks} /> }
          <CalContainer>
            <Calendar
              localizer={localizer}
              views={['month']}
              events={this.getEvents()}
              startAccessor="start"
              endAccessor="end"
              components={{ event: Record }}
            />
          </CalContainer>
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

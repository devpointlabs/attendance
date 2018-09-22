import React from 'react'
import axios from 'axios'
import { Divider, Container, Card, List, Image } from 'semantic-ui-react'
import styled from 'styled-components'
import { Flex } from './CommonStyles'
import { Cell, PieChart, Legend, Tooltip, Pie } from 'recharts'

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
  state = { user: {}, Image }

  componentDidMount() {
    const { courseId, user } = this.props
    axios.get(`/api/records/${courseId}/users/${user}`) 
      .then( res => this.setState({ user: res.data }) )
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
          cx={150} 
          cy={150} 
          outerRadius={80} 
          fill="#8884d8" 
          label
        >
          { data.map((entry, index) => <Cell fill={colors[entry.name.toLowerCase()]} /> )}
        </Pie>
        <Tooltip />
      </PieChart>
    )
  }

  render() {
    const { user } = this.state
    const { present, absent, tardy, excused } = this.calcTotals()
    const records = user.records || []
    return (
      <Container>
          <Flex justifyContent="space-around" flexWrap="wrap">
            <Image src={user.image} size="medium"/>
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
            { this.chart({ absent, tardy, present, excused }) }
          </Flex>
          <List divided>
            { records.map( r => {
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

export default Student

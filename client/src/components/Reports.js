import React from 'react'
import { Header, Divider, List, Container } from 'semantic-ui-react'
import axios from 'axios'
import { Link } from 'react-router-dom'

class Reports extends React.Component {
  state = { reports: [] }

  componentDidMount() {
    axios.get('/api/reports')
      .then( res => this.setState({ reports: res.data }) )
  }

  render() {
    const { reports } = this.state
    return (
      <Container>
        <Header as="h1" textAlign="center">Reports</Header>
        <Divider />
        <List divided relaxed>
          { reports.map( r => 
              <List.Item key={r.id}>
                <List.Header>
                  <Link to={`/reports/${r.id}`}>
                    {r.name}
                  </Link>
                </List.Header>
                <List.Description>
                  { r.report_type } - { new Date(r.created_at).toLocaleDateString() }
                </List.Description>
              </List.Item>
            )
          }
        </List>
      </Container>
    )
  }
}

export default Reports


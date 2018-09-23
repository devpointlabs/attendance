import React from 'react'
import { Button, Header, Divider, List, Container } from 'semantic-ui-react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Confirm from './Confirm'

class Reports extends React.Component {
  state = { reports: [], archiving: null, showConfirm: false }

  componentDidMount() {
    axios.get('/api/reports')
      .then( res => this.setState({ reports: res.data }) )
  }

  archive = (id) => {
    axios.delete(`/api/reports/${id}`)
      .then( res => this.setState({ reports: this.state.reports.filter( r => r.id !== id ) }) )
  }

  checkStatus = (status) => {
    if (status) {
      this.archive(this.state.archiving)
    }

    this.setState({ archiving: null, showConfirm: false })
  }

  showConfirm = (id) => {
    this.setState({ archiving: id, showConfirm: true })
  }

  render() {
    const { reports, showConfirm } = this.state
    return (
      <Container>
        { showConfirm && <Confirm message='Really Archive Report?' dismiss={this.checkStatus} /> }
        <Header as="h1" textAlign="center">Reports</Header>
        <Divider />
        <List divided relaxed>
          { reports.map( r => 
              <List.Item key={r.id}>
                <List.Content>
                  <List.Header>
                    <Link to={`/reports/${r.id}`}>
                      {r.name}
                    </Link>
                  </List.Header>
                  <List.Description>
                    { r.report_type } - { new Date(r.created_at).toLocaleDateString() }
                  </List.Description>
                </List.Content>
                <List.Content floated="right">
                  <Button color="red" onClick={() => this.showConfirm(r.id)}>Archive</Button>
                </List.Content>
              </List.Item>
            )
          }
        </List>
      </Container>
    )
  }
}

export default Reports


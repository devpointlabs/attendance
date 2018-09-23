import React from 'react'
import { Container, Table, Header } from 'semantic-ui-react'
import axios from 'axios'

class Report extends React.Component {
  state = { report: {} }

  componentDidMount() {
    axios.get(`/api/reports/${this.props.match.params.id}`)
      .then( res => this.setState({ report: res.data }) )
  }

  render() {
    const { report } = this.state
    const { meta = {} , data = [], headers = [] } = report
    const { additional = {} } = meta
    let keys = []
    const headerSpan = (keys.length + 2) / 2
    const hasExtra = Object.keys(additional).length > 0
    if (hasExtra)
      keys = Object.keys(additional)
    if (meta.name) {
      return (
        <Container>
          <Header as="h2" textAlign="center">{meta.name}</Header>
          <Table celled structured >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell rowSpan={ hasExtra ? '2' : '1'}>Name</Table.HeaderCell>
                <Table.HeaderCell rowSpan={ hasExtra ? '2' : '1'}>Type</Table.HeaderCell>
                { hasExtra &&
                  <Table.HeaderCell colSpan={keys.length}>Meta</Table.HeaderCell>
                }
              </Table.Row>
              { hasExtra &&
                  <Table.Row>
                    { keys.map( key => <Table.HeaderCell key={key}>{key}</Table.HeaderCell> ) }
                  </Table.Row>
              }
              <Table.Row>
                <Table.Cell>{meta.name}</Table.Cell>
                <Table.Cell>{meta.type}</Table.Cell>
                { hasExtra && keys.map( key => <Table.Cell>{additional[key]}</Table.Cell> ) }
              </Table.Row>
              <Table.Row>
                { headers.map( header => <Table.HeaderCell key={header} colSpan={headerSpan}>{header}</Table.HeaderCell> ) }
              </Table.Row>
            </Table.Header>
            <Table.Body>
              { data.map( (d,i) => 
                  <Table.Row key={i}>
                    { d.map( (col, i) => <Table.Cell key={i}>{col}</Table.Cell> ) }
                  </Table.Row>
                )
              }
            </Table.Body>
          </Table>
        </Container>
      )
    } else {
      return null
    }
  }
}

export default Report

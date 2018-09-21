import React, { Component } from 'react';
import { Header, Button } from 'semantic-ui-react';
import axios from 'axios'

class Home extends Component {
  state = { course: '' }

  getCourseInfo = () => {
    axios.get(`/api/init_courses/${this.state.course}`)
      .then( res => { debugger } )
      .catch( err => { debugger } )
  }

  render() {
    return (
      <div>
        <Header as='h1' textAlign='center'>Home Component</Header>
        <input value={this.state.course} onChange={ (e) => this.setState({ course: e.target.value }) } />
        <Button onClick={this.getCourseInfo}>Click</Button>
      </div>
    );
  }
}

export default Home;

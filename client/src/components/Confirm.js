import React from 'react';
import { Button, Message, Container, Header } from 'semantic-ui-react';
import { Flex } from './CommonStyles'

const Confirm = ({ message, dismiss, no = 'No', yes = 'Yes' }) => (
  <Container>
    <Message
      color="red"
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Header as='h5' textAlign='center'>{message}</Header>
        <Flex justifyContent="space-around">
          <Button onClick={ () => dismiss(false) } basic>{no}</Button>
          <Button onClick={ () => dismiss(true) } color="red">{yes}</Button>
        </Flex>
      </Flex>
    </Message>
  </Container>
);

export default Confirm

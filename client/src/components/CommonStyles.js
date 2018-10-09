import styled from 'styled-components'
import { Header, Button, Form, Segment } from 'semantic-ui-react'

export const CommonButton = styled(Button)`
  background-color: ${ props => props.theme.secondary } !important;
  color: #FFF !important;
`

export const WhiteLabel = styled.label`
  color: white !important;
`

export const Text = styled(Header)`
  color: #FFF !important;
`

export const AuthWrapper = styled(Segment)`
  background-color: ${ props => props.theme.primary } !important;
`

export const FlexForm = styled(Form)`
  display: flex;
  flex-flow: wrap !important;
  flex-direction: column;
  maxWidth: 500px;
`

export const Field = styled(Form.Field)`
  width: 100% !important;
`

export const AuthContainer = styled(Segment)`
  margin-top: 5% !important;
  display: flex;
  width: 100%;
  justify-content: center;
`

export const Flex = styled.div`
  display: flex;
  justify-content: ${ props => props.justifyContent };
  flex-wrap: ${ props => props.flexWrap };
  align-items: ${ props => props.alignItems };
  align-self: ${ props => props.alignSelf };
  width: ${ props => props.full ? '100%' : '' };
  height: ${ props => props.height };
  flex-direction: ${ props => props.direction || 'row' };
  padding-top: ${ props => props.paddingTop || 0 }px;
  padding-left: ${ props => props.paddingLeft || 0}px;
`

export const Pointer = styled.div`
  cursor: pointer;
`


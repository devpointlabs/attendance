import styled from 'styled-components'

export const Flex = styled.div`
  display: flex;
  justify-content: ${ props => props.justifyContent };
  align-items: ${ props => props.alignItems };
  align-self: ${ props => props.alignSelf };
  width: ${ props => props.full ? '100%' : '' };
  height: ${ props => props.height };
  flex-direction: ${ props => props.direction || 'row' };
  padding-top: ${ props => props.paddingTop || 0 }px;
`

import React, { Component } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  position: fixed;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 200px;
  max-width: 80%;
  transform: translate(-50%, -50%);
  border: 1px solid #90043f;
  border-radius: 1rem;
  align-items: center;
  justify-content: center;
  color: #fff;
`

const Content = styled.span`
  display: inline-block;
  align-self: center;
  font-weight: bold;
  font-size: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--color-highlight);
`

export default function CreationV1() {
  return (
    <Wrapper>
      <Content className="Comming soon">Comming Soon !</Content>
    </Wrapper>
  )
}

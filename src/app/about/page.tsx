'use client'

import styled from "styled-components";

export default function About() {
 return (
    <Container>
      <Content>
        <Title>FedHB 소개</Title>
      </Content>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 2rem 2rem;
  background-color: #f9fafb;
  `

const Content = styled.div`
  width: 100%;
  margin: 0 auto;
`

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #111827;
  text-align: center;
  margin-bottom: 3rem;
`

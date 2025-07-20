'use client'

import styled from "styled-components";
import FederationView from "@/components/federations/FederationView";

export default function Home() {
  return (
    <Container>
      <Title>대시보드</Title>
      <FederationView />
    </Container>
  )
}

const Container = styled.div`
  background-color: white;
  height: 100%;
  `

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #111827;
  text-align: center;
`
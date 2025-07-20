'use client'

import styled from "styled-components";
import MeInfo from '@/components/MeInfo'
import FederationView from "@/components/federations/FederationView";

export default function Home() {
  return (
    <Container>
      <Title>대시보드</Title>
      <MeInfo />
      <FederationView />
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 2rem 2rem;
  background-color: gray;
  `

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #111827;
  text-align: center;
  margin-bottom: 3rem;
`
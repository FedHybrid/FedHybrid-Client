'use client'

import styled from "styled-components";
import MeInfo from '@/components/MeInfo'
import FederationView from "@/components/federations/FederationView";
import FederationList from "@/components/federations/FederationList";

export default function Home() {
  return (
    <Container>
      <Title>대시보드</Title>
      <FederationList />
    </Container>
  )
}

{/* <MeInfo />
      <FederationView /> */}

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  text-align: center;
  padding: 2rem 2rem;
  `

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #111827;
  text-align: center;
  margin-bottom: 1rem;
`
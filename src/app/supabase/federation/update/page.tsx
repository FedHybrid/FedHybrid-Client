'use client'

import styled from "styled-components";
import MeInfo from '@/components/MeInfo'
import FederationUpdate from "@/components/federations/FederationUpdate";

export default function Home() {
  return (
    <Container>
      <Title>연합 정보 업데이트</Title>
      <FederationUpdate />
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 2rem 2rem;
  background-color: #f9fafb;
  `

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #111827;
  text-align: center;
  margin-bottom: 3rem;
`
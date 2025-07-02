'use client'

import styled from "styled-components"

export default function Home() {
  return (
    <Container>
      <MainTitleWrapper>
        <MainTitle>
          Federated Learning - <Hy>Hy</Hy>
          <Brid>Brid</Brid> Demonstration
        </MainTitle>
      </MainTitleWrapper>
    </Container>
  );
}

const Container = styled.div`
  max-width: 72rem;
  min-height: 100vh;
  margin: 0 auto;
  padding: 4rem 1.5rem;
`

const MainTitleWrapper = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`

const MainTitle = styled.h1`
  font-size: 3rem;

  @media (min-width: 768px) {
    font-size: 3.75rem;
  }

  font-weight: 700;
  color: #FFF;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const Hy = styled.span`
  color: #9333ea;
`

const Brid = styled.span`
  color: #2563eb;
`
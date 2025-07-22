'use client'

import styled from "styled-components";
import FederationUpdateForm from "@/components/federations/FederationUpdateForm";

export default function Home() {
  return (
    <Container>
      <FederationUpdateForm />
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 2rem 2rem;
  background-color: white;
  `
  
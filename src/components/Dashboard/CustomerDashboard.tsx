"use client";

import styled from "styled-components";
import ExcelResultViewer from "./ExcelResultViewer";
import FedHybridIntegration from "./FedHybridIntegration";

export default function CustomerDashboard() {
  return (
    <Wrapper>
      <Title>참여자 대시보드</Title>
      <FedHybridIntegration />
      <ExcelResultViewer />
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const Title = styled.h1`
  padding: 1rem 0;
  font-size: 2.25rem;
  font-weight: 700;
  color: #111827;
  text-align: center;
`;

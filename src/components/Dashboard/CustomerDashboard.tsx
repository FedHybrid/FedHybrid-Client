"use client";

import DashboardCard from "./DashboardCard";
import styled from "styled-components";
import ExcelResultViewer from "./ExcelResultViewer";

export default function CustomerDashboard() {
  return (
    <Wrapper>
      <Title>참여자 대시보드</Title>
      <p className="dashboard-subtitle">
        Overview of the federated learning process
      </p>
      <DashboardCard />
      <ExcelResultViewer />
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #111827;
  text-align: center;
`;

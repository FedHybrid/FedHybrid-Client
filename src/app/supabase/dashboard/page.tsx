"use client";

import styled from "styled-components";
import { useEffect, useState } from "react";
import FederationView from "@/components/federations/FederationView";
import LoadingView from "@/components/common/LoadingView";
import ErrorView from "@/components/common/ErrorView";
import DashboardCard from "@/components/Dashboard/DashboardCard";
import "@/components/common/DashboardCard.css";
import { KeyStorage } from "@/constants/KeyStorage";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Path } from "@/constants/Path";

export default function Home() {
  const [role, setRole] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchServiceRole = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setRole(data.service_role);
      } catch (e: any) {
        setError(e.message || "조회 실패");
      }
      setLoading(false);
    };
    fetchServiceRole();
  }, []);

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    if (error.includes("로그인")) {
      toast.error(error);
      router.push(Path.LOGIN);
      return null;
    }

    return <ErrorView message={error} />;
  }

  return (
    <Container>
      {role === KeyStorage.PROVIDER ? (
        <div>
          <Title>관리자 대시보드</Title>
          <p className="dashboard-subtitle">
            Overview of the federated learning process
          </p>
          <DashboardCard />
          <FederationView />
        </div>
      ) : (
        <div>
          <Title>참여자 대시보드</Title>
          <p className="dashboard-subtitle">
            Overview of the federated learning process
          </p>
          <DashboardCard />
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  background-color: white;
  height: 100%;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #111827;
  text-align: center;
`;

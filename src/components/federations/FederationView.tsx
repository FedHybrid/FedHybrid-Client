"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingView from "../common/LoadingView";
import ErrorView from "../common/ErrorView";
import FederationCard from "./FederationCard";

export default function FederationView() {
  const [loading, setLoading] = useState(true);
  const [federation, setFederation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFederation = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/federation");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        if (data) {
          setFederation(data);
        } else {
          setFederation(null);
        }
      } catch (e: any) {
        setError(e.message || "조회 실패");
      }
      setLoading(false);
    };
    fetchFederation();
  }, []);

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView message={error} />;
  }

  if (!federation) {
    return (
      <div className="p-6 text-center">
        <div className="mb-4">연합 정보가 없습니다.</div>
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white"
          onClick={() => router.push("/supabase/federation/update")}
        >
          등록/수정하러 가기
        </button>
      </div>
    );
  }

  return (
    <FederationCard
      federation={{
        id: "f001",
        name: federation.name,
        instance_id: federation.instance_id ?? "(없음)",
      }}
    />
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingView from "../common/LoadingView";
import ErrorView from "../common/ErrorView";

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
        if (!res.ok) throw new Error("로그인 필요");
        const data = await res.json();
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
    return <LoadingView/>;
  }

  if (error) {
    return <ErrorView message={error}/>
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
    <div className="max-w-md mx-auto mt-10 p-6 rounded-lg shadow-xl bg-white">
      <div className="text-xl font-bold mb-4">연합 정보</div>
      <div className="mb-2"><strong>Name:</strong> {federation.name}</div>
      <div className="mb-2">
        <strong>Instance ID:</strong> {federation.instance_id ?? "(없음)"}
      </div>
      {/* 필요시 다른 필드도 출력 */}
      <button
        className="mt-6 px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
        onClick={() => router.push("/supabase/federation/update")}
      >
        수정하기
      </button>
    </div>
  );
}

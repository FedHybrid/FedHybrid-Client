"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function FederationUpdate() {
  const [name, setName] = useState("");
  const [instanceId, setInstanceId] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("이름(name)은 필수입니다.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/federation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          instance_id: instanceId.trim() !== "" ? instanceId : null,
        }),
      });
      const result = await res.json();

      if (res.status === 200 || res.status === 201) {
        router.push("/supabase/dashboard");
      } else {
        alert("오류: " + (result?.error || "알 수 없는 오류"));
      }
    } catch (err: any) {
      alert("네트워크 오류: " + (err.message || err));
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-lg shadow-xl bg-white">
      <div className="text-xl font-bold mb-6">연합 정보 등록/수정</div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">이름 (필수)</label>
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Instance ID (선택)</label>
          <input
            type="text"
            value={instanceId}
            onChange={(e) => setInstanceId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="예: 123"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
        >
          {loading ? "처리 중..." : "저장"}
        </button>
      </form>
    </div>
  );
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import '../common/FedForm.css'

export default function FederationUpdateForm() {
  const [name, setName] = useState("");
  const [instanceId, setInstanceId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter()

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
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2 className="auth-title">연합 정보 업데이트</h2>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="이름 (필수)"
          autoComplete="name"
          className="auth-input"
        />
        <input
          value={instanceId}
          onChange={e => setInstanceId(e.target.value)}
          placeholder="Instance Id (선택)"
          autoComplete="instanceId"
          className="auth-input"
        />
        <button type="submit"
        disabled={loading}
        className="auth-button">
        {loading ? "처리 중..." : "저장"}
        </button>
      </form>
    </div>
  )
}
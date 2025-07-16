'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import '../common/FedForm.css'

export default function InstanceForm() {
  const [name, setName] = useState('')
  const [ipAddress, setIpAddress] = useState('')
  const [port, setPort] = useState('')
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const handleCreatingInstance = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true);
    try {
      const res = await fetch("/api/instances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          ipAddress,
          port,
        }),
      });
      const result = await res.json();

      if (res.status === 200 || res.status === 201) {
        alert('인스턴스 생성이 완료되었습니다.')
        router.push("/instance");
      } else {
        alert("오류: " + (result?.error || "알 수 없는 오류"));
      }
    } catch (err: any) {
      alert("네트워크 오류: " + (err.message || err));
    }
    setLoading(false);
  }

  return (
    <div className="auth-container">
      <form onSubmit={handleCreatingInstance} className="auth-form">
        <h2 className="auth-title">인스턴스 생성</h2>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
          autoComplete="name"
          className="auth-input"
        />
        <input
          value={ipAddress}
          onChange={e => setIpAddress(e.target.value)}
          placeholder="IpAddress"
          autoComplete="ipAddress"
          className="auth-input"
        />
        <input
          value={port}
          onChange={e => setPort(e.target.value)}
          type="port"
          placeholder="Port"
          autoComplete="new-port"
          className="auth-input"
        />
        <button type="submit"
        disabled={loading}
        className="auth-button">
        {loading ? "처리 중..." : "생성하기"}
        </button>
      </form>
    </div>
  )
}
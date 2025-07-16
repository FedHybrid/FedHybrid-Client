'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import '../common/FedForm.css'

export default function InstanceForm() {
  const [name, setName] = useState('')
  const [ipAddress, setIpAddress] = useState('')
  const [port, setPort] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleCreatingInstance = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data, error } = await supabase.auth.signUp({
      name,
      ipAddress,
      port,
      options: {
        data: {
          name: name, // 추가 정보 저장
        },
      },
    })

    if (error) {
      alert('인스턴스 생성에 실패했습니다.')
    } else {
      alert('인스턴스 생성이 완료되었습니다.')
      router.push('/instance')
    }
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
        <button type="submit" className="auth-button">생성하기</button>
      </form>
    </div>
  )
}
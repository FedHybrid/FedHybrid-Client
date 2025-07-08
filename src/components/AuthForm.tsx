'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert("로그인에 실패했습니다. 다시 시도해 주세요.");
    } else {
      router.push('/supabase/dashboard')
    }
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="username"
        />
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          autoComplete="current-password"
        />
        <button type="submit">로그인</button>
      </form>
    </div>
  )
}

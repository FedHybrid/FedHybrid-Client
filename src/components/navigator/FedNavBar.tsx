'use client'

import Link from "next/link"
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client';
import { UserDropdown } from "./UserDropDown";

export default function FedNavBar() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser()
      .then(({ data, error }) => {
        if (error) throw error
        setUser(data.user)
      })
      .catch(() => setUser(null))
      
      const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    // 컴포넌트 언마운트 시 cleanup
    return () => {
      listener?.subscription.unsubscribe()
    }
  },
)

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <nav>
      <div className="container">
        <div className="logo-group">
          <Link href="/">
            <h1>
              <span className="logo-f">Fed</span>
              <span className="logo-h">H</span>
              <span className="logo-b">B</span>
            </h1>
          </Link>
        </div>
        <div className="nav-menu">
          <Link href="/about">FedHB 소개</Link>
          <span className="nav-divider">|</span>
          <Link href="/supabase/dashboard">대시보드</Link>
          <span className="nav-divider">|</span>
          <Link href="/instance">인스턴스</Link>
          <span className="nav-divider">|</span>
          {user ? (
                 <UserDropdown user={user} onClick={handleLogout}/>          
              ) : (
                <Link href="/supabase/login">로그인</Link>
              )}
        </div>
      </div>
    </nav>
    )
}
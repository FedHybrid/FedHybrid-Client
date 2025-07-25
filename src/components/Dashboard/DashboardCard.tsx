'use client'

import React, { useEffect, useState } from 'react'
import '../common/DashboardCard.css';

interface DashboardData {
  total_client: number
  accuracy: number
  cost: number
}

const dummyDashboardData: DashboardData = {
  total_client: 50,
  accuracy: 75,
  cost: 103.7
}

export default function DashboardCard() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch('/api/dashboard')
      if (!res.ok) throw new Error('응답 실패')

      const result = await res.json()
      if (result) {
        setData(result)
      } else {
        setData(dummyDashboardData) // 응답 비어 있음 → 더미 사용
      }
    } catch (e) {
      console.error('API 실패, 더미로 대체:', e)
      setData(dummyDashboardData) // 에러 → 더미 사용
    }
  }

  fetchData()
}, [])


  return (
    <div className="dashboard-wrapper">
      <p className="dashboard-subtitle">Overview of the federated learning process</p>

      <div className="card-grid">
        <div className="card">
          <div className="card-title">Total Clients</div>
          <div className="card-value">{data?.total_client ?? '-'}</div>
        </div>
        <div className="card">
          <div className="card-title">Current Round</div>
          <div className="card-value">10</div> {/* 예시로 하드코딩 */}
        </div>
        <div className="card">
          <div className="card-title">Final Accuracy</div>
          <div className="card-value">{data ? `${data.accuracy}%` : '-'}</div>
        </div>
        <div className="card">
          <div className="card-title">Communication Cost</div>
          <div className="card-value">{data ? `${data.cost.toFixed(1)}MB` : '-'}</div>
        </div>
      </div>
    </div>
  )
}

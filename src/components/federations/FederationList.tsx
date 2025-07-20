'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import '../common/FedForm.css'
import './FederationList.css' // ✅ CSS 분리된 파일 불러오기

interface Instance {
  name: string
  ip_address: string
  port: number
}

export default function FederationList() {
  const [instances, setInstances] = useState<Instance[]>([])
  const router = useRouter()

  useEffect(() => {
    const dummyData: Instance[] = [
      { name: 'FedAvg', ip_address: '10101011', port: 505},
      { name: 'FedProx', ip_address: '192.168.0.1', port: 8080},
    ]

    // GET 요청 수행
    const fetchInstances = async () => {
      try {
        const res = await fetch('/api/instances')
        if (!res.ok) throw new Error('API 응답 오류')

        const data: Instance[] = await res.json()

        // 데이터가 있으면 사용, 없으면 더미 사용
        if (data && data.length > 0) {
          setInstances(data)
        } else {
          setInstances(dummyData)
        }
      } catch (error) {
        console.error('API 요청 실패, 더미 데이터로 대체:', error)
        setInstances(dummyData)
      }
    }

    fetchInstances()
  }, [])

  return (
    <div className="instance-container">
      <table className="instance-table">
        <thead>
          <tr>
            <th>name</th>
            <th>IpAddress</th>
            <th>port</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {instances.map((instance, index) => (
            <tr key={index}>
              <td className="instance-name">{instance.name}</td>
              <td className="instance-ip">{instance.ip_address}</td>
              <td className="instance-port">{instance.port}</td>
              <td>
                <div className="instance-actions">
                  <button className="action-button">삭제</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="auth-button" onClick={() => router.push('/instance/create')}>
        추가하기
      </button>
    </div>
  )
}

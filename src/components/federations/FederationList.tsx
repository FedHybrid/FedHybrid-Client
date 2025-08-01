'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import '../common/FedForm.css'
import './FederationList.css'

interface Instance {
  id: number
  name: string
  ip_address: number
  port: number
}

export default function FederationList() {
  const [instances, setInstances] = useState<Instance[]>([])
  const router = useRouter()

  useEffect(() => {
    const dummyData: Instance[] = [
      { id: 1, name: 'FedAvg', ip_address: 10101011, port: 505},
      { id: 2, name: 'FedProx', ip_address: 192.168, port: 8080},
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

const handleDelete = async (id: number) => {
  try {
    const res = await fetch(`/api/instances/${id}`, {
      method: 'DELETE',
    })

    if (!res.ok) throw new Error('삭제 실패')

    // 삭제 성공 시 상태에서 해당 인스턴스 제거
    setInstances(prev => prev.filter((instance) => instance.id !== id))
  } catch (error) {
    console.error('삭제 요청 실패:', error)
    alert('삭제에 실패했습니다.')
  }
}


  return (
    <div className="instance-container">
      <table className="instance-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>IpAddress</th>
            <th>Port</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {instances.map((instance) => (
            <tr key={instance.id}>
              <td className="instance-name">{instance.name}</td>
              <td className="instance-ip">{instance.ip_address}</td>
              <td className="instance-port">{instance.port}</td>
              <td>
                <div className="instance-actions">
                  <button className="action-button" onClick={() => router.push(`/instance/create?id=${instance.id}`)}>수정</button>
                  <button className="action-button blue-hover" onClick={() => handleDelete(instance.id)}>삭제</button>
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

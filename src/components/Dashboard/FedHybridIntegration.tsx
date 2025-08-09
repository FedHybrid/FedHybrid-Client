'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface ServerStatus {
  current_round: number;
  active_rounds: Record<string, any>;
  global_accuracies: number[];
  round_config: {
    min_clients: number;
    max_clients: number;
    target_clients: number;
  };
}

interface FedHybridIntegrationProps {
  className?: string;
}

export default function FedHybridIntegration({ className = '' }: FedHybridIntegrationProps) {
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [trainingStatus, setTrainingStatus] = useState<string>('');
  const [trainingLogs, setTrainingLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(true); // 기본적으로 로그 표시
  const [currentLog, setCurrentLog] = useState<string>('');

  // 서버 상태 확인
  const checkServerStatus = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/fedhybrid?action=status');
      if (!response.ok) {
        throw new Error('서버 상태를 확인할 수 없습니다.');
      }
      
      const data = await response.json();
      setServerStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 파일 업로드 처리
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 파일 형식 검증
      const allowedTypes = ['text/csv', 'application/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      const fileExtension = file.name.toLowerCase().split('.').pop();
      
      if (!allowedTypes.includes(file.type) && !['csv', 'xlsx', 'xls'].includes(fileExtension || '')) {
        setError('CSV 또는 Excel 파일(.xlsx, .xls)만 업로드 가능합니다.');
        event.target.value = '';
        setUploadedFile(null);
        return;
      }

      // 예측 결과 파일 업로드 방지
      if (file.name.includes('diabetic_predictions') || file.name.includes('prediction_results')) {
        setError('예측 결과 파일은 업로드할 수 없습니다. 원본 데이터 파일만 업로드해주세요.');
        event.target.value = '';
        setUploadedFile(null);
        return;
      }
      
      setUploadedFile(file);
      setError(null);
    }
  };

  // 실시간 로그 업데이트 함수
  const updateTrainingLog = (message: string) => {
    setTrainingLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  // 학습 시작
  const startTraining = async () => {
    if (!uploadedFile) {
      setError('파일을 선택해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTrainingLogs([]);
    setShowLogs(true); // 로그를 항상 표시
    setTrainingStatus('모델 다운로드 중...');

    try {
      // 1단계: 모델 다운로드
      updateTrainingLog('📥 서버에서 글로벌 모델 다운로드 중...');
      const modelResponse = await fetch('/api/fedhybrid?action=get_model');
      if (!modelResponse.ok) {
        throw new Error('모델을 다운로드할 수 없습니다.');
      }
      setTrainingStatus('모델 다운로드 완료. 로컬 학습 시작 중...');
      updateTrainingLog('✅ 글로벌 모델 다운로드 완료');

      // 2단계: 로컬 학습 시작
      updateTrainingLog('🚀 FedHybrid-AI 클라이언트로 로컬 학습 시작...');
      updateTrainingLog('📁 파일 업로드 중...');
      const formData = new FormData();
      formData.append('file', uploadedFile);

      updateTrainingLog('⚙️ Python 스크립트 실행 중...');
      const response = await fetch('/api/fedhybrid/local-training', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('로컬 학습을 시작할 수 없습니다.');
      }

      const data = await response.json();
      setTrainingStatus('로컬 학습이 완료되었습니다!');
      
      // 학습 로그 추가
      if (data.output) {
        const logs = data.output.split('\n').filter((log: string) => log.trim());
        setTrainingLogs(prev => [...prev, ...logs]);
        setShowLogs(true);
      }
      
      setTrainingLogs(prev => [...prev, '🎉 로컬 학습 완료! 예측 결과를 다운로드할 수 있습니다.']);
      
      // 서버 상태 다시 확인
      setTimeout(checkServerStatus, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      setTrainingLogs(prev => [...prev, `❌ 오류 발생: ${err instanceof Error ? err.message : '알 수 없는 오류'}`]);
    } finally {
      setIsLoading(false);
    }
  };

  // 예측 결과 다운로드
  const downloadPredictions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/fedhybrid/local-training');
      
      if (!response.ok) {
        throw new Error('예측 결과를 다운로드할 수 없습니다.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'prediction_results.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 모델 다운로드
  const downloadModel = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/fedhybrid?action=get_model');
      
      if (!response.ok) {
        throw new Error('모델을 다운로드할 수 없습니다.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'global_model.pth';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 서버 상태 확인
  useEffect(() => {
    checkServerStatus();
  }, []);

  if (isLoading) {
    return (
      <LoadingWrapper>
        <LoadingContent>
          <Spinner />
          <LoadingMessage>FedHybrid-AI 서버와 통신 중...</LoadingMessage>
        </LoadingContent>
      </LoadingWrapper>
    );
  }

  return (
    <Wrapper className={className}>
      <Card>
        <Title>FedHybrid-AI 연동</Title>
        
        {error && (
          <ErrorWrapper>
            <ErrorTitle>오류 발생</ErrorTitle>
            <ErrorDescription>{error}</ErrorDescription>
          </ErrorWrapper>
        )}
        
        {trainingStatus && (
          <StatusWrapper>
            <StatusTitle>학습 진행 상황</StatusTitle>
            <StatusMessage>{trainingStatus}</StatusMessage>
          </StatusWrapper>
        )}

        {/* 서버 상태 */}
        <Section>
          <SectionTitle>서버 상태</SectionTitle>
          {serverStatus ? (
            <StatusGrid>
              <StatusCard>
                <StatusLabel>현재 라운드</StatusLabel>
                <StatusValue>{serverStatus.current_round}</StatusValue>
              </StatusCard>
              <StatusCard>
                <StatusLabel>활성 라운드</StatusLabel>
                <StatusValue>{Object.keys(serverStatus.active_rounds).length}</StatusValue>
              </StatusCard>
              <StatusCard>
                <StatusLabel>목표 클라이언트</StatusLabel>
                <StatusValue>{serverStatus.round_config?.target_clients || 'N/A'}</StatusValue>
              </StatusCard>
            </StatusGrid>
          ) : (
            <NoDataMessage>서버에 연결할 수 없습니다.</NoDataMessage>
          )}
          
          <Button 
            onClick={checkServerStatus}
            disabled={isLoading}
          >
            상태 새로고침
          </Button>
        </Section>

        {/* 파일 업로드 및 로컬 학습 */}
        <Section>
          <SectionTitle>로컬 학습</SectionTitle>
          <TrainingDescription>
            <p>1. CSV 또는 Excel 파일을 업로드하면 서버에서 모델을 다운로드합니다.</p>
            <p>2. Excel 파일은 자동으로 CSV로 변환됩니다.</p>
            <p>3. 다운로드한 모델로 로컬에서 학습을 진행합니다.</p>
            <p>4. 학습 완료 후 예측 결과를 생성합니다.</p>
            <p><strong>⚠️ 주의: 예측 결과 파일(diabetic_predictions.xlsx, prediction_results.xlsx)은 업로드할 수 없습니다.</strong></p>
          </TrainingDescription>
          <UploadWrapper>
            <FileInput
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
            />
            {uploadedFile && (
              <FileInfo>
                선택된 파일: {uploadedFile.name}
              </FileInfo>
            )}
            <Button 
              onClick={startTraining}
              disabled={!uploadedFile || isLoading}
              fullWidth
            >
              모델 다운로드 & 로컬 학습 시작
            </Button>
          </UploadWrapper>
        </Section>

        {/* 결과 다운로드 */}
        <Section>
          <SectionTitle>결과 다운로드</SectionTitle>
          <DownloadGrid>
            <Button 
              onClick={downloadPredictions}
              disabled={isLoading}
              variant="outline"
            >
              예측 결과 다운로드
            </Button>
            <Button 
              onClick={downloadModel}
              disabled={isLoading}
              variant="outline"
            >
              모델 다운로드
            </Button>
          </DownloadGrid>
        </Section>

        {/* 학습 로그 */}
        {trainingLogs.length > 0 && (
          <Section>
            <SectionTitle>학습 로그</SectionTitle>
            <LogWrapper>
              <LogHeader>
                <LogTitle>실시간 학습 과정</LogTitle>
                <LogToggle onClick={() => setShowLogs(!showLogs)}>
                  {showLogs ? '로그 숨기기' : '로그 보기'}
                </LogToggle>
              </LogHeader>
              {showLogs && (
                <LogContent>
                  {trainingLogs.map((log, index) => (
                    <LogLine key={index}>
                      {log}
                    </LogLine>
                  ))}
                </LogContent>
              )}
            </LogWrapper>
          </Section>
        )}

        {/* 성능 지표 */}
        {serverStatus?.global_accuracies && serverStatus.global_accuracies.length > 0 && (
          <Section>
            <SectionTitle>학습 성능</SectionTitle>
            <PerformanceWrapper>
              <PerformanceLabel>최근 정확도</PerformanceLabel>
              <PerformanceList>
                {serverStatus.global_accuracies.slice(-5).map((accuracy, index) => (
                  <PerformanceItem key={index}>
                    <PerformanceRound>
                      라운드 {serverStatus.global_accuracies.length - 4 + index}
                    </PerformanceRound>
                    <PerformanceValue>
                      {(accuracy * 100).toFixed(2)}%
                    </PerformanceValue>
                  </PerformanceItem>
                ))}
              </PerformanceList>
            </PerformanceWrapper>
          </Section>
        )}
      </Card>
    </Wrapper>
  );
}

// Styled Components
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
`;

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatusCard = styled.div`
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
`;

const StatusLabel = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

const StatusValue = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
`;

const Button = styled.button<{ variant?: string; fullWidth?: boolean }>`
  background-color: ${props => props.variant === 'outline' ? 'transparent' : '#2563eb'};
  color: ${props => props.variant === 'outline' ? '#2563eb' : 'white'};
  border: 2px solid #2563eb;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  width: ${props => props.fullWidth ? '100%' : 'auto'};

  &:hover:not(:disabled) {
    background-color: ${props => props.variant === 'outline' ? '#2563eb' : '#1d4ed8'};
    color: ${props => props.variant === 'outline' ? 'white' : 'white'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const UploadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FileInput = styled.input`
  display: block;
  width: 100%;
  padding: 0.75rem;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  background-color: #f9fafb;
  cursor: pointer;

  &:hover {
    border-color: #2563eb;
    background-color: #eff6ff;
  }
`;

const FileInfo = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

const DownloadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const PerformanceWrapper = styled.div`
  background-color: #f9fafb;
  padding: 1.5rem;
  border-radius: 0.5rem;
`;

const PerformanceLabel = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
`;

const PerformanceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PerformanceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PerformanceRound = styled.span`
  font-size: 0.875rem;
  color: #374151;
`;

const PerformanceValue = styled.span`
  font-weight: 600;
  color: #111827;
`;

const ErrorWrapper = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const ErrorTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #dc2626;
  margin-bottom: 0.5rem;
`;

const ErrorDescription = styled.p`
  color: #7f1d1d;
  font-size: 0.875rem;
`;

const StatusWrapper = styled.div`
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const StatusMessage = styled.p`
  color: #1e40af;
  font-size: 0.875rem;
`;

const StatusTitle = styled.h4`
  color: #1e40af;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const NoDataMessage = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
`;

const LoadingContent = styled.div`
  text-align: center;
`;

const Spinner = styled.div`
  width: 3rem;
  height: 3rem;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingMessage = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
`;

const TrainingDescription = styled.div`
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;

  p {
    margin: 0.25rem 0;
    color: #0369a1;
    font-size: 0.875rem;
  }
`;

const LogWrapper = styled.div`
  background-color: #1f2937;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const LogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #374151;
  border-bottom: 1px solid #4b5563;
`;

const LogTitle = styled.h4`
  color: #f9fafb;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
`;

const LogToggle = styled.button`
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }
`;

const LogContent = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem;
`;

const LogLine = styled.div`
  color: #d1d5db;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 0.25rem;
  word-break: break-all;
`;

# FedHybrid-Client

FedHybrid 클라이언트 애플리케이션입니다.

## FedHybrid-AI 연동 설정

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# FedHybrid-AI 서버 설정
FEDHYBRID_SERVER_URL=http://localhost:8000

# Supabase 설정 (기존 설정이 있다면 유지)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. FedHybrid-AI 서버 실행

FedHybrid-AI 디렉토리에서 서버를 실행하세요:

```bash
cd ../FedHybrid-AI
python FedHBServer.py
```

서버는 `http://localhost:8000`에서 실행됩니다.

### 3. 연동 기능

- **서버 상태 확인**: FedHybrid-AI 서버의 현재 상태와 학습 진행 상황을 확인할 수 있습니다.
- **데이터 업로드**: CSV 또는 Excel 파일을 업로드하여 학습을 시작할 수 있습니다.
- **예측 결과 다운로드**: 학습 완료 후 예측 결과를 Excel 파일로 다운로드할 수 있습니다.
- **모델 다운로드**: 학습된 모델을 다운로드할 수 있습니다.

## 설치 및 실행

```bash
npm install
npm run dev
```

애플리케이션은 `http://localhost:3000`에서 실행됩니다.

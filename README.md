# 🌿 우리 반 식물 키우기 사이트

학생들이 이름/사진/글로 식물 관찰 일기를 올리고, 서로 댓글과 공감을 남길 수 있는
학급용 웹사이트입니다. (로그인 없이 이름만 입력하고 바로 사용)

우리 반 식물은 두 개예요: 🌿 **바줘**(바질, 초록 화분) / 🍅 **로베르토**(방울토마토, 빨간 화분).
학생은 글을 쓸 때 둘 중 하나를 선택해서 이야기를 남기고, 댓글·공감도 식물별로 따로 쌓여요.

- **🌱 오늘의 이야기** (`/`): 식물 탭(바줘/로베르토) + 날짜(◀ ▶/달력)로 그날 그 식물에
  달린 글만 모아 보여줘요. 각 글에는 👍❤️🌱👏😍 중 원하는 이모티콘으로 공감할 수 있어요.
- **🌻 성장 현황** (`/growth`): 두 식물이 각자의 카드로 나란히 나와요.
  - **화분 몸(잎 개수·꽃/열매, 0~5단계)** 은 관리자가 직접 올려줘요
  - **화분 표정**은 그 식물에 올라온 **이야기(글) 수**에 따라 자동으로 바뀌어요
    (0개 무표정 → 1~3개 미소 → 4~10개 밝은 미소 → 11개 이상 활짝 웃음+반짝임)
  - 이야기 하나하나는 캐릭터를 둘러싼 원으로 표시돼요: **댓글 수가 많을수록 원이 커지고**
    (5단계), **공감 수가 많을수록 원이 선명해져요**(5단계, 적으면 흐릿). 원끼리는 서로
    겹치지 않도록 자동으로 자리를 잡아요.
- **🔒 관리자 모드** (`/admin`): 아래 "관리자 모드" 섹션 참고

기술 스택: **Next.js** (프론트엔드) + **Supabase** (데이터베이스·사진 저장) + **Vercel** (배포)

코드는 모두 작성되어 있어요. 아래 순서대로 진행하면 실제로 배포까지 완료됩니다.

---

## 1. Node.js 설치 (아직 없다면)

<https://nodejs.org> 에서 **LTS 버전**을 다운로드해 설치하세요. 설치 후 터미널에서 확인:

```bash
node -v
npm -v
```

## 2. 패키지 설치

이 폴더(`plant-class-site`)에서:

```bash
npm install
```

## 3. Supabase 프로젝트 만들기

1. <https://supabase.com> 에서 로그인 후 **New Project** 생성
2. 왼쪽 메뉴 **SQL Editor** 클릭 → **New query**
3. 먼저 왼쪽 메뉴 **Storage** → **New bucket** → 이름 `plant-photos`, **Public bucket** 체크 → 생성
4. 다시 SQL Editor로 돌아와서 [`supabase/schema.sql`](supabase/schema.sql) 파일 내용을 전체 복사해 붙여넣고 **Run** 클릭
   (테이블 3개 + 보안 정책 + 사진 업로드 권한이 한 번에 설정돼요)
   - 이어서 [`supabase/migration_2_growth.sql`](supabase/migration_2_growth.sql) 도 **새 쿼리**로 열어서 실행해주세요
     (성장 현황 페이지에 필요한 테이블이에요)
   - 이어서 [`supabase/migration_3_plants.sql`](supabase/migration_3_plants.sql) 도 **새 쿼리**로 실행해주세요
     (식물 2개 구분에 필요해요)
   - 마지막으로 [`supabase/migration_4_reactions.sql`](supabase/migration_4_reactions.sql) 도 **새 쿼리**로 실행해주세요
     (이모티콘 공감 기능에 필요해요)
5. 왼쪽 메뉴 **Project Settings > API** 에서 아래 두 값을 복사해두기
   - `Project URL`
   - `anon public` key

## 4. 환경변수 설정

이 폴더의 `.env.local.example` 파일을 복사해서 `.env.local` 이라는 이름으로 저장하고,
3번에서 복사한 값을 붙여넣으세요.

```
NEXT_PUBLIC_SUPABASE_URL=여기에_Project_URL_붙여넣기
NEXT_PUBLIC_SUPABASE_ANON_KEY=여기에_anon_public_key_붙여넣기
```

## 5. 로컬에서 확인

```bash
npm run dev
```

브라우저에서 <http://localhost:3000> 접속 → 글쓰기/사진업로드/댓글/응원 기능이 잘 되는지 확인.

## 6. GitHub에 올리기

GitHub에서 새 저장소를 만든 뒤 (예: `plant-class-site`, Public 또는 Private 선택):

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/본인아이디/plant-class-site.git
git push -u origin main
```

> `.env.local` 파일은 `.gitignore`에 포함되어 있어 자동으로 GitHub에 올라가지 않아요. (안전!)

## 7. Vercel로 배포

1. <https://vercel.com> 에서 GitHub 계정으로 로그인
2. **Add New... > Project** → 방금 만든 `plant-class-site` 저장소 선택 → Import
3. **Environment Variables**에 4번과 똑같이 두 값 입력
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Deploy** 클릭 → 몇 분 뒤 `https://plant-class-site-xxxx.vercel.app` 주소 생성
5. 이후로는 `git push` 할 때마다 Vercel이 자동으로 다시 배포해줘요

## 참고: 운영 관리

- 학생에게는 실명 대신 별명 사용을 권장하세요
- 무료 요금제로도 학급 규모(수십 명)는 충분히 사용 가능해요

## 관리자 모드 (`/admin`)

Supabase 대시보드에 매번 들어가지 않고, 사이트 안에서 바로 글/댓글을 삭제할 수 있는
비밀번호 보호 페이지예요. 학생용 홈페이지에는 링크를 걸어두지 않았으니 주소를 아는
선생님만 `사이트주소/admin`으로 직접 접속하면 됩니다.

### 추가 환경변수 설정 필요

`.env.local`에 두 가지를 더 추가해야 작동해요:

```
ADMIN_PASSWORD=원하는_관리자_비밀번호
SUPABASE_SERVICE_ROLE_KEY=Supabase의_secret_key_값
```

- `ADMIN_PASSWORD`: 직접 정하는 비밀번호 (학생들에게 알려주지 않기)
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase 대시보드 > Project Settings > API 페이지에서
  **secret key** (예전 이름: `service_role`) 값을 복사. **`anon`/`publishable` 키와
  달리 이 키는 절대 외부에 노출되면 안 돼요** — `NEXT_PUBLIC_` 접두사가 없어서
  브라우저로는 전송되지 않고 서버(API Route)에서만 사용됩니다.

Vercel에 배포된 사이트에서도 작동하게 하려면, Vercel 프로젝트 **Settings > Environment
Variables**에도 위 두 값을 똑같이 추가해주세요.

### 사용법

1. `사이트주소/admin` 접속
2. 관리자 비밀번호 입력
3. 전체 글 목록이 보이고, 각 글/댓글 옆 **삭제** 버튼으로 바로 제거 가능
   (글을 삭제하면 그 글에 달린 댓글·응원도 함께 삭제돼요)

# 🌿 우리 반 식물 키우기 사이트

학생들이 이름/사진/글로 식물 관찰 일기를 올리고, 서로 댓글과 응원(좋아요)을 남길 수 있는
학급용 웹사이트입니다. (로그인 없이 이름만 입력하고 바로 사용)

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

- 부적절한 글/댓글은 Supabase 대시보드 > Table Editor 에서 직접 행을 삭제하면 돼요
  (일반 학생 계정에는 삭제 권한을 열어두지 않았어요)
- 학생에게는 실명 대신 별명 사용을 권장하세요
- 무료 요금제로도 학급 규모(수십 명)는 충분히 사용 가능해요

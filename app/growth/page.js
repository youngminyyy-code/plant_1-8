"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { PLANTS, fiveTier } from "../../lib/plants";
import TopNav from "../../components/TopNav";
import PlantCharacter from "../../components/PlantCharacter";

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// 5단계: 댓글 수 -> 원 지름(%), 공감 수 -> 투명도
const SIZE_PCT = [9, 12, 15, 19, 24];
const FONT_PX = [8, 8.5, 9.5, 10.5, 11.5];
const OPACITY = [0.32, 0.5, 0.66, 0.83, 1];

const CENTER_EXCLUSION = 24; // 캐릭터가 차지하는 반지름(%)
const MARGIN = 1.5;

// 날짜가 지날수록 옅어지는 정도: 하루 지날 때마다 15%씩 흐려지고,
// 아무리 오래돼도 최소한의 흐릿한 흔적은 남겨둬요.
const DAY_DECAY = 0.85;
const MIN_AGE_FACTOR = 0.18;
const MIN_OPACITY = 0.15;

function ageFactorFor(createdAt) {
  const ageDays = Math.max(0, (Date.now() - new Date(createdAt).getTime()) / 86400000);
  return Math.max(MIN_AGE_FACTOR, Math.pow(DAY_DECAY, ageDays));
}

const GOLDEN_ANGLE = 2.399963229728653; // 씨앗 배열(피보나치 나선)에 쓰이는 각도

// 이야기(글) 하나하나를 원으로 표현해요.
// 1) 황금각 나선으로 초기 위치를 고르게 흩뿌리고
// 2) 겹치는 원들은 서로 밀어내는 완화(relaxation) 과정을 여러 번 반복해서
//    빽빽할 때도 최대한 겹치지 않게 만들어요.
function buildLayout(posts) {
  if (!posts.length) return [];

  const items = posts.map((p) => {
    const commentCount = p.comments?.[0]?.count ?? 0;
    const reactionCount = p.likes?.[0]?.count ?? 0;
    const sizeTier = fiveTier(commentCount);
    const opacityTier = fiveTier(reactionCount);
    const ageFactor = ageFactorFor(p.created_at);
    const finalOpacity = Math.max(MIN_OPACITY, OPACITY[opacityTier] * ageFactor);
    const grayscalePct = Math.min(75, Math.round((1 - ageFactor) * 90));

    return {
      id: p.id,
      student_name: p.student_name,
      photo_url: p.photo_url,
      snippet: p.content?.slice(0, 16) ?? "",
      created_at: p.created_at,
      commentCount,
      reactionCount,
      sizeTier,
      opacityTier,
      diameterPct: SIZE_PCT[sizeTier],
      finalOpacity,
      grayscalePct,
    };
  });

  // 큰 원부터 안쪽에 배치해야 전체적으로 더 안정적으로 자리 잡아요
  const order = [...items].sort(
    (a, b) => b.diameterPct - a.diameterPct || hashCode(a.id) - hashCode(b.id)
  );

  const placed = order.map((item, idx) => {
    const r = item.diameterPct / 2;
    const angle = idx * GOLDEN_ANGLE;
    const radius = CENTER_EXCLUSION + 6 + Math.sqrt(idx) * 9;
    return {
      ...item,
      r,
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle),
    };
  });

  const clampToBounds = (p) => {
    p.x = Math.min(100 - MARGIN - p.r, Math.max(MARGIN + p.r, p.x));
    p.y = Math.min(100 - MARGIN - p.r, Math.max(MARGIN + p.r, p.y));
  };

  placed.forEach(clampToBounds);

  for (let iter = 0; iter < 1200; iter++) {
    let moved = false;

    // 원끼리 겹치면 서로 반대 방향으로 살짝 밀어내요
    for (let i = 0; i < placed.length; i++) {
      for (let j = i + 1; j < placed.length; j++) {
        const a = placed[i];
        const b = placed[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        let dist = Math.hypot(dx, dy);
        const minDist = a.r + b.r + 1;

        if (dist < minDist) {
          moved = true;
          if (dist < 0.01) dist = 0.01;
          const push = (minDist - dist) / 2;
          const ux = dx / dist;
          const uy = dy / dist;
          a.x -= ux * push;
          a.y -= uy * push;
          b.x += ux * push;
          b.y += uy * push;
        }
      }
    }

    // 캐릭터 영역을 침범하면 바깥으로 밀어내요
    placed.forEach((p) => {
      const dx = p.x - 50;
      const dy = p.y - 50;
      const dist = Math.hypot(dx, dy) || 0.01;
      const minDist = CENTER_EXCLUSION + p.r;
      if (dist < minDist) {
        moved = true;
        p.x = 50 + (dx / dist) * minDist;
        p.y = 50 + (dy / dist) * minDist;
      }
    });

    // 카드 가장자리를 넘어가면 안쪽으로 살짝 밀어내요 (클램핑 대신 힘으로 처리해야
    // 다른 원과의 반발력과 서로 안 부딪혀요)
    placed.forEach((p) => {
      if (p.x - p.r < MARGIN) {
        p.x += MARGIN - (p.x - p.r);
        moved = true;
      }
      if (p.x + p.r > 100 - MARGIN) {
        p.x -= p.x + p.r - (100 - MARGIN);
        moved = true;
      }
      if (p.y - p.r < MARGIN) {
        p.y += MARGIN - (p.y - p.r);
        moved = true;
      }
      if (p.y + p.r > 100 - MARGIN) {
        p.y -= p.y + p.r - (100 - MARGIN);
        moved = true;
      }
    });

    if (!moved) break;
  }

  placed.forEach(clampToBounds);

  return placed;
}

function PlantSection({ plant }) {
  const [stage, setStage] = useState(0);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchAll() {
    setLoading(true);

    const [growthRes, postsRes] = await Promise.all([
      supabase.from("plant_growth").select("stage").eq("id", plant.id).maybeSingle(),
      supabase
        .from("posts")
        .select(
          "id, student_name, content, photo_url, created_at, comments(count), likes(count)"
        )
        .eq("plant_id", plant.id)
        .order("created_at", { ascending: false }),
    ]);

    setStage(growthRes.data?.stage ?? 0);
    setPosts(postsRes.data ?? []);
    setLoading(false);
  }

  const bubbles = useMemo(() => buildLayout(posts), [posts]);

  const totalComments = posts.reduce((sum, p) => sum + (p.comments?.[0]?.count ?? 0), 0);
  const totalReactions = posts.reduce((sum, p) => sum + (p.likes?.[0]?.count ?? 0), 0);

  return (
    <section className="plant-section">
      <h2 className="plant-section-title">
        {plant.emoji} {plant.name} <span className="plant-species">· {plant.species}</span>
      </h2>

      <div className="growth-stats">
        <div className="growth-stat">
          <div className="num">{posts.length}</div>
          <div className="label">이야기</div>
        </div>
        <div className="growth-stat">
          <div className="num">{totalComments}</div>
          <div className="label">댓글</div>
        </div>
        <div className="growth-stat">
          <div className="num">{totalReactions}</div>
          <div className="label">공감</div>
        </div>
      </div>

      <div className="growth-stage-card">
        {bubbles.map((b) => (
          <div
            key={b.id}
            className="cloud-bubble"
            style={{
              width: `${b.diameterPct}%`,
              height: `${b.diameterPct}%`,
              left: `${b.x}%`,
              top: `${b.y}%`,
              fontSize: FONT_PX[b.sizeTier],
              opacity: b.finalOpacity,
              filter: b.grayscalePct > 0 ? `grayscale(${b.grayscalePct}%)` : undefined,
              zIndex: b.sizeTier * 10 + b.opacityTier + 1,
            }}
            title={`${b.student_name} · ${new Date(b.created_at).toLocaleDateString(
              "ko-KR"
            )} · 댓글 ${b.commentCount} · 공감 ${b.reactionCount}`}
          >
            {b.photo_url ? <img src={b.photo_url} alt="" /> : <span>{b.snippet}</span>}
          </div>
        ))}

        <div style={{ position: "relative", zIndex: 0 }}>
          <PlantCharacter species={plant.id} stage={stage} storyCount={posts.length} size={140} />
        </div>
      </div>

      <p className="growth-legend">
        💬 댓글이 많을수록 원이 커지고, 🙌 공감이 많을수록 선명해져요. 시간이 지난 이야기는
        점점 흐려져요.
      </p>

      {loading && <p>불러오는 중...</p>}
      {!loading && posts.length === 0 && (
        <p style={{ textAlign: "center" }}>아직 {plant.name}에게 남긴 이야기가 없어요!</p>
      )}
    </section>
  );
}

export default function GrowthPage() {
  return (
    <>
      <TopNav />
      <main className="container">
        <h1>🌻 성장 현황</h1>
        <p className="subtitle">이야기가 쌓일수록 표정이 밝아지고, 반응이 많을수록 눈에 띄어요!</p>

        {PLANTS.map((plant) => (
          <PlantSection key={plant.id} plant={plant} />
        ))}
      </main>
    </>
  );
}

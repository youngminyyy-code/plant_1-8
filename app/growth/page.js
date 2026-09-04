"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import TopNav from "../../components/TopNav";
import PlantCharacter from "../../components/PlantCharacter";

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// 인기도(응원+댓글)에 따라 캐릭터를 감싸는 원형 구름 배치를 계산해요.
function buildBubbles(posts) {
  if (!posts.length) return [];

  const withWeight = posts.map((p) => {
    const likes = p.likes?.[0]?.count ?? 0;
    const comments = p.comments?.[0]?.count ?? 0;
    const weight = likes + comments * 1.5;
    return { ...p, likes, comments, weight };
  });

  const sorted = [...withWeight].sort((a, b) => b.weight - a.weight);
  const n = sorted.length;
  const ringSize = Math.ceil(n / 3);

  const rings = [
    { radius: 30, items: sorted.slice(0, ringSize), offset: 0 },
    { radius: 40, items: sorted.slice(ringSize, ringSize * 2), offset: 25 },
    { radius: 48, items: sorted.slice(ringSize * 2), offset: 50 },
  ];

  const bubbles = [];

  rings.forEach((ring) => {
    const count = ring.items.length;
    if (!count) return;

    ring.items.forEach((post, i) => {
      const hash = hashCode(post.id);
      const jitter = (hash % 20) - 10;
      const angle = (360 / count) * i + ring.offset + jitter;
      const rad = (angle * Math.PI) / 180;

      const left = `${50 + ring.radius * Math.cos(rad)}%`;
      const top = `${50 + ring.radius * Math.sin(rad)}%`;

      const cappedWeight = Math.min(post.weight, 10);
      const size = 54 + cappedWeight * 8;

      bubbles.push({
        id: post.id,
        student_name: post.student_name,
        photo_url: post.photo_url,
        snippet: post.content?.slice(0, 14) ?? "",
        likes: post.likes,
        comments: post.comments,
        weight: post.weight,
        size,
        fontSize: Math.max(10, Math.min(15, size / 7)),
        left,
        top,
      });
    });
  });

  return bubbles;
}

export default function GrowthPage() {
  const [stage, setStage] = useState(0);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ posts: 0, comments: 0, likes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);

    const [growthRes, postsRes, postsCountRes, commentsCountRes, likesCountRes] =
      await Promise.all([
        supabase.from("plant_growth").select("stage").eq("id", "main").maybeSingle(),
        supabase
          .from("posts")
          .select(
            "id, student_name, content, photo_url, created_at, comments(count), likes(count)"
          )
          .order("created_at", { ascending: false }),
        supabase.from("posts").select("*", { count: "exact", head: true }),
        supabase.from("comments").select("*", { count: "exact", head: true }),
        supabase.from("likes").select("*", { count: "exact", head: true }),
      ]);

    setStage(growthRes.data?.stage ?? 0);
    setPosts(postsRes.data ?? []);
    setStats({
      posts: postsCountRes.count ?? 0,
      comments: commentsCountRes.count ?? 0,
      likes: likesCountRes.count ?? 0,
    });
    setLoading(false);
  }

  const bubbles = useMemo(() => buildBubbles(posts), [posts]);

  return (
    <>
      <TopNav />
      <main className="container">
        <h1>🌻 성장 현황</h1>
        <p className="subtitle">
          친구들의 응원과 이야기가 모일수록 식물이 자라나고, 반응이 많은 이야기일수록
          더 크고 반짝여요!
        </p>

        <div className="growth-stats">
          <div className="growth-stat">
            <div className="num">{stats.posts}</div>
            <div className="label">올라온 이야기</div>
          </div>
          <div className="growth-stat">
            <div className="num">{stats.comments}</div>
            <div className="label">댓글</div>
          </div>
          <div className="growth-stat">
            <div className="num">{stats.likes}</div>
            <div className="label">응원</div>
          </div>
        </div>

        <div className="growth-stage-card">
          {bubbles.map((b) => (
            <div
              key={b.id}
              className="cloud-bubble"
              style={{
                width: b.size,
                height: b.size,
                fontSize: b.fontSize,
                left: b.left,
                top: b.top,
                boxShadow: `0 0 ${Math.min(b.weight * 3, 26)}px rgba(255,196,74,${Math.min(
                  0.2 + b.weight * 0.05,
                  0.75
                )})`,
                zIndex: Math.round(b.weight * 10) + 1,
              }}
              title={`${b.student_name} · 응원 ${b.likes} · 댓글 ${b.comments}`}
            >
              {b.photo_url ? (
                <img src={b.photo_url} alt="" />
              ) : (
                <span>{b.snippet}</span>
              )}
            </div>
          ))}

          <div style={{ position: "relative", zIndex: 0 }}>
            <PlantCharacter stage={stage} size={150} />
          </div>
        </div>

        {loading && <p>불러오는 중...</p>}
        {!loading && posts.length === 0 && (
          <p style={{ textAlign: "center" }}>
            아직 이야기가 없어요. 오늘의 이야기 탭에서 첫 글을 남겨보세요!
          </p>
        )}
      </main>
    </>
  );
}

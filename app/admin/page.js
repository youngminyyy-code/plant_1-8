"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { PLANTS, getPlant } from "../../lib/plants";
import PlantCharacter from "../../components/PlantCharacter";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stages, setStages] = useState({});
  const [stageUpdating, setStageUpdating] = useState(null);

  useEffect(() => {
    if (loggedIn) {
      fetchPosts();
      fetchStages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  async function fetchStages() {
    const { data } = await supabase.from("plant_growth").select("id, stage");
    const map = {};
    (data ?? []).forEach((row) => {
      map[row.id] = row.stage;
    });
    setStages(map);
  }

  async function handleSetStage(plantId, newStage) {
    if (newStage < 0 || newStage > 5 || stageUpdating) return;
    setStageUpdating(plantId);

    const res = await fetch("/api/admin/set-stage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, plantId, stage: newStage }),
    });

    if (res.ok) {
      setStages((prev) => ({ ...prev, [plantId]: newStage }));
    } else {
      alert("성장 단계 변경에 실패했어요.");
    }
    setStageUpdating(null);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");

    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setLoggedIn(true);
    } else {
      setLoginError("비밀번호가 올바르지 않습니다.");
    }
  }

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*, comments(*)")
      .order("created_at", { ascending: false });

    if (!error) setPosts(data ?? []);
    setLoading(false);
  }

  async function handleDeletePost(id) {
    if (!window.confirm("이 글과 댓글을 모두 삭제할까요? 되돌릴 수 없어요.")) return;

    const res = await fetch("/api/admin/delete-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, id }),
    });

    if (res.ok) {
      fetchPosts();
    } else {
      alert("삭제에 실패했어요. 비밀번호를 다시 확인해주세요.");
    }
  }

  async function handleDeleteComment(id) {
    if (!window.confirm("이 댓글을 삭제할까요?")) return;

    const res = await fetch("/api/admin/delete-comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, id }),
    });

    if (res.ok) {
      fetchPosts();
    } else {
      alert("삭제에 실패했어요. 비밀번호를 다시 확인해주세요.");
    }
  }

  if (!loggedIn) {
    return (
      <main className="container">
        <h1>🔒 관리자 모드</h1>
        <form className="post-form" onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="관리자 비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {loginError && <p className="error">{loginError}</p>}
          <button type="submit">입장</button>
        </form>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>🔒 관리자 모드</h1>
      <p className="subtitle">부적절한 글이나 댓글을 삭제할 수 있어요.</p>

      <div className="post-form">
        <h2>🌻 식물 성장 단계 조절</h2>
        <div className="admin-plant-grid">
          {PLANTS.map((plant) => {
            const plantPosts = posts.filter((p) => p.plant_id === plant.id);
            const stage = stages[plant.id] ?? 0;

            return (
              <div key={plant.id} className="admin-plant-card">
                <strong>
                  {plant.emoji} {plant.name}
                </strong>
                <PlantCharacter
                  species={plant.id}
                  stage={stage}
                  storyCount={plantPosts.length}
                  size={110}
                />
                <div className="stage-control">
                  <button
                    onClick={() => handleSetStage(plant.id, stage - 1)}
                    disabled={stage <= 0 || stageUpdating === plant.id}
                  >
                    ◀
                  </button>
                  <span style={{ fontWeight: 700 }}>{stage} / 5</span>
                  <button
                    onClick={() => handleSetStage(plant.id, stage + 1)}
                    disabled={stage >= 5 || stageUpdating === plant.id}
                  >
                    ▶
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {loading ? (
        <p>불러오는 중...</p>
      ) : posts.length === 0 ? (
        <p>등록된 글이 없어요.</p>
      ) : (
        posts.map((post) => (
          <div className="post-card" key={post.id}>
            <div className="post-header">
              <strong>
                {getPlant(post.plant_id).emoji} {post.student_name}
              </strong>
              <span className="post-date">
                {new Date(post.created_at).toLocaleString("ko-KR")}
              </span>
            </div>

            {post.photo_url && (
              <img
                src={post.photo_url}
                alt="식물 사진"
                className="post-photo"
              />
            )}

            <p className="post-content">{post.content}</p>

            <button
              className="like-button"
              style={{ background: "#c0392b" }}
              onClick={() => handleDeletePost(post.id)}
            >
              🗑 이 글 삭제
            </button>

            {post.comments?.length > 0 && (
              <ul className="comment-list" style={{ marginTop: 12 }}>
                {post.comments.map((c) => (
                  <li
                    key={c.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span>
                      <strong>{c.student_name}</strong> {c.content}
                    </span>
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#c0392b",
                        cursor: "pointer",
                        fontSize: 12,
                        flexShrink: 0,
                      }}
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </main>
  );
}

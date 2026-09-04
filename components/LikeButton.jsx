"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function LikeButton({ postId }) {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchLikes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchLikes() {
    const { count } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId);
    setCount(count ?? 0);
  }

  async function handleLike() {
    if (liked) return;
    const name = window.prompt("응원 남길 이름(별명)을 입력해주세요");
    if (!name || !name.trim()) return;

    const { error } = await supabase
      .from("likes")
      .insert({ post_id: postId, student_name: name.trim() });

    if (!error) {
      setLiked(true);
      fetchLikes();
    } else if (error.code === "23505") {
      // 같은 이름으로 이미 응원한 경우 (unique 제약)
      setLiked(true);
    }
  }

  return (
    <button className="like-button" onClick={handleLike} disabled={liked}>
      🌟 응원하기 {count}
    </button>
  );
}

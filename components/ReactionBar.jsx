"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { REACTION_EMOJIS } from "../lib/plants";

export default function ReactionBar({ postId }) {
  const [counts, setCounts] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchCounts() {
    const { data } = await supabase.from("likes").select("emoji").eq("post_id", postId);
    const map = {};
    (data ?? []).forEach((row) => {
      map[row.emoji] = (map[row.emoji] ?? 0) + 1;
    });
    setCounts(map);
  }

  async function handleReact(emoji) {
    if (busy) return;
    const name = window.prompt("공감을 남길 이름(별명)을 입력해주세요");
    if (!name || !name.trim()) return;

    setBusy(true);
    const { error } = await supabase
      .from("likes")
      .insert({ post_id: postId, student_name: name.trim(), emoji });

    if (!error) {
      fetchCounts();
    } else if (error.code === "23505") {
      alert("이미 이 이모티콘으로 공감했어요!");
    }
    setBusy(false);
  }

  return (
    <div className="reaction-bar">
      {REACTION_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          className="reaction-pill"
          onClick={() => handleReact(emoji)}
          disabled={busy}
        >
          {emoji} {counts[emoji] ?? 0}
        </button>
      ))}
    </div>
  );
}

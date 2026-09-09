"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { REACTION_EMOJIS } from "../lib/plants";
import { getAnonId } from "../lib/anonId";

export default function ReactionBar({ postId }) {
  const [counts, setCounts] = useState({});
  const [mine, setMine] = useState(new Set());
  const [busyEmoji, setBusyEmoji] = useState(null);

  useEffect(() => {
    fetchReactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchReactions() {
    const anonId = getAnonId();
    const { data } = await supabase
      .from("likes")
      .select("emoji, student_name")
      .eq("post_id", postId);

    const countMap = {};
    const mineSet = new Set();
    (data ?? []).forEach((row) => {
      countMap[row.emoji] = (countMap[row.emoji] ?? 0) + 1;
      if (row.student_name === anonId) mineSet.add(row.emoji);
    });
    setCounts(countMap);
    setMine(mineSet);
  }

  async function handleReact(emoji) {
    if (busyEmoji || mine.has(emoji)) return;
    setBusyEmoji(emoji);

    const anonId = getAnonId();
    const { error } = await supabase
      .from("likes")
      .insert({ post_id: postId, student_name: anonId, emoji });

    if (!error) {
      setCounts((prev) => ({ ...prev, [emoji]: (prev[emoji] ?? 0) + 1 }));
      setMine((prev) => new Set(prev).add(emoji));
    } else if (error.code === "23505") {
      // 이미 반영돼 있던 경우 - 그냥 눌린 상태로 맞춰줌
      setMine((prev) => new Set(prev).add(emoji));
    }
    setBusyEmoji(null);
  }

  return (
    <div className="reaction-bar">
      {REACTION_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          className={`reaction-pill ${mine.has(emoji) ? "active" : ""}`}
          onClick={() => handleReact(emoji)}
          disabled={busyEmoji === emoji}
        >
          {emoji} {counts[emoji] ?? 0}
        </button>
      ))}
    </div>
  );
}

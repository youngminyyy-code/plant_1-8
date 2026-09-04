"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchComments() {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    setComments(data ?? []);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      student_name: name.trim(),
      content: content.trim(),
    });

    if (!error) {
      setName("");
      setContent("");
      fetchComments();
    }
  }

  return (
    <div className="comment-section">
      <ul className="comment-list">
        {comments.map((c) => (
          <li key={c.id}>
            <strong>{c.student_name}</strong> {c.content}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="comment-form">
        <input
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="응원 댓글 남기기"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">등록</button>
      </form>
    </div>
  );
}

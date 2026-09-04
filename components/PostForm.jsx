"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function PostForm({ onPostCreated }) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim() || !content.trim()) {
      setError("이름과 내용을 모두 입력해주세요.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      let photo_url = null;

      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("plant-photos")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("plant-photos")
          .getPublicUrl(fileName);

        photo_url = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("posts").insert({
        student_name: name.trim(),
        content: content.trim(),
        photo_url,
      });

      if (insertError) throw insertError;

      setName("");
      setContent("");
      setFile(null);
      e.target.reset();
      onPostCreated();
    } catch (err) {
      console.error(err);
      setError("업로드 중 문제가 생겼어요. 다시 시도해주세요.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h2>🌱 오늘의 식물 이야기 남기기</h2>
      <input
        type="text"
        placeholder="이름 또는 별명"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="오늘 우리 식물은 어떻게 자랐나요?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={uploading}>
        {uploading ? "올리는 중..." : "올리기"}
      </button>
    </form>
  );
}

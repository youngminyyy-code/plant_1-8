"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setPosts(data);
    setLoading(false);
  }

  return (
    <main className="container">
      <h1>🌿 우리 반 식물 키우기</h1>
      <p className="subtitle">친구들의 식물 이야기를 보고 응원해주세요!</p>

      <PostForm onPostCreated={fetchPosts} />

      {loading ? (
        <p>불러오는 중...</p>
      ) : posts.length === 0 ? (
        <p>아직 올라온 이야기가 없어요. 첫 번째 이야기를 남겨보세요!</p>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </main>
  );
}

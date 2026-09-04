"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { addDays, dayRange, formatDisplayDate, todayString } from "../lib/date";
import { PLANTS } from "../lib/plants";
import TopNav from "../components/TopNav";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";

export default function Home() {
  const [plantId, setPlantId] = useState(PLANTS[0].id);
  const [selectedDate, setSelectedDate] = useState(todayString());
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts(plantId, selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plantId, selectedDate]);

  async function fetchPosts(plant, dateString) {
    setLoading(true);
    const { startISO, endISO } = dayRange(dateString);

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("plant_id", plant)
      .gte("created_at", startISO)
      .lt("created_at", endISO)
      .order("created_at", { ascending: false });

    if (!error) setPosts(data);
    setLoading(false);
  }

  const isToday = selectedDate === todayString();

  return (
    <>
      <TopNav />
      <main className="container">
        <h1>🌿 우리 반 식물 키우기</h1>
        <p className="subtitle">친구들의 식물 이야기를 보고 응원해주세요!</p>

        <div className="plant-tabs">
          {PLANTS.map((p) => (
            <button
              key={p.id}
              className={`plant-tab ${plantId === p.id ? "active" : ""}`}
              onClick={() => setPlantId(p.id)}
            >
              {p.emoji} {p.name}
            </button>
          ))}
        </div>

        <div className="date-nav">
          <button onClick={() => setSelectedDate(addDays(selectedDate, -1))} aria-label="이전 날짜">
            ◀
          </button>
          <span className="date-label">{formatDisplayDate(selectedDate)}</span>
          <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} aria-label="다음 날짜">
            ▶
          </button>
          <input
            type="date"
            value={selectedDate}
            max={todayString()}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          {!isToday && (
            <button className="today-btn" onClick={() => setSelectedDate(todayString())}>
              오늘
            </button>
          )}
        </div>

        {isToday && <PostForm plantId={plantId} onPostCreated={() => fetchPosts(plantId, selectedDate)} />}

        {loading ? (
          <p>불러오는 중...</p>
        ) : posts.length === 0 ? (
          <p>
            {isToday
              ? "아직 올라온 이야기가 없어요. 첫 번째 이야기를 남겨보세요!"
              : "이 날에는 올라온 이야기가 없어요."}
          </p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </main>
    </>
  );
}

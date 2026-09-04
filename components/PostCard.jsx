import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";

export default function PostCard({ post }) {
  return (
    <div className="post-card">
      <div className="post-header">
        <strong>{post.student_name}</strong>
        <span className="post-date">
          {new Date(post.created_at).toLocaleString("ko-KR")}
        </span>
      </div>
      {post.photo_url && (
        <img src={post.photo_url} alt="식물 사진" className="post-photo" />
      )}
      <p className="post-content">{post.content}</p>
      <LikeButton postId={post.id} />
      <CommentSection postId={post.id} />
    </div>
  );
}

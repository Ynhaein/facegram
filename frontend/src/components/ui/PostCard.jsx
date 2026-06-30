import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaRegComment } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const attachments = post.attachments || [];
  const hasMultipleImages = attachments.length > 1;

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
    setCurrentIndex(index);
  };

  const onMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = 'grabbing';
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
  };

  return (
    <div className="bg-bg-secondary border border-slate-500/10 rounded-3xl overflow-hidden mb-8 max-w-xl mx-auto shadow-lg shadow-black/20">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <Link to={`/profile/${post.user.username}`} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-base shrink-0 shadow-sm shadow-primary/30">
            {post.user.username?.charAt(0).toUpperCase()}
          </div>
          <p className="font-semibold text-text-primary text-[15px]">{post.user.username}</p>
        </Link>

        <button className="text-text-muted hover:text-text-primary transition-colors duration-200 cursor-pointer">
          <BsThreeDots size={20} />
        </button>
      </div>

      <div className="relative bg-black select-none">
        {attachments.length > 0 ? (
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none cursor-grab"
          >
            {attachments.map((att, i) => (
              <img
                key={i}
                src={`http://127.0.0.1:8000/storage/${att.file_path}`}
                alt={post.caption || "Post image"}
                className="w-full shrink-0 snap-start aspect-square object-cover pointer-events-none"
                draggable={false}
              />
            ))}
          </div>
        ) : (
          <div className="aspect-square bg-bg-tertiary flex items-center justify-center">
            <p className="text-text-muted text-sm">Tidak ada gambar</p>
          </div>
        )}

        {/* Counter */}
        {hasMultipleImages && (
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
            {currentIndex + 1} / {attachments.length}
          </div>
        )}

        {/* Circle Indicators */}
        {hasMultipleImages && (
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
            {attachments.map((_, i) => (
              <span
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-2.5 h-2.5 bg-white shadow-sm'
                    : 'w-2 h-2 bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-5 pt-4 pb-2 flex items-center gap-6">
        <button
          onClick={() => setLiked(!liked)}
          className="text-2xl transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer"
        >
          {liked ? <FaHeart className="text-red-500 drop-shadow-sm" /> : <FaRegHeart className="text-text-primary" />}
        </button>

        <button className="text-2xl text-text-primary hover:text-text-secondary transition-colors duration-200 cursor-pointer">
          <FaRegComment />
        </button>
      </div>

      {/* Likes */}
      <div className="px-5 pt-1">
        <p className="font-semibold text-text-primary text-sm"> {Math.round(Math.random() * 3000) + 1200} likes</p>
      </div>

      {/* Caption */}
      <div className="px-5 pb-5 pt-1">
        <p className="text-text-primary text-[15px] leading-relaxed">
          <span className="font-semibold mr-2">{post.user.username}</span>
          {post.caption || ""}
        </p>
      </div>
    </div>
  );
};

export default PostCard;

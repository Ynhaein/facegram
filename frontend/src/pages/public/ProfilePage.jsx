import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoGridOutline, IoSearchSharp, IoLockClosed } from "react-icons/io5"; 
import { BiSolidImageAdd } from "react-icons/bi";
import { IoClose, IoTrashOutline } from "react-icons/io5";
import { usePostPopup } from "../../contexts/PostPopupContext";
import "@aejkatappaja/phantom-ui"; 
import Swal from "sweetalert2";
import api from "../../api";

const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isOwnProfile, setOwnProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [privateMsg, setPrivateMsg] = useState("");
  const token = localStorage.getItem('auth_token');
  const currentUser = JSON.parse(localStorage.getItem('user_profile')) || '{}'; 
  const { openPopup } = usePostPopup(); 

  const [selectedPost, setSelectedPost] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const openDetail = (post) => {
    setSelectedPost(post);
    setCurrentIndex(0);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setSelectedPost(null);
    setCurrentIndex(0);
  };

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

  const handleDeletePost = async (postId) => {
    const result = Swal.fire({
      icon: `question`, 
      title: "Yakin ingin menghapus postingan ini?",
      confirmButtonColor: '#6366f1', 
      showConfirmButton: true,
      showCancelButton: true 
    }) 

    if(!result.isConfirmed) {
      return
    }

    try {
      await api.delete(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(prev => prev.filter(p => p.id !== postId));
      closeDetail();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      setIsPrivate(false);
      setPrivateMsg("");
      try {
        let response;
        if (!username || currentUser.username === username) {
          response = await api.get('/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setOwnProfile(true);
        } else {
          response = await api.get(`/profile/${username}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setOwnProfile(false);
        }

        const data = response.data;

        if (!data.success) {
          setIsPrivate(true);
          setPrivateMsg(data.message || "Akun ini private.");
          setProfile(null);
          setPosts([]);
          return;
        }

        setProfile(data.data.targetUser || data.data.user);
        setPosts(data.data.posts || []);
      } catch (err) {
        console.error(`failed to get profile ${err}`);
        if (err.response?.status === 404) {
          setIsPrivate(true);
          setPrivateMsg("Pengguna tidak ditemukan.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) getProfile();
  }, [username, currentUser.username, token]);

  const handleFollow = async (targetUsername) => {
    try {
      await api.post(`/follow/${targetUsername}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.reload();
    } catch (err) {
      console.error(`failed to follow ${err}`);
    }
  };

  const handleUnfollow = async (targetUsername) => {
    try {
      await api.delete(`/unfollow/${targetUsername}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.reload();
    } catch (err) {
      console.error(`failed to unfollow ${err}`);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Skeleton Loading
  if (loading) {
    return (
      <phantom-ui animated="breathe">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
            <div className="w-35 h-35 bg-bg-tertiary rounded-full"></div>
            <div className="flex-1 space-y-4">
              <div className="h-9 w-64 bg-bg-tertiary rounded"></div>
              <div className="flex gap-10">
                <div className="h-5 w-20 bg-bg-tertiary rounded"></div>
                <div className="h-5 w-20 bg-bg-tertiary rounded"></div>
                <div className="h-5 w-20 bg-bg-tertiary rounded"></div>
              </div>
              <div className="h-4 w-80 bg-bg-tertiary rounded"></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square bg-bg-tertiary rounded-2xl"></div>
            ))}
          </div>
        </div>
      </phantom-ui>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10"> 
      {/* Profile Header */}
      <header className="flex flex-col md:flex-row items-center gap-8 md:gap-14 mb-12">
        {/* Avatar */}
        <div className="w-32 h-32 md:w-36 md:h-36 bg-linear-to-br from-primary to-accent rounded-full flex items-center justify-center text-5xl md:text-6xl font-bold text-white shadow-2xl shadow-primary/20 shrink-0">
          {profile?.username?.charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 mb-5">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">{profile?.username}</h1>

            {!isOwnProfile && profile && (
              <button
                onClick={() => profile?.is_following 
                  ? handleUnfollow(profile.username) 
                  : handleFollow(profile.username)}
                className={`px-8 py-2 font-semibold rounded-2xl transition cursor-pointer ${
                  profile?.is_following
                    ? "border border-slate-500/30 text-text-primary hover:bg-bg-tertiary"
                    : "bg-primary hover:bg-primary-hover text-white"
                }`}
              >
                {profile?.is_following ? "Following" : "Follow"}
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="flex justify-center md:justify-start gap-8 md:gap-12 mb-5">
            <div className="text-center md:text-left">
              <span className="font-bold text-text-primary text-lg">{posts.length}</span>
              <span className="text-text-secondary text-sm ml-1.5">posts</span>
            </div>
            {isPrivate ? (
              <>
                <div className="text-center md:text-left">
                  <span className="font-bold text-text-primary text-lg">{profile?.followers_count || 0}</span>
                  <span className="text-text-secondary text-sm ml-1.5">followers</span>
                </div>
                <div className="text-center md:text-left">
                  <span className="font-bold text-text-primary text-lg">{profile?.following_count || 0}</span>
                  <span className="text-text-secondary text-sm ml-1.5">following</span>
                </div>
              </>
            ) : (
              <>
                <Link to={isOwnProfile ? '/followers' : `/followers/${username}`} className="text-center md:text-left">
                  <span className="font-bold text-text-primary text-lg">{profile?.followers_count || 0}</span>
                  <span className="text-text-secondary text-sm ml-1.5">followers</span>
                </Link>
                <Link to={isOwnProfile ? '/following' : `/following/${username}`} className="text-center md:text-left">
                  <span className="font-bold text-text-primary text-lg">{profile?.following_count || 0}</span>
                  <span className="text-text-secondary text-sm ml-1.5">following</span>
                </Link>
              </>
            )}
          </div>

          {/* Name & Bio */}
          <p className="text-text-primary font-semibold">{profile?.name}</p>
          {profile?.bio && (
            <p className="text-text-secondary text-sm mt-1">{profile.bio}</p>
          )}
        </div>
      </header>

      {/* Posts Grid */}
      <div>
        <div className="border-b border-slate-500/10 mb-6">
          <div className="flex justify-center gap-12">
            <div className="flex items-center gap-2 border-b-2 border-white pb-4 -mb-0.5 text-white">
              <IoGridOutline className="text-lg" />
              <span className="text-sm font-semibold tracking-wide">POSTS</span>
            </div>
          </div>
        </div>

        {isPrivate ? (
          <div className="text-center py-20 md:py-28">
            <div className="w-22 h-22 bg-bg-tertiary rounded-full flex items-center justify-center mx-auto mb-6">
              <IoLockClosed className="text-4xl text-text-muted/40" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Akun Private</h3>
            <p className="text-text-muted text-sm max-w-xs mx-auto leading-relaxed">
              {privateMsg || "Ikuti pengguna ini dan tunggu hingga diterima untuk melihat postingan."}
            </p>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => openDetail(post)}
                className="aspect-square bg-bg-tertiary rounded-2xl overflow-hidden border border-slate-500/10 hover:border-primary/40 hover:scale-[1.02] transition-all duration-200 cursor-pointer"
              >
                {post.attachments?.[0] && (
                  <img
                    src={`http://127.0.0.1:8000/storage/${post.attachments[0].file_path}`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        ) : isOwnProfile ? (
          <div className="text-center py-20 md:py-28">
            <div className="w-22 h-22 bg-linear-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/5">
              <BiSolidImageAdd className="text-5xl text-primary/40" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">Belum Ada Postingan</h3>
            <p className="text-text-muted text-sm mb-6 max-w-xs mx-auto leading-relaxed">
              Bagikan momen pertamamu dan mulailah terhubung dengan teman-teman.
            </p>
            <span
              onClick={openPopup}
              className="inline-block text-primary font-semibold text-base hover:text-primary-hover transition cursor-pointer"
            >
              Bagikan foto pertama &rarr;
            </span>
          </div>
        ) : (
          <div className="text-center py-20 md:py-28">
            <div className="w-22 h-22 bg-bg-tertiary rounded-full flex items-center justify-center mx-auto mb-6">
              <IoSearchSharp className="text-5xl text-text-muted/40" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">Belum Ada Postingan</h3>
            <p className="text-text-muted text-sm max-w-xs mx-auto leading-relaxed">
              Pengguna ini belum membagikan postingan apapun.
            </p>
          </div>
        )}
      </div>

      {/* Post Detail Popup */}
      {detailOpen && selectedPost && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeDetail} />

          <div
            className="relative w-full max-w-xl bg-bg-secondary rounded-3xl shadow-2xl shadow-black/50 overflow-hidden animate-[scaleIn_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeDetail}
              className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-xl bg-black/50 text-white hover:bg-black/70 transition cursor-pointer"
            >
              <IoClose className="text-xl" />
            </button>

            <div className="flex flex-col md:flex-row max-h-[80vh]">
              {/* Image */}
              <div className="md:w-3/5 bg-black select-none relative">
                {selectedPost.attachments?.length > 0 ? (
                  <>
                    <div
                      ref={scrollRef}
                      onScroll={handleScroll}
                      onMouseDown={onMouseDown}
                      onMouseMove={onMouseMove}
                      onMouseUp={onMouseUp}
                      onMouseLeave={onMouseUp}
                      className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none cursor-grab"
                    >
                      {selectedPost.attachments.map((att, i) => (
                        <img
                          key={i}
                          src={`http://127.0.0.1:8000/storage/${att.file_path}`}
                          alt=""
                          className="w-full shrink-0 snap-start max-h-[50vh] md:max-h-[80vh] object-contain pointer-events-none"
                          draggable={false}
                        />
                      ))}
                    </div>

                    {selectedPost.attachments.length > 1 && (
                      <>
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
                          {currentIndex + 1} / {selectedPost.attachments.length}
                        </div>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                          {selectedPost.attachments.map((_, i) => (
                            <span
                              key={i}
                              className={`rounded-full transition-all duration-300 ${
                                i === currentIndex
                                  ? "w-2.5 h-2.5 bg-white shadow-sm"
                                  : "w-2 h-2 bg-white/40"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="aspect-square flex items-center justify-center text-text-muted">
                    Tidak ada gambar
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="md:w-2/5 flex flex-col border-t md:border-t-0 md:border-l border-slate-500/10">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-500/10">
                  <div className="w-9 h-9 bg-linear-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {selectedPost.user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-semibold text-text-primary text-sm truncate">
                    {selectedPost.user?.username}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
                  {selectedPost.caption ? (
                    <p className="text-text-primary text-[15px] leading-relaxed whitespace-pre-wrap">
                      <span className="font-semibold mr-2">{selectedPost.user?.username}</span>
                      {selectedPost.caption}
                    </p>
                  ) : (
                    <p className="text-text-muted text-sm italic">Tidak ada caption</p>
                  )}
                </div>

                {isOwnProfile && (
                  <div className="px-5 py-4 border-t border-slate-500/10">
                    <button
                      onClick={() => handleDeletePost(selectedPost.id)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-danger/10 text-danger hover:bg-danger/20 font-medium text-sm transition cursor-pointer"
                    >
                      <IoTrashOutline className="text-base" />
                      Hapus Postingan
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <style>{`
            @keyframes scaleIn {
              from { opacity: 0; transform: scale(0.92) translateY(8px); }
              to   { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

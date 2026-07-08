import { useEffect, useState, useRef } from "react";
import { IoSearchSharp, IoCloseCircle } from "react-icons/io5";
import { Link } from "react-router-dom"; 
import "@aejkatappaja/phantom-ui";
import api from "../../api";
import PostCard from "../../components/ui/PostCard";

const NewsfeedPage = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);  
  const [loadingPosts, setLoadingPosts] = useState(false); 
  const [loadingUsers, setLoadingUsers] = useState(false); 
  const [showResults, setShowResults] = useState(false);
  const [profile, setProfile] = useState([]); 
  const [posts, setPosts] = useState([]); 
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef(null);
  const [followedUsers, setFollowedUsers] = useState({}); 

  const token = localStorage.getItem('auth_token');

  const handleFollow = async (username) => {
    try {
      await api.post(`/follow/${username}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFollowedUsers(prev => ({ ...prev, [username]: true }));
    } catch (err) {
      console.error('Follow error:', err);
    }
  };

  const handleUnfollow = async (username) => {
    try {
      await api.delete(`/unfollow/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFollowedUsers(prev => ({ ...prev, [username]: false }));
    } catch (err) {
      console.error('Unfollow error:', err);
    }
  };

  useEffect(() => {
    const searchUsers = async () => {
      if (!search.trim()) {
        setUsers([]);
        return;
      }

      setLoadingSearch(true);
      try {
        const response = await api.get('/users', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { search: search.trim() }
        });

        setUsers(response.data.data.data || response.data.data);
      } catch (err) {
        console.error("Search error:", err);
        setUsers([]);
      } finally {
        setLoadingSearch(false);
      }
    };

    const timeout = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (!token) return;

    const getProfile = async () => {
      try {
        const response = await api.get('/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    }; 

    const getSuggestedUsers = async () => {
      setLoadingUsers(true)
      try {
        const response = await api.get('/users/suggested', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });  
        setSuggestedUsers(response.data.data);  
      }catch(err) {
        console.error(`erorr ${err}`); 
      }finally {
        setLoadingUsers(false); 
      }
    }

    const getPosts = async (pageNum = 1) => {
      if (pageNum === 1) setLoadingPosts(true);
      else setLoadingMore(true);

      try {
        const response = await api.get('/posts', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { page: pageNum }
        }); 
        const newPosts = response.data.data.data;
        if (pageNum === 1) {
          setPosts(newPosts);
        } else {
          setPosts(prev => [...prev, ...newPosts]);
        }
        setHasMore(response.data.data.current_page < response.data.data.last_page);
        setPage(pageNum);
      }catch(err) {
        console.error(`failed to get posts ${err}`); 
      }finally {
        setLoadingPosts(false);
        setLoadingMore(false);
      }
    }

    getSuggestedUsers(); 
    getPosts(1);  
    getProfile(); 
  }, [token])

  useEffect(() => {
    if (!hasMore || loadingMore || loadingPosts || !token) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        const nextPage = page + 1;
        setLoadingMore(true);
        api.get('/posts', {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: nextPage }
        }).then(res => {
          const newPosts = res.data.data.data;
          setPosts(prev => [...prev, ...newPosts]);
          setHasMore(res.data.data.current_page < res.data.data.last_page);
          setPage(nextPage);
        }).catch(err => {
          console.error(`failed to load more posts ${err}`);
        }).finally(() => {
          setLoadingMore(false);
        });
      }
    }, { threshold: 0.1 });

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loadingPosts, token, page]);

  const clearSearch = () => {
    setSearch("");
    setUsers([]);
    setShowResults(false);
  };

  return (
    <div className="flex flex-col md:flex-row md:gap-5">
      <div className="max-w-2xl md:flex-2">
        {/* Search */}
        <div className="relative mb-10">
          <div className="relative group">
            <IoSearchSharp className="absolute left-5 top-1/2 -translate-y-1/2 text-xl text-text-muted group-focus-within:text-primary transition-colors duration-300 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowResults(true)}
              placeholder="Cari pengguna..."
              className="w-full bg-bg-tertiary text-text-primary placeholder:text-text-muted pl-11 pr-11 py-3.5 rounded-2xl border border-border-default focus:border-primary/40 focus:outline-none focus:bg-bg-tertiary text-sm transition-all duration-200"
            />

            {search && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors duration-200 cursor-pointer"
              >
                <IoCloseCircle className="text-xl" />
              </button>
            )}
          </div>

          {/* Results Dropdown */}
          {showResults && search.trim() && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowResults(false)}
              />

              <div className="absolute mt-3 w-full bg-bg-secondary border border-border-default rounded-2xl overflow-hidden z-50">
                {loadingSearch ? (
                  <div className="flex items-center justify-center gap-3 py-12 text-text-muted">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Mencari...</span>
                  </div>
                ) : users.length > 0 ? (
                  <div className="py-2">
                    {users.map((user) => (
                      <Link
                        key={user.id}
                        to={`/profile/${user.username}`}
                        onClick={() => {
                          setSearch("");
                          setShowResults(false);
                        }}
                        className="flex items-center gap-4 px-5 py-3.5 hover:bg-bg-tertiary/50 transition-colors duration-200"
                      >
                        <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-white font-semibold text-base shrink-0">
                          {user.username?.charAt(0).toUpperCase()}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-text-primary truncate text-sm">
                            {user.username}
                          </p>
                          <p className="text-sm text-text-muted truncate">
                            {user.name || "Pengguna Facegram"}
                          </p>
                        </div>

                        {user.is_following && (
                          <span className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-medium">
                            Teman
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center">
                    <div className="w-14 h-14 bg-bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
                      <IoSearchSharp className="text-2xl text-text-muted" />
                    </div>
                    <p className="text-text-muted text-sm">
                      Tidak ditemukan pengguna{" "}
                      <span className="text-text-primary font-medium">"{search}"</span>
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Empty Feed */}
        <div>
          {!token ? (
            <div className="text-center py-16 md:py-24">
              <div className="w-20 h-20 bg-bg-tertiary rounded-full flex items-center justify-center mx-auto mb-6">
                <IoSearchSharp className="text-4xl text-text-muted" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Belum Memiliki Akun
              </h2>
              <p className="text-text-muted text-sm max-w-sm mx-auto leading-relaxed">
                <Link to="/login" className="text-primary hover:underline font-medium">Login</Link> atau{" "}
                <Link to="/register" className="text-primary hover:underline font-medium">Daftar</Link>{" "}
                untuk mulai terhubung dengan teman-temanmu.
              </p>
            </div>
          ) : profile.following_count === 0 ? (
            <div className="text-center py-16 md:py-24">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <IoSearchSharp className="text-4xl text-primary/50" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Belum Ada Following
              </h2>
              <p className="text-text-muted text-sm max-w-sm mx-auto leading-relaxed">
                Cari pengguna di atas untuk mulai mengikuti dan melihat postingan mereka.
              </p>
            </div>
          ) : (
            loadingPosts ? (
              Array.from({length : 5}).map((_, index) => (
                    <phantom-ui animated="breathe" key={index} class="block">
                  <div className="bg-bg-secondary rounded-3xl overflow-hidden mb-6">
                    <div className="flex items-center justify-between px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-bg-tertiary rounded-xl"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-bg-tertiary rounded"></div>
                          <div className="h-3 w-20 bg-bg-tertiary rounded"></div>
                        </div>
                      </div>
                      <div className="w-6 h-6 bg-bg-tertiary rounded"></div>
                    </div>

                    <div className="bg-bg-tertiary aspect-square w-full"></div>

                    <div className="px-5 py-4 flex gap-6">
                      <div className="w-7 h-7 bg-bg-tertiary rounded-lg"></div>
                      <div className="w-7 h-7 bg-bg-tertiary rounded-lg"></div>
                    </div>

                    <div className="px-5 pb-6 space-y-2">
                      <div className="h-4 w-24 bg-bg-tertiary rounded"></div>
                      <div className="h-4 w-full bg-bg-tertiary rounded"></div>
                      <div className="h-4 w-3/4 bg-bg-tertiary rounded"></div>
                    </div>
                  </div>
                </phantom-ui>
              )) 
            ) : (
              <>
                {posts.map(post => (
                  <PostCard 
                    key={post.id}
                    post={post}
                  />
                ))}
                {loadingMore && (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {hasMore && <div ref={sentinelRef} className="h-4" />}
              </>
            )
          )}
        </div>
      </div>
      
      {/* Suggested User */}
      <div className="hidden md:block md:flex-1"> 
        {token ? (
          loadingUsers ? (
          <div className="space-y-4">
            {Array.from({length: 5}).map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 bg-bg-tertiary rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-24 bg-bg-tertiary rounded"></div>
                  <div className="h-3 w-16 bg-bg-tertiary rounded"></div>
                </div>
              </div>
            ))}
          </div>
          ) : (
          <>
            {/* Profile Card */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-white font-semibold text-base shrink-0">
                  {profile.user?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm text-text-primary">{profile.user?.username}</p>
                  <p className="text-xs text-text-muted">Facegram</p>
                </div>
              </div>
              <Link to={`/profile`} className="text-xs text-primary font-medium shrink-0 hover:underline">
                Lihat Profil
              </Link>
            </div>

            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-text-muted">Suggested untuk kamu</p>
            </div>

            <div className="space-y-4">
              {suggestedUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between">
                  <Link to={`/profile/${user.username}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-semibold text-xs shrink-0">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">{user.username}</p>
                      <p className="text-xs text-text-muted truncate">
                        {user.is_private ? "Akun Private" : "Pengguna Facegram"}
                      </p>
                    </div>
                  </Link>
                  {followedUsers[user.username] ? (
                    <button
                      onClick={() => handleUnfollow(user.username)}
                      className="text-xs text-text-primary font-semibold ml-2 cursor-pointer shrink-0"
                    >
                      Mengikuti
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFollow(user.username)}
                      className="text-xs text-primary font-semibold ml-2 cursor-pointer shrink-0"
                    >
                      Ikuti
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
          )
        ): (
          <div className="border border-dashed border-border-default rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-text-primary mb-1">
              Rekomendasi Pengguna
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              <Link to="/login" className="text-primary hover:underline font-medium">Login</Link> atau{" "}
              <Link to="/register" className="text-primary hover:underline font-medium">Daftar</Link> untuk melihat rekomendasi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsfeedPage;

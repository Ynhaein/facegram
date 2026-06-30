import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa6";
import { IoPeopleOutline } from "react-icons/io5";
import "@aejkatappaja/phantom-ui";
import api from "../../api";
import FollowCard from "../../components/ui/FollowCard";

const FollowingPage = () => {
    const { username, search, isOwnProfile } = useOutletContext();
    const token = localStorage.getItem('auth_token');
    const navigate = useNavigate();

    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [followedUsers, setFollowedUsers] = useState({});

    useEffect(() => {
        let cancelled = false;

        const fetchFollowing = async () => {
            setLoading(true);
            try {
                const endpoint = isOwnProfile ? '/following' : `/following/${username}`;
                const response = await api.get(endpoint, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        search: search || undefined,
                        page: 1
                    }
                });

                if (cancelled) return;

                const data = response.data.data;
                setFollowing(data.data || []);
                setHasMore(data.current_page < data.last_page);
                setPage(1);
            } catch (err) {
                if (!cancelled) console.error("Error fetching following:", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchFollowing();

        return () => { cancelled = true; };
    }, [username, search, isOwnProfile, token]);

    const handleFollow = async (targetUsername) => {
        try {
            await api.post(`/follow/${targetUsername}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFollowedUsers(prev => ({ ...prev, [targetUsername]: true }));
        } catch (err) {
            console.error("Follow error:", err);
        }
    };

    const handleUnfollow = async (targetUsername) => {
        try {
            await api.delete(`/unfollow/${targetUsername}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFollowedUsers(prev => ({ ...prev, [targetUsername]: false }));
        } catch (err) {
            console.error("Unfollow error:", err);
        }
    };

    // Infinite scroll
    useEffect(() => {
        if (!hasMore || loadingMore || loading) return;

        const handleScroll = () => {
            const scrolledToBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 400;
            if (scrolledToBottom && hasMore && !loadingMore) {
                const nextPage = page + 1;
                setLoadingMore(true);

                const endpoint = isOwnProfile ? '/following' : `/following/${username}`;
                api.get(endpoint, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { search: search || undefined, page: nextPage }
                }).then(res => {
                    const data = res.data.data;
                    setFollowing(prev => [...prev, ...(data.data || [])]);
                    setHasMore(data.current_page < data.last_page);
                    setPage(nextPage);
                }).catch(err => {
                    console.error("Error fetching more following:", err);
                }).finally(() => {
                    setLoadingMore(false);
                });
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, loadingMore, loading, page, username, search, isOwnProfile, token]);

    // Loading
    if (loading) {
        return (
            <div>
                {Array.from({ length: 8 }).map((_, i) => (
                    <phantom-ui animated="breathe" key={i} class="block">
                        <div className="flex items-center gap-3 py-3.5 px-1">
                            <div className="w-11 h-11 bg-bg-tertiary rounded-full shrink-0"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-32 bg-bg-tertiary rounded"></div>
                                <div className="h-3 w-20 bg-bg-tertiary rounded"></div>
                            </div>
                            <div className="w-20 h-8 bg-bg-tertiary rounded-2xl shrink-0"></div>
                        </div>
                    </phantom-ui>
                ))}
            </div>
        );
    }

    // Empty
    if (following.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="w-18 h-18 bg-bg-tertiary rounded-full flex items-center justify-center mx-auto mb-5">
                    <IoPeopleOutline className="text-3xl text-text-muted/40" />
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-1.5">
                    Belum Mengikuti Siapa pun
                </h3>
                <p className="text-text-muted text-sm max-w-xs mx-auto leading-relaxed">
                    {isOwnProfile
                        ? "Kamu belum mengikuti siapa pun. Cari pengguna untuk memulai."
                        : "Pengguna ini belum mengikuti siapa pun."}
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="divide-y divide-slate-500/10 -mt-2">
                {following.map((user) => (
                    <FollowCard
                        key={user.id}
                        user={user}
                        isFollowing={followedUsers[user.username] || false}
                        onFollow={handleFollow}
                        onUnfollow={handleUnfollow}
                    />
                ))}
            </div>

            {loadingMore && (
                <div className="flex justify-center py-6">
                    <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {hasMore && !loadingMore && (
                <p className="text-center text-sm text-text-muted py-4">Gulir untuk memuat lebih banyak</p>
            )}
        </div>
    );
};

export default FollowingPage;

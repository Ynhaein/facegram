import { useEffect, useState } from "react"
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom"
import { FaAngleLeft } from "react-icons/fa6";
import { IoSearchSharp, IoCloseCircle, IoLockClosed } from "react-icons/io5";
import clsx from "clsx";
import api from "../api";

const FollowLayout = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('auth_token');
    const currentUser = JSON.parse(localStorage.getItem('user_profile')) || {};

    const [profile, setProfile] = useState(null);
    const [isOwnProfile, setOwnProfile] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isPrivate, setPrivate] = useState(false);
    const [privateMsg, setPrivateMsg] = useState("");
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    const [search, setSearch] = useState('');

    const targetUsername = username || currentUser.username;

    const clearSearch = () => {
        setSearch("");
    };

    useEffect(() => {
        if (!token) return;

        const getProfile = async () => {
            setLoading(true);
            setPrivate(false);
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
                    setPrivate(true);
                    setPrivateMsg(data.message || "Akun ini private.");
                    setProfile(null);
                    return;
                }

                setProfile(data.data.targetUser || data.data.user);
                setFollowersCount(data.data.followers_count || 0);
                setFollowingCount(data.data.following_count || 0);
            } catch (err) {
                console.error("FollowLayout profile error:", err);
                if (err.response?.status === 404) {
                    setPrivate(true);
                    setPrivateMsg("Pengguna tidak ditemukan.");
                }
            } finally {
                setLoading(false);
            }
        };

        getProfile();
    }, [username, currentUser.username, token]);

    const paramSuffix = username ? `/${username}` : '';

    return (
        <div className="w-[90%] max-w-xl mx-auto">
            {/* Header */}
            <header className="flex items-center gap-3 mb-10">
                <button
                    onClick={() => navigate(-1)}
                    className="text-text-primary h-10 w-10 flex items-center cursor-pointer justify-center rounded-xl text-lg hover:bg-bg-tertiary/50 transition"
                >
                    <FaAngleLeft />
                </button>

                {loading ? (
                    <div className="space-y-1.5">
                        <div className="h-5 w-28 bg-bg-tertiary rounded"></div>
                        <div className="h-4 w-36 bg-bg-tertiary rounded"></div>
                    </div>
                ) : isPrivate ? (
                    <div>
                        <h1 className="text-text-primary font-semibold">@{targetUsername}</h1>
                        <p className="text-sm text-text-muted">Akun Private</p>
                    </div>
                ) : (
                    <div>
                        <h1 className="text-text-primary font-semibold">{profile?.username || targetUsername}</h1>
                        <p className="text-sm text-text-muted">
                            {followersCount + followingCount} koneksi
                        </p>
                    </div>
                )}
            </header>

            {/* Search */}
            <div className="mb-5">
                <div className="relative group">
                    <IoSearchSharp className="absolute left-5 top-1/2 -translate-y-1/2 text-xl text-text-muted group-focus-within:text-primary transition-colors duration-300 pointer-events-none" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari pengguna..."
                        className="w-full bg-bg-tertiary text-text-primary placeholder:text-text-muted pl-14 pr-14 py-4 rounded-2xl border border-slate-500/10 focus:border-primary/40 focus:outline-none focus:bg-bg-tertiary/80 text-[15px] transition-all duration-300"
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
            </div>

            {/* Tabs */}
            <div className="flex items-center justify-center border-b border-slate-500/15 mb-6">
                <NavLink to={`/followers${paramSuffix}`} className={({ isActive }) => clsx('transition-all duration-200 py-5 w-full flex items-center justify-center', isActive ? "text-primary border-b border-primary" : "text-text-muted hover:text-text-primary")}>
                    Followers
                </NavLink>
                <NavLink to={`/following${paramSuffix}`} className={({ isActive }) => clsx('transition-all duration-200 py-5 w-full flex items-center justify-center', isActive ? "text-primary border-b border-primary" : "text-text-muted hover:text-text-primary")}>
                    Following
                </NavLink>
            </div>

            {/* Content */}
            {isPrivate ? (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-bg-tertiary rounded-full flex items-center justify-center mx-auto mb-6">
                        <IoLockClosed className="text-4xl text-text-muted/40" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Akun Private</h3>
                    <p className="text-text-muted text-sm max-w-xs mx-auto leading-relaxed">
                        {privateMsg || "Kamu tidak dapat melihat daftar pengikut pengguna ini."}
                    </p>
                </div>
            ) : (
                <Outlet context={{ username: targetUsername, search, isOwnProfile }} />
            )}
        </div>
    )
}

export default FollowLayout

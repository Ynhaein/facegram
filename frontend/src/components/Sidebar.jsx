import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom"
import { LiaCameraSolid } from "react-icons/lia";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { GrHomeRounded } from "react-icons/gr";
import { CgProfile } from "react-icons/cg";
import { BiSolidImageAdd } from "react-icons/bi";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { RiLoginCircleLine } from "react-icons/ri";
import { usePostPopup } from "../contexts/PostPopupContext";
import clsx from "clsx";
import api from "../api";

const Sidebar = () => {
    const [isClosed, setClosed] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_profile');
    const user = userData ? JSON.parse(userData) : null;
    const { openPopup } = usePostPopup();

    const handleLogOut = async () => {
        try {
            await api.post('/logout', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_profile');
            navigate('/login');
            location.reload();
        }
    }

    return (
        <aside className={clsx('bg-bg-primary h-dvh font-primary hidden border-r transition-all duration-300 sticky top-0 left-0 border-border-subtle md:flex md:flex-col', isClosed ? "w-25 items-center" : "w-75")}>
            <header className="flex items-center justify-between p-5">
                <div className={clsx("flex items-center gap-2.5", isClosed ? "hidden" : "block")}>
                    <div className='h-11 w-11 flex items-center justify-center text-2xl rounded-xl bg-primary/10 text-primary'>
                        <LiaCameraSolid />
                    </div>

                    <div>
                        <h1 className='text-primary font-primary font-bold text-2xl -tracking-0.5'>Facegram</h1>
                        <p className='text-text-muted text-sm'>
                            {user ? `${user.username}` : "Belum memiliki akun"}
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setClosed(!isClosed)}
                    className="h-9 w-9 flex items-center justify-center transition-all duration-200 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-tertiary cursor-pointer"
                >
                    {isClosed ? (<FaAngleLeft className="text-sm" />) : (<FaAngleRight className="text-sm" />)}
                </button>
            </header>

            <div className="flex-1 p-5 space-y-2">
                <NavLink
                    to={'/'}
                    className={({isActive}) => clsx('flex items-center px-4 py-3 rounded-2xl duration-200 transition-all',
                    isClosed ? "gap-0 justify-center" : "gap-3.5", isActive ? "bg-primary/10 text-primary font-semibold" : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary")}
                >
                    <span><GrHomeRounded className="text-2xl" /></span>
                    <span className={clsx("text-base", isClosed ? "hidden" : "inline")}>Home</span>
                </NavLink>

                <NavLink
                    to={'/profile'}
                    className={({isActive}) => clsx('flex items-center px-4 py-3 rounded-2xl duration-200 transition-all',
                    isClosed ? "gap-0 justify-center" : "gap-3.5", isActive ? "bg-primary/10 text-primary font-semibold" : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary")}
                >
                    <span><CgProfile className="text-2xl" /></span>
                    <span className={clsx("text-base", isClosed ? "hidden" : "inline")}>Profile</span>
                </NavLink>

                <button
                    onClick={openPopup}
                    type="button"
                    className={clsx('flex items-center w-full cursor-pointer px-4 py-3 text-text-secondary hover:bg-bg-tertiary hover:text-text-primary rounded-2xl duration-200 transition-all',
                    isClosed ? "gap-0 justify-center" : "gap-3.5")}
                >
                    <span><BiSolidImageAdd className="text-2xl" /></span>
                    <span className={clsx("text-base", isClosed ? "hidden" : "inline")}>Create</span>
                </button>
            </div>

            <div className="p-5">
                {token ? (
                    <button
                        onClick={handleLogOut}
                        className={clsx("w-full flex items-center cursor-pointer px-4 py-3 text-text-muted hover:text-text-primary hover:bg-bg-tertiary duration-200 transition-all rounded-2xl", isClosed ? "gap-0 justify-center" : "gap-3.5")}
                    >
                        <RiLogoutCircleRLine className="text-lg" />
                        <span className={clsx("text-base", isClosed ? "hidden" : "inline")}>Log out</span>
                    </button>
                ) : (
                    <Link to={'/login'} className={clsx("w-full flex items-center px-4 py-3 text-text-muted hover:text-text-primary hover:bg-bg-tertiary duration-200 transition-all rounded-2xl", isClosed ? "gap-0 justify-center" : "gap-3.5")}>
                        <RiLoginCircleLine className="text-lg" />
                        <span className={clsx("text-base", isClosed ? "hidden" : "inline")}>Login</span>
                    </Link>
                )}
            </div>
        </aside>

    )
}

export default Sidebar
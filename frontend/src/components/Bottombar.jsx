import { NavLink, Link } from "react-router-dom"
import { GrHomeRounded } from "react-icons/gr";
import { CgProfile } from "react-icons/cg";
import { BiSolidImageAdd } from "react-icons/bi";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { RiLoginCircleLine } from "react-icons/ri";
import clsx from "clsx";

const Bottombar = () => {
    const token = localStorage.getItem('auth_token');

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-bg-primary/80 backdrop-blur-xl border-t border-slate-500/15 md:hidden z-50 safe-area-bottom">
            <div className="flex items-center justify-around py-2 px-4">
                <NavLink
                    to="/"
                    className={({isActive}) => clsx(
                        "flex items-center justify-center h-11 w-11 rounded-xl transition-all duration-200",
                        isActive ? "text-primary bg-primary/15" : "text-text-primary hover:bg-zinc-50/15"
                    )}
                >
                    <GrHomeRounded className="text-xl"/>
                </NavLink>

                <NavLink
                    to="/profile"
                    className={({isActive}) => clsx(
                        "flex items-center justify-center h-11 w-11 rounded-xl transition-all duration-200",
                        isActive ? "text-primary bg-primary/15" : "text-text-primary hover:bg-zinc-50/15"
                    )}
                >
                    <CgProfile className="text-xl"/>
                </NavLink>

                <button className="flex items-center justify-center h-11 w-11 rounded-xl transition-all duration-200 text-text-primary hover:bg-zinc-50/15">
                    <BiSolidImageAdd className="text-2xl"/>
                </button>

                {token ? (
                    <button className="flex items-center justify-center h-11 w-11 rounded-xl transition-all duration-200 text-text-primary hover:bg-zinc-50/15">
                        <RiLogoutCircleRLine className="text-lg"/>
                    </button>
                ) : (
                    <Link
                        to="/login"
                        className="flex items-center justify-center h-11 w-11 rounded-xl transition-all duration-200 text-text-primary hover:bg-zinc-50/15"
                    >
                        <RiLoginCircleLine className="text-lg"/>
                    </Link>
                )}
            </div>
        </nav>
    )
}

export default Bottombar

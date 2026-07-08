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
        <nav className="fixed bottom-0 left-0 right-0 bg-bg-primary/85 backdrop-blur-xl border-t border-border-subtle md:hidden z-50 safe-area-bottom">
            <div className="flex items-center justify-around py-2 px-4">
                <NavLink
                    to="/"
                    className={({isActive}) => clsx(
                        "flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-200",
                        isActive ? "text-primary bg-primary/10" : "text-text-muted hover:text-text-primary hover:bg-bg-tertiary"
                    )}
                >
                    <GrHomeRounded className="text-xl"/>
                </NavLink>

                <NavLink
                    to="/profile"
                    className={({isActive}) => clsx(
                        "flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-200",
                        isActive ? "text-primary bg-primary/10" : "text-text-muted hover:text-text-primary hover:bg-bg-tertiary"
                    )}
                >
                    <CgProfile className="text-xl"/>
                </NavLink>

                <button className="flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-200 text-text-muted hover:text-text-primary hover:bg-bg-tertiary">
                    <BiSolidImageAdd className="text-xl"/>
                </button>

                {token ? (
                    <button className="flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-200 text-text-muted hover:text-text-primary hover:bg-bg-tertiary">
                        <RiLogoutCircleRLine className="text-lg"/>
                    </button>
                ) : (
                    <Link
                        to="/login"
                        className="flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-200 text-text-muted hover:text-text-primary hover:bg-bg-tertiary"
                    >
                        <RiLoginCircleLine className="text-lg"/>
                    </Link>
                )}
            </div>
        </nav>
    )
}

export default Bottombar

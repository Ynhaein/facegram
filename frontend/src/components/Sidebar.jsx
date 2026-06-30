    import { useState } from "react";
    import { Link, NavLink } from "react-router-dom"
    import { LiaCameraSolid } from "react-icons/lia";
    import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
    import { GrHomeRounded } from "react-icons/gr";
    import { CgProfile } from "react-icons/cg";
    import { BiSolidImageAdd } from "react-icons/bi";
    import { RiLogoutCircleRLine } from "react-icons/ri";
    import { RiLoginCircleLine } from "react-icons/ri";
    import { usePostPopup } from "../contexts/PostPopupContext";
    import clsx from "clsx";

    const Sidebar = () => {  
        const [isClosed, setClosed] = useState(false);
        const token = localStorage.getItem('auth_token'); 
        const userData = localStorage.getItem('user_profile');
        const user = userData ? JSON.parse(userData) : null;  
        const { openPopup } = usePostPopup();
        
        return (
            <aside className={clsx('bg-bg-primary h-screen font-primary hidden border-r transition-all duration-200 sticky top-0 left-0 border-slate-500/15 md:flex md:flex-col', isClosed ? "w-25 items-center" : "w-75")}>         
                <header className="flex items-center justify-between p-5">
                    {/* Brand */}
                    <div className={clsx("flex items-center gap-1.5", isClosed ? "hidden" : "block")}>
                        <div className='h-12 w-12 flex items-center justify-center text-2xl cursor-pointer transition-all duration-200 rounded-xl hover:bg-zinc-50/15'>
                            <LiaCameraSolid  className="text-text-primary"/>
                        </div>

                        <div>
                            <h1 className='text-primary font-primary font-bold text-2xl'>Facegram</h1>  
                            <p className='text-text-secondary text-sm'>
                                {user ? `${user.username}` : "belum memiliki akun"}
                            </p>
                        </div>
                    </div> 

                    <button 
                        onClick={() => setClosed(!isClosed)}
                        className="h-10 w-10 flex items-center justify-center transition-all duration-200 rounded-xl text-text-primary cursor-pointer hover:bg-zinc-50/15"
                    >
                        {isClosed ? (<FaAngleLeft />) : (<FaAngleRight />)}
                    </button>
                </header> 

                <div className="p-5 space-y-3.5">
                    <NavLink 
                        to={'/'} 
                        className={({isActive}) => clsx('flex px-5 py-2.5 rounded-2xl duration-200 transition-all', 
                        isClosed ? "gap-0" : "gap-3.5", isActive ? "text-primary hover:bg-primary/15" : "text-text-primary hover:bg-zinc-50/15")}
                    >
                        <span className=""><GrHomeRounded className="text-2xl"/></span>
                        <span className={clsx("font-medium text-lg", isClosed ? "hidden" : "inline")}>Home</span>
                    </NavLink>

                    <NavLink 
                        to={'/profile'} 
                        className={({isActive}) => clsx('flex items-center px-5 py-2.5 rounded-2xl duration-200 transition-all', 
                        isClosed ? "gap-0" : "gap-3.5", isActive ? "text-primary hover:bg-zinc-50/50" : "text-text-primary hover:bg-zinc-50/15")}
                    >
                        <span className=""><CgProfile className="text-2xl"/></span>
                        <span className={clsx("font-medium text-lg", isClosed ? "hidden" : "inline")}>Profile</span>
                    </NavLink> 
                    
                    <button
                        onClick={openPopup}
                        type="button"
                        className={clsx('flex items-center w-full cursor-pointer px-5 py-2.5 text-text-primary hover:bg-zinc-50/15 rounded-2xl duration-200 transition-all', 
                        isClosed ? "gap-0" : "gap-3.5")}
                    >
                        <span><BiSolidImageAdd className="text-3xl"/></span>
                        <span className={clsx("font-medium text-lg", isClosed ? "hidden" : "inline")}>Create</span>
                    </button> 
                </div> 
                
                <div className="absolute left-0 right-0 bottom-0 p-5">
                    {token ? (
                        <button className={clsx("w-full flex items-center cursor-pointer px-5 py-2.5 text-text-primary duration-200 transition-all rounded-2xl hover:bg-zinc-50/15", isClosed ? "gap-0" : "gap-3.5")}>
                            <RiLogoutCircleRLine className="text-xl"/>
                            <span className={clsx("font-medium text-lg", isClosed ? "hidden" : "inline")}>Log out</span>
                        </button>
                    ) : (
                        <Link to={'/login'} className={clsx("w-full flex items-center cursor-pointer px-5 py-2.5 text-text-primary duration-200 transition-all rounded-2xl hover:bg-zinc-50/15", isClosed ? "gap-0" : "gap-3.5")}>
                            <RiLoginCircleLine className="text-xl"/>
                            <span className={clsx("font-medium text-lg", isClosed ? "hidden" : "inline")}>Login</span>
                        </Link>
                    )}
                </div> 
            </aside> 
            
        )
    }

    export default Sidebar
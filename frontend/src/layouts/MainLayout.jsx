import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Bottombar from "../components/Bottombar"
import { PostPopupProvider } from "../contexts/PostPopupContext"
import PostPopup from "../components/ui/PostPopup"

const MainLayout = () => {
  return (
    <PostPopupProvider>
      <div className="bg-bg-secondary min-h-screen md:flex">
          <Sidebar />

          <main className="md:flex-1">
            <section className="w-[90%] mx-auto py-10 pb-24 md:pb-10">
                <Outlet></Outlet>
            </section>
          </main>

          <Bottombar />
      </div>

      <PostPopup />
    </PostPopupProvider>
  )
}

export default MainLayout
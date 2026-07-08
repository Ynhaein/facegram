import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Bottombar from "../components/Bottombar"
import { PostPopupProvider } from "../contexts/PostPopupContext"
import PostPopup from "../components/ui/PostPopup"

const MainLayout = () => {
  return (
    <PostPopupProvider>
      <div className="bg-bg-secondary min-h-dvh md:flex">
          <Sidebar />

          <main className="md:flex-1">
            <section className="w-full max-w-4xl mx-auto px-4 md:px-8 py-8 pb-28 md:pb-12">
                <Outlet />
            </section>
          </main>

          <Bottombar />
      </div>

      <PostPopup />
    </PostPopupProvider>
  )
}

export default MainLayout
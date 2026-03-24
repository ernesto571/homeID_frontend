import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import ListingsPage from "./pages/RenterPages/ListingsPage";
import { Toaster } from "react-hot-toast";
import RenterAuthListener from "./hooks/RenterAuthListener";
import LandlordAuthListener from "./hooks/LandlordAuthListener";
import { useUser } from "@clerk/clerk-react";
import { useRenterAuthStore } from "./store/renter/RenterAuthStore";
import { useLandlordAuthStore } from "./store/landlord/LandlordAuthStore";
import MyProperties from "./pages/LandlordPages/MyProperties";
import PropertyDetailsPage from "./pages/RenterPages/PropertyDetailsPage";
import Enquiries from "./pages/LandlordPages/Enquiries";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

function RenterRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();
  const profile = useRenterAuthStore((s) => s.profile);
  const loading = useRenterAuthStore((s) => s.loading);

  useEffect(() => {
    if (isLoaded && !loading && isSignedIn && profile?.role === "landlord") {
      toast.error("This page is for renters only. Please use a renter account.")
    }
    if (isLoaded && !loading && !isSignedIn) {
      toast.error("Please sign in to access this page.")
    }
  }, [isLoaded, loading, isSignedIn, profile])

  // ✅ Fix — add return
  if (loading){
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="size-10 animate-spin text-[#e86822]" />
      </div>
    );
  }

  if(!isLoaded) return null

  if (!isSignedIn) return <Navigate to="/" replace />;
  if (profile?.role !== "renter") return <Navigate to="/" replace />;
  return <>{children}</>;
}

function LandlordRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();
  const profile = useLandlordAuthStore((s) => s.profile);
  const loading = useLandlordAuthStore((s) => s.loading);

  useEffect(() => {
    if (isLoaded && !loading && isSignedIn && profile?.role === "renter") {
      toast.error("This page is for landlords only. Please use a landlord account.")
    }
    if (isLoaded && !loading && !isSignedIn) {
      toast.error("Please sign in to access this page.")
    }
  }, [isLoaded, loading, isSignedIn, profile])

   // ✅ Fix — add return
   if (loading){
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="size-10 animate-spin text-[#e86822]" />
      </div>
    );
  }

  if(!isLoaded) return null
  
  if (profile?.role !== "landlord") return <Navigate to="/" replace />;
  return <>{children}</>;
}

// ✅ Layout WITH Navbar
function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <>
      <RenterAuthListener />
      <LandlordAuthListener />
      <Routes>

        {/* ✅ These pages have Navbar */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/listings" element={<RenterRoute><ListingsPage /></RenterRoute>} />
          <Route path="/listings/:id" element={<RenterRoute><PropertyDetailsPage /></RenterRoute>} />
        </Route>

        {/* ✅ These pages have NO Navbar */}
        <Route path="/dashboard" element={<LandlordRoute><MyProperties /></LandlordRoute>}></Route>
        <Route path="/dashboard/enquiries" element={<LandlordRoute><Enquiries /></LandlordRoute>}></Route>

      </Routes>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1f2937",
            color: "#fff",
            padding: "16px",
            borderRadius: "10px",
            fontSize: "14px",
          },
          success: {
            style: { background: "#059669" },
            iconTheme: { primary: "#fff", secondary: "#059669" },
          },
          error: {
            style: { background: "#dc2626" },
            iconTheme: { primary: "#fff", secondary: "#dc2626" },
          },
          icon: (
            <img
              src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1773312096/estate-logo_cmlseg.png"
              alt="logo"
              className="w-20 h-10"
            />
          ),
        }}
      />
    </>
  );
}

export default App;
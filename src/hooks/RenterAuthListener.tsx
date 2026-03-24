import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useRenterAuthStore } from "../store/renter/RenterAuthStore";
function RenterAuthListener() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { createRenterProfile, fetchProfile } = useRenterAuthStore();

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded) {
        console.log("⏳ Clerk not loaded yet...");
        return;
      }

      if (!isSignedIn || !user) {
        console.log("❌ User not signed in");
        return;
      }

      // console.log("✅ User signed in:", {
      //   id: user.id,
      //   email: user.primaryEmailAddress?.emailAddress,
      //   firstName: user.firstName,
      //   lastName: user.lastName,
      // });

      try {
        // Create profile in backend (if not exists)
        await createRenterProfile();
        // console.log("✅ Profile created/verified in backend");
        
        // Fetch profile to populate local state
        await fetchProfile();
        // console.log("✅ Profile fetched from backend");
      } catch (error) {
        console.error("❌ Error syncing user:", error);
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, user, createRenterProfile, fetchProfile]);

  return null;
}

export default RenterAuthListener;
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Createtrip from "./create/Createtrip.jsx";
import "./index.css";
import Header from "./components/custom/Header.jsx";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ClerkProvider } from "@clerk/clerk-react";
import Viewtrip from "./view-trip/[tripid]/index.jsx";

// Import your Clerk publishable key
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header />
        <App />
      </>
    ),
  },
  {
    path: "/create-trip",
    element: (
      <>
        <Header />
        <Createtrip />
      </>
    ),
  },
  {
    path: "/view-trip/:tripId",
    element: (
      <>
        <Header />
        <Viewtrip />
      </>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}
      >
        <Toaster richColors position="top-center" />
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </ClerkProvider>
  </StrictMode>
);

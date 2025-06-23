import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import AuthCallbackPage from "./CallbackClient";

export const dynamic = "force-dynamic";

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>
      }
    >
      <AuthCallbackPage />
    </Suspense>
  );
}

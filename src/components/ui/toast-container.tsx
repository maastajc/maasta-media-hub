
import { Toaster } from "@/components/ui/toaster"

export function ToastContainer() {
  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-sm pointer-events-none">
      <Toaster />
    </div>
  )
}

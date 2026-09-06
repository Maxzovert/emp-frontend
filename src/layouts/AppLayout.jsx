import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { AssistantSidebar } from "@/components/chat/AssistantSidebar";
import { AssistantUrlBridge } from "@/components/chat/AssistantUrlBridge";
import { AssistantPanelProvider } from "@/context/AssistantPanelContext";

export function AppLayout() {
  return (
    <AssistantPanelProvider>
      <div className="relative flex h-dvh overflow-hidden bg-background">
        <a
          href="#app-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <Sidebar />
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <Header />
          <main
            id="app-content"
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-5 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:px-4 md:px-6 md:py-6 md:pb-8"
          >
            <Outlet />
          </main>
        </div>
        <AssistantSidebar />
        <MobileNavigation />
        <Suspense fallback={null}>
          <AssistantUrlBridge />
        </Suspense>
      </div>
    </AssistantPanelProvider>
  );
}

import { Container } from "./Container";
import { SideBar } from "./Sidebar";

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex overflow-hidden">
      <SideBar></SideBar>
      <Container className="flex-1 min-h-0 overflow-auto">{children}</Container>
    </div>
  );
}

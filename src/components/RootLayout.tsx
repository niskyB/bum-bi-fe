import { Container } from "./Container";
import { SideBar } from "./Sidebar";

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex">
      <SideBar></SideBar>
      <Container className="flex-1">{children}</Container>
    </div>
  );
}

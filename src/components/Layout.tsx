import Header from "./Header";

const Footer = () => (
  <footer className="border-t bg-gray-100 py-4 text-center text-sm text-gray-600">
    © 2025 Gest Connect
  </footer>
);

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16 md:pt-20">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;

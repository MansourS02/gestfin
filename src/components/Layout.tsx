import Header from "./Header";

const Footer = () => (
  <footer className="border-t bg-gray-100 py-4 text-center text-sm text-gray-600">
    © 2025 Gest Connect
  </footer>
);

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex min-h-screen flex-col pt-16 md:ml-64 md:pt-0">
        <main className="flex-1 pt-0">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;

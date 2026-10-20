import Header from "../components/common/Header";
import Footer  from "../components/common/Footer";
function MainLayout({ children }) {
  return (
    <>
      <Header cartCount={0} />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default MainLayout;
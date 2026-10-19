import Header from "../components/common/Header";

function MainLayout({ children }) {
  return (
    <>
      <Header cartCount={0} />
      <main>{children}</main>
    </>
  );
}

export default MainLayout;
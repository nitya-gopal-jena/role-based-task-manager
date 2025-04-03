import { useLocation } from 'react-router-dom';
import Header from '../header/Header';
import Footer from '../footer/Footer';

const Layout = ({ children }) => {
  const location = useLocation();

  const shouldShowHeaderFooter = location.pathname !== '/register' && location.pathname !== '/';

  return (
    <div>
      {shouldShowHeaderFooter && <Header />}
      {children}
      {shouldShowHeaderFooter && <Footer />}
    </div>
  );
};

export default Layout;

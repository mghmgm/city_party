import { FC, ReactNode, useEffect, useState } from 'react';
import Header from '../../components/UI/Header/Header';
import { useFetch } from '../../hooks/useFetch';
import Footer from '../../components/UI/Footer/Footer';
import Navigation from '../../components/Navigation';
import { CategoryService } from '../../API/CategoryService';
import AuthService from '../../API/AuthService';
import { IUserProfile } from '../../API/types';

interface LayoutProps {
  children: ReactNode;
  navIsVisible: boolean,
}

const Layout: FC<LayoutProps> = ({ children, navIsVisible }) => {
  const [categories, setCategories] = useState([{name:'', slug: ''}]);
  const [user, setUser] = useState<IUserProfile | null>(null);

  const [fetchCategories] = useFetch(async () => {
    const response = await CategoryService.getAll();
    setCategories(response);
  });

  const [fetchUser] = useFetch(async () => {
    const response = await AuthService.getCurrentUser();
    setUser(response);
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="page-content full-page">
      <Header user={user}/>
      {navIsVisible ? <Navigation categories={categories} /> : null}
      <main className="page-content">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;

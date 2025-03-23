import { useEffect, useState } from 'react';
import Header from '../components/UI/Header/Header';
import { useFetch } from '../hooks/useFetch';
import Footer from '../components/UI/Footer/Footer';
import Navigation from '../components/Navigation';
import { CategoryService } from '../API/CategoryService';

const Home = ({ children, navIsVisible }) => {
  const [categories, setCategories] = useState([]);

  const [fetchCategories] = useFetch(async () => {
    const response = await CategoryService.getAll();
    setCategories(response.data);
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="page-content">
      <Header />
      {navIsVisible ? <Navigation categories={categories} /> : null}
      <main className="page-content">{children}</main>
      <Footer />
    </div>
  );
};

export default Home;

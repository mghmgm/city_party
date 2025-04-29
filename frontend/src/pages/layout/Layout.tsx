import { FC, ReactNode, useEffect, useState } from 'react';
import Header from '../../components/UI/Header/Header';
import { useFetch } from '../../hooks/useFetch';
import Footer from '../../components/UI/Footer/Footer';
import Navigation from '../../components/Navigation';
import { CategoryService } from '../../API/CategoryService';
import AuthService from '../../API/AuthService';
import { ICategory, IUserProfile } from '../../types/types';
import EventService from '../../API/EventService';
import EventCard from '../../components/EventCard';

interface LayoutProps {
  children: ReactNode;
  navIsVisible: boolean;
}

const Layout: FC<LayoutProps> = ({ children, navIsVisible }) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchedEvents, setSearchedEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categoryEvents, setCategoryEvents] = useState([]);

  const [fetchCategories] = useFetch(async () => {
    const response = await CategoryService.getAll();
    setCategories(response);
  });

  const [fetchUser] = useFetch(async () => {
    const response = await AuthService.getCurrentUser();
    setUser(response);
  });

  const [fetchSearchEvents] = useFetch(async () => {
    const response = await EventService.getBySearch(searchValue);
    setSearchedEvents(response);
  });

  const [fetchCategoryEvents] = useFetch(async () => {
    const response = await EventService.getByCategory(selectedCategory);
    setCategoryEvents(response);
  });

  useEffect(() => {
    fetchCategories();
    fetchUser();
  }, []);

  const handleSearchSubmit = () => {
    if (searchValue.trim() === '') {
      setSearchedEvents([]);
      return;
    }
    fetchSearchEvents();
    setSelectedCategory('');
  };

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug);
    setSearchValue('');
    setSearchedEvents([]);
    fetchCategoryEvents(slug);
  };

  return (
    <div className="wrapper">
      <Header
        user={user}
        searchValue={searchValue}
        onSearchValueChange={(e) => setSearchValue(e.target.value)}
        onSearchSubmit={handleSearchSubmit}
      />
      {navIsVisible && (
        <Navigation
          categories={categories}
          selectedCategory={selectedCategory}
          onLinkClick={handleCategoryClick}
        />
      )}
      {searchedEvents.length > 0 ? (
        <main className="mt-60">
          {searchedEvents.map((event, idx) => (
            <EventCard event={event} key={idx} />
          ))}
        </main>
      ) : selectedCategory !== '' ? (
        <main className="mt-60">
          {categoryEvents.map((event, idx) => (
            <EventCard event={event} key={idx} />
          ))}
        </main>
      ) : (
        <main>{children}</main>
      )}
      <Footer />
    </div>
  );
};

export default Layout;

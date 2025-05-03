import { FC, ReactNode, useEffect, useState } from 'react';
import Header from '../../components/UI/Header/Header';
import { useFetch } from '../../hooks/useFetch';
import Footer from '../../components/UI/Footer/Footer';
import Navigation from '../../components/Navigation';
import { CategoryService } from '../../store/CategoryService';
import { ICategory } from '../../types/types';
import EventCard from '../../components/EventCard';
import { EventAPI } from '../../store/EventAPI';
import { useParams } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  navIsVisible: boolean;
}

const Layout: FC<LayoutProps> = ({ children, navIsVisible }) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { slug } = useParams<{ slug: string }>();

  const { data: categoryEvents, refetch: refetchCategoryEvents } =
    EventAPI.useFetchEventsByCategoryQuery(selectedCategory);

  const { data: searchedEvents, refetch: refetchSearchEvents } = EventAPI.useSearchEventsQuery(
    searchValue,
    { skip: searchValue.trim() === '' }
  );

  const [fetchCategories] = useFetch(async () => {
    const response = await CategoryService.getAll();
    setCategories(response);
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (slug) {
      setSelectedCategory(slug);
    } else {
      setSelectedCategory('');
    }
  }, [slug]);

  const handleSearchSubmit = () => {
    setSelectedCategory('');
    if (searchValue.trim() === '') {
      refetchSearchEvents();
    } else {
      refetchSearchEvents();
    }
  };

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug);
    setSearchValue('');
    refetchCategoryEvents();
  };

  const getEventsToDisplay = () => {
    if (searchValue.trim() === '' && selectedCategory === '') {
      return children;
    }
    if (searchValue.trim() !== '' && searchedEvents) {
      return (
        <div className="catalog">
          {searchedEvents.map((event, idx) => (
            <EventCard event={event} key={idx} />
          ))}
        </div>
      );
    }
    if (selectedCategory && categoryEvents!.length>0) {
      return (
        <div className="catalog">
          {categoryEvents!.map((event, idx) => (
            <EventCard event={event} key={idx} />
          ))}
        </div>
      );
    }
    return <h1>Нет подходящих мероприятий.</h1>;
  };

  useEffect(() => {
    if (selectedCategory) {
      refetchCategoryEvents();
    } else {
      refetchCategoryEvents();
    }
  }, [selectedCategory, refetchCategoryEvents]);

  return (
    <div className="wrapper">
      <Header
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

      <main className="mt-60">
        {getEventsToDisplay()}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;

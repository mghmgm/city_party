import { FC, ReactNode, useEffect, useState } from 'react';
import Header from '../../components/UI/Header/Header';
import { useFetch } from '../../hooks/useFetch';
import Footer from '../../components/UI/Footer/Footer';
import Navigation from '../../components/Navigation';
import { CategoryService } from '../../API/CategoryService';
import AuthService from '../../API/AuthService';
import { IUserProfile } from '../../API/types';
import EventService from '../../API/EventService';
import EventCard from '../../components/EventCard';

interface LayoutProps {
  children: ReactNode;
  navIsVisible: boolean,
}

const Layout: FC<LayoutProps> = ({ children, navIsVisible }) => {
  const [categories, setCategories] = useState([{name:'', slug: ''}]);
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [searchValue, setSearchValue] = useState('')
  const [searchedEvents, setSearchedEvents] = useState([])

  const [fetchSearchEvents] = useFetch(async ()=>{
    const response = await EventService.getBySearch(searchValue)
    setSearchedEvents(response)
  })

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
    fetchUser();
  }, []);

  const handleSearchSubmit = () => {
    if (searchValue.trim() === '') {
      setSearchedEvents([]);
      return;
    }
    fetchSearchEvents();
  };


  return (
    <div className="page-content full-page">
      <Header user={user} searchValue={searchValue} onSearchValueChange={(e)=>setSearchValue(e.target.value)} onSearchSubmit={handleSearchSubmit}/>
      {navIsVisible ? <Navigation categories={categories} /> : null}
      {searchedEvents.length>0
      ? (<main className="page-content searched-section">
          {searchedEvents.map(event => <EventCard event={event}/>)}
      </main>)
      :<main className="page-content">{children}</main>}
      <Footer />
    </div>
  );
};

export default Layout;

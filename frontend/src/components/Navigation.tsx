import { FC } from 'react';
import { Link } from 'react-router-dom';
import { ICategory } from '../API/types';
import search from '../assets/search.svg'

interface NavigationProps {
  categories: ICategory[];
}

const Navigation: FC<NavigationProps> = ({ categories }) => {
  return (
    <nav className='navigation content'>
      <img src={search} alt="search" className='navigation__mob-search'/>
      {categories.map((category, index) => (
        <Link to={category.slug} key={index}>{category.name}</Link>
      ))}
    </nav>
  );
};

export default Navigation;

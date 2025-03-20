import { FC } from 'react';
import { Link } from 'react-router-dom';
import { ICategory } from '../API/types';

interface NavigationProps {
  categories: ICategory[];
}

const Navigation: FC<NavigationProps> = ({ categories }) => {
  return (
    <nav className='navigation'>
      {categories.map((category) => (
        <Link to={category.slug}>{category.name}</Link>
      ))}
    </nav>
  );
};

export default Navigation;

import { FC } from 'react';
import { Link } from 'react-router-dom';
import { ICategory } from '../types/types';
import search from '../assets/search.svg';

interface NavigationProps {
  categories: ICategory[];
  selectedCategory: string;
  onLinkClick: (slug: string) => void;
}

const Navigation: FC<NavigationProps> = ({ categories, selectedCategory, onLinkClick }) => {
  return (
    <nav className="navigation content">
      <img src={search} alt="search" className="navigation__mob-search" />
      {categories.map((category, index) => (
        <Link
          to={category.slug}
          key={index}
          onClick={(e) => {
            e.preventDefault();
            onLinkClick(category.slug);
          }}
          className={category.slug == selectedCategory ? 'link-active' : ''}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;

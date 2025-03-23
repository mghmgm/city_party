import { FC } from 'react';
import classes from './Header.module.scss';
import logo from '../../../assets/logo.svg';
import Input from '../Input/Input';
import Select from '../Select/Select';
import Button from '../Button/Button';
import { Link } from 'react-router-dom';

const Header: FC = () => {
  const headerClass = `${classes.header} content`;
  const isAuthenticated = !!localStorage.getItem('auth_token');

  return (
    <header className={headerClass}>
      <Link to={'/'}>
        <img src={logo} alt="logo" />
      </Link>
      <Input type="search" placeholder="Введите название..." id="search" />
      <div className={classes.buttons}>
        <Select options={['Москва']} />
        {isAuthenticated ? (
          <div>
            <Link to="/profile">профиль</Link>
          </div>
        ) : (
          <Button href="/login" className={classes.loginBtn}>
            Войти
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;

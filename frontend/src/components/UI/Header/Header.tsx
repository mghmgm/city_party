import { FC } from 'react';
import classes from './Header.module.scss';
import logo from '../../../assets/logo.svg';
import Input from '../Input/Input';
import Select from '../Select/Select';
import Button from '../Button/Button';

const Header: FC = () => {
  const headerClass = `${classes.header} content`;
  return (
    <header className={headerClass}>
      <img src={logo} alt="logo" />
      <Input type="search" placeholder="Введите название..." id="search" />
      <div className={classes.buttons}>
        <Select options={["Москва"]}/>
        <Button href="/login" className={classes.loginBtn}>Войти</Button>
      </div>
    </header>
  );
};

export default Header;

import { FC } from 'react';
import classes from './Header.module.scss';
import logo from '../../../assets/logo.svg';
import Input from '../Input/Input';
import Select from '../Select/Select';
import Button from '../Button/Button';

const Header: FC = () => {
  return (
    <div className={classes.header}>
      <img src={logo} alt="logo" />
      <Input type="search" placeholder="Введите название..."/>
      <div>
        <Select />
        <Button href="">Войти</Button>
      </div>
    </div>
  );
};

export default Header;

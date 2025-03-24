import { FC, useContext } from 'react';
import classes from './Header.module.scss';
import logo from '../../../assets/logo.svg';
import Input from '../Input/Input';
import Select from '../Select/Select';
import Button from '../Button/Button';
import { Link, useNavigate } from 'react-router-dom';
import { IUserProfile } from '../../../API/types';
import { hostname } from '../../../config';
import AuthService from '../../../API/AuthService';
import { AuthContext } from '../../../router/context';
import avatar from '../../../assets/avatar.svg';

interface HeaderProps {
  user?: IUserProfile;
  searchValue: string;
}

const Header: FC<HeaderProps> = ({ user, searchValue }) => {
  const navigate = useNavigate();

  const headerClass = `${classes.header} content`;
  const { isAuth, setIsAuth } = useContext(AuthContext);
  const avatarUrl = user?.avatar ? hostname + user.avatar : avatar;

  const handleExitBtnClick = () => {
    AuthService.logout();
    setIsAuth(false);
    navigate('/', { replace: true });
  };

  return (
    <header className={headerClass}>
      <Link to={'/'}>
        <img src={logo} alt="logo" />
      </Link>
      <Input type="search" placeholder="Введите название..." id="search" value={searchValue} />
      <div className={classes.buttons}>
        <Select options={['Москва']} value="Москва" />
        {isAuth ? (
          <div className={classes.profile}>
            <Link to="/profile">
              <img src={avatarUrl} className={classes.avatar} />
            </Link>
            <Button onClick={handleExitBtnClick}>Выйти</Button>
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

import { FC, useEffect, useState } from 'react';
import Form from '../components/UI/Form/Form';
import Button from '../components/UI/Button/Button';
import Input from '../components/UI/Input/Input';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { getToken, getUserProfile } from '../store/AuthSlice';

const LoginForm: FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(getToken({ username, password }));
    
    if (getToken.fulfilled.match(resultAction)) {
      await dispatch(getUserProfile());
      navigate('/profile/');
    }
  };

  return (
    <div className='wrapper'>
      <div className="content">
        <section className="auth">
          <div>
            <Link to="/" className="auth__to-home">
              На главную
            </Link>
            <Form title="Вход" onSubmit={handleSubmit}>
              <div className="auth__content">
                <Input
                  type="text"
                  label="Логин"
                  id="login"
                  placeholder="Введите вашу почту..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  type="password"
                  label="Пароль"
                  id="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button className="auth__btn">Войти</Button>
              <Link to="/registration/" className="auth__to-login">
                У вас еще нет аккаунта?
              </Link>
            </Form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginForm;

import { FC, useState } from 'react';
import Form from './UI/Form/Form';
import Button from './UI/Button/Button';
import Input from './UI/Input/Input';
import { Link } from 'react-router-dom';
import AuthService from '../API/AuthService';

const RegistrationForm: FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await AuthService.login(username, password);
  };

  return (
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
            <Link to="/registration" className="auth__to-login">
              У вас еще нет аккаунта?
            </Link>
          </Form>
        </div>
      </section>
    </div>
  );
};

export default RegistrationForm;

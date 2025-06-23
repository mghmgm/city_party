import { FC, FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/store';
import { registerUser } from '../store/AuthSlice';
import Form from '../components/UI/Form/Form';
import Button from '../components/UI/Button/Button';
import Input from '../components/UI/Input/Input';

const RegistrationForm: FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (password !== password2) {
      setErrors({ password2: 'Пароли не совпадают' });
      return;
    }

    try {
      await dispatch(
        registerUser({
          username,
          email,
          password,
          is_subscribed: isSubscribed,
        }),
      ).unwrap();
      navigate('/login/');
    } catch (err: any) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ non_field_errors: 'Ошибка регистрации' });
      }
    }
  };

  const handleYandexLogin = () => {
    const clientId = import.meta.env.VITE_CLIENT_ID;
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/yandex/callback`);
    window.location.href = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
  };

  return (
    <div className="wrapper">
      <div className="content">
        <section className="auth">
          <div>
            <Link to="/" className="auth__to-home">
              На главную
            </Link>
            <Form title="Регистрация" onSubmit={handleSubmit}>
              <div className="auth__content">
                <Input
                  type="text"
                  label="Имя пользователя"
                  id="username"
                  placeholder="Введите имя пользователя"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  type="email"
                  label="Email"
                  id="email"
                  placeholder="Введите ваш email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  label="Пароль"
                  id="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  type="password"
                  label="Подтверждение пароля"
                  id="password2"
                  placeholder="Повторите пароль"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                />
                {errors.non_field_errors && (
                  <div className="auth__error">{errors.non_field_errors}</div>
                )}
                <Button type="submit" className="auth__btn">
                  Зарегистрироваться
                </Button>
                <Button
                  className="auth__social"
                  onClick={() => {
                    const clientId = import.meta.env.VITE_CLIENT_ID;
                    const hostname = import.meta.env.VITE_HOSTNAME;
                    const redirectUri = `${hostname}/auth/yandex/callback`;
                    const authUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
                    window.location.href = authUrl;
                  }}
                >
                  Войти с Яндекс ID
                </Button>
                <Link to="/login/" className="auth__to-login">
                  У вас уже есть аккаунт?
                </Link>
              </div>
            </Form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RegistrationForm;

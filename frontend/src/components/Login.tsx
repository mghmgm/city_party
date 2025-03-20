import { FC } from 'react';
import Form from './UI/Form/Form';
import Button from './UI/Button/Button';
import Input from './UI/Input/Input';
import { Link } from 'react-router-dom';

interface RegistrationFormProps {}

const RegistrationForm: FC<RegistrationFormProps> = () => {
  return (
    <div className="content">
      <section className="auth">
        <Form title="Вход">
          <div className="auth__content">
            <Input type="text" label="Логин" id="login" placeholder="Введите вашу почту..." />
            <Input type="text" label="Пароль" id="password" placeholder="********" />
          </div>
          <Button className="auth__btn">Войти</Button>
          <Link to="/registration" className="auth__to-login">
            У вас еще нет аккаунта?
          </Link>
        </Form>
      </section>
    </div>
  );
};

export default RegistrationForm;

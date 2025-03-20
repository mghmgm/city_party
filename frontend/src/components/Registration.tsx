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
        <Form title="Регистрация">
          <div className="auth__content">
            <Input type="text" label="Имя" id="name" placeholder="Введите ваше имя..." />
            <Input type="text" label="Почта" id="login" placeholder="Введите вашу почту..." />
            <Input type="text" label="Пароль" id="password" placeholder="********" />
            <Input
              type="checkbox"
              checked={true}
              label="Подписаться на рассылку об интересных мероприятиях"
              id="subscription"
            />
          </div>
          <Button className="auth__btn">Зарегистрироваться</Button>
          <Link to="/login" className="auth__to-login">
            У вас уже есть аккаунт?
          </Link>
        </Form>
      </section>
    </div>
  );
};

export default RegistrationForm;

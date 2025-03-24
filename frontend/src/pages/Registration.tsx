import { FC, FormEvent, useState } from 'react';
import Form from '../components/UI/Form/Form';
import Button from '../components/UI/Button/Button';
import Input from '../components/UI/Input/Input';
import { Link } from 'react-router-dom';

const RegistrationForm: FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubscribe, setIsSubscribe] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // доделать отправку данных
  }

  return (
    <div className="content">
      <section className="auth">
        <div>
          <Link to="/" className='auth__to-home'>На главную</Link>
          <Form title="Регистрация" onSubmit={handleSubmit}>
            <div className="auth__content">
              <Input type="text" label="Имя" id="name" placeholder="Введите ваше имя..." value={name}/>
              <Input type="text" label="Почта" id="login" placeholder="Введите вашу почту..." value={email}/>
              <Input type="text" label="Пароль" id="password" placeholder="********" value={password}/>
              <Input
                type="checkbox"
                checked={isSubscribe}
                label="Подписаться на рассылку об интересных мероприятиях"
                id="subscription"
                value={`${isSubscribe}`}
              />
            </div>
            <Button className="auth__btn">Зарегистрироваться</Button>
            <Link to="/login" className="auth__to-login">
              У вас уже есть аккаунт?
            </Link>
          </Form>
        </div>
      </section>
    </div>
  );
};

export default RegistrationForm;

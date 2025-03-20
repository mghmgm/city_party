import { FC, useState } from 'react';
import Form from '../components/UI/Form/Form';
import RegistrationForm from '../components/Registration';
import LoginForm from '../components/Login';

const Registration: FC = () => {
  const [formType, setFormType] = useState('');
  return (
    <div className="content">
      <section className="auth">
        {formType === 'registration' ? <RegistrationForm /> : <LoginForm />}
      </section>
    </div>
  );
};

export default Registration;

import { FC, ReactNode } from 'react';
import classes from './Form.module.scss';

interface FormProps {
  title?: string;
  children?: ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Form: FC<FormProps> = ({ title, children, onSubmit }) => {
  return (
    <form className={classes.form} onSubmit={onSubmit}>
      <h1>{title}</h1>
      {children}
    </form>
  );
};

export default Form;

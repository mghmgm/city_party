import { FC, ReactNode } from 'react';
import classes from './Form.module.scss';

interface FormProps {
  title?: string;
  children?: ReactNode;
}

const Form: FC<FormProps> = ({ title, children }) => {
  return (
    <form className={classes.form}>
      <h1>{title}</h1>
      {children}
    </form>
  );
};

export default Form;

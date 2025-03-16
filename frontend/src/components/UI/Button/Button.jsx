import React from 'react';
import classes from './Button.module.scss';

const Button = ({ href, children }) => {
  return href ? (
    <a className={classes.button} href={href}>
      {children}
    </a>
  ) : (
    <button className={classes.button}>{children}</button>
  );
};

export default Button;

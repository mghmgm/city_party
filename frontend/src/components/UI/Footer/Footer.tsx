import { FC } from 'react';
import logo from '../../../assets/logo-light.svg';
import classes from './Footer.module.scss';

const Footer: FC = () => {
  return (
    <footer className={classes.footer}>
      <div className="content">
        <img src={logo} alt="" />
        <ul className={classes.links}>
          <li>Privacy Policy</li>
          <li>Terms & Conditions</li>
          <li>Cookie Policy</li>
          <li>Contact</li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;

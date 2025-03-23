import { FC } from 'react';
import classes from './Select.module.scss';

interface SelectProps {
  options: string[];
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
}

const Select: FC<SelectProps> = ({ options, onChange, value }) => {
  return (
    <select name="" id="" className={classes.select} value={value}  onChange={onChange}>
      {options.map((optionName) => (
        <option value={optionName}>
          {optionName}
        </option>
      ))}
    </select>
  );
};

export default Select;

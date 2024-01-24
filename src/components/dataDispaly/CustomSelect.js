import React from 'react';
import ReactSelect from 'react-select';

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#1A202C',
    color: 'white',
    boxShadow: 'none',
  }),
};

const CustomSelect = (props) => {
  return <ReactSelect {...props} styles={customSelectStyles} />;
};

export default CustomSelect;

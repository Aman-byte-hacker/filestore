import React from 'react';
import { Button } from '@mui/material';

const AddProductButton = ({ handleAddProduct }) => {
  return (
    <Button style={{ marginTop: '10px' }} variant="outlined" onClick={handleAddProduct}>
      Add Product
    </Button>
  );
};

export default AddProductButton;

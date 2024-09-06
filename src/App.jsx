import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import ProductList from './Components/ProductList';
import AddProductButton from './Components/AddProductButton';

const App = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Cotton classic sneaker', discount: 20, discountType: '% Off' },
  ]);

  // Add a new product to the list
  const handleAddProduct = () => {
    const newProduct = {
      id: Date.now(), // Use timestamp to ensure a unique ID
      name: '',
      discount: 0,
      discountType: '% Off',
    };
    setProducts([...products, newProduct]);
  };

  // Handle changes in product fields
  const handleProductChange = (id, field, value) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, [field]: value } : product
      )
    );
  };

  // Remove a product from the list
  const handleRemoveProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  // Add selected product and variant info to the list
  const addProductToList = (selectedProducts) => {
    setProducts([...products, ...selectedProducts]);
  };

  // Handle drag and drop for reordering products
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedProducts = Array.from(products);
    const [movedProduct] = reorderedProducts.splice(result.source.index, 1);
    reorderedProducts.splice(result.destination.index, 0, movedProduct);

    setProducts(reorderedProducts);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <h1>Add Products</h1>
      <ProductList
        products={products}
        handleProductChange={handleProductChange}
        handleRemoveProduct={handleRemoveProduct}
        addProductToList={addProductToList}
      />
      <AddProductButton handleAddProduct={handleAddProduct} />
    </DragDropContext>
  );
};

export default App;

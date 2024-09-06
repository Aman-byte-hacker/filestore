import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import ProductPicker from './ProductPicker';

const ProductList = ({ products, handleProductChange, handleRemoveProduct, addProductToList }) => {

  return (
    <Droppable droppableId="productList">
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {products.map((product, index) => (
            <Draggable key={product.id} draggableId={product.id} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '10px',
                    ...provided.draggableProps.style,
                  }}
                >
                  <span>{index + 1}.</span>
                  <ProductPicker
                    product={product}
                    handleProductChange={(field, value) =>
                      handleProductChange(product.id, field, value) // Use the parent handler
                    }
                    addProductToList={addProductToList}
                  />
                  <button onClick={() => handleRemoveProduct(product.id)}>Remove</button>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default ProductList;

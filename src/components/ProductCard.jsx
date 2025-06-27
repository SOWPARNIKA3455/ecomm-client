import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/products/${productId}`)}
      style={{
        border: '1px solid #ddd',
        padding: 12,
        marginBottom: 10,
        cursor: 'pointer',
      }}
    >
      <h4>{product.title}</h4>
      <p>{product.description.substring(0, 60)}...</p>
      <p><b>Price:</b> ₹{product.price}</p>
    </div>
  );
};

export default ProductCard;

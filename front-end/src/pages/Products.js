import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import requests from '../services/requests';
import AppContext from '../context/AppContext';

export default function Products() {
  const { totalValue, token } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchProducts = async () => {
      const headers = { headers: { authorization: token } };
      const response = await requests.getProducts(headers);
      setProducts(response.data);
    };
    fetchProducts();
  }, []);

  const ROUTE = 'customer_products';
  const CART = 'button-cart';
  const VALUE = 'checkout-bottom-value';

  localStorage.setItem('user', JSON.stringify({
    id: 3,
    name: 'Cliente Zé Birita',
    email: 'zebirita@email.com',
    role: 'customer',
  }));

  return (
    <div>
      <Header />
      <div className="flex flex-wrap mt-12 place-content-center gap-4">
        {products.map((product) => (
          <ProductCard
            key={ product.id }
            { ...product }
          />
        ))}
      </div>
      <button
        type="button"
        data-testid={ `${ROUTE}__${CART}` }
        className="bg-green-dark rounded-md fixed bottom-0 right-0 m-4 px-4 py-2
        text-white"
        onClick={ () => history.push('/customer/checkout') }
      >
        View Cart:
        {' '}
        <span
          data-testid={ `${ROUTE}__${VALUE}` }
          className="text-bold text-white font-bold"
        >
          R$
          {' '}
          {totalValue.toFixed(2)}
        </span>
      </button>
    </div>
  );
}

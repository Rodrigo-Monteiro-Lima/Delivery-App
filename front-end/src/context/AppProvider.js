import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import socketIo from 'socket.io-client';
import AppContext from './AppContext';
import requests from '../services/requests';

export default function AppProvider({ children }) {
  // CART CONTEXT
  const storedCart = localStorage.getItem('cart');
  const initialCart = storedCart ? JSON.parse(storedCart) : {};
  const [cart, setCart] = useState(initialCart);
  const [user, setUser] = useState({});
  const [token, setToken] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  // SALES CONTEXT
  const [sales, setSales] = useState([]);

  useEffect(() => {
    // Compute the new total value based on the current contents of the cart
    const newTotalValue = Object.values(cart)
      .reduce((acc, { price, quantity }) => acc + price * quantity, 0);
    setTotalValue(newTotalValue);
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  const addToCart = (id, name, price, quantity) => {
    setCart((prevCart) => ({
      ...prevCart,
      [id]: {
        name,
        price,
        quantity,
      },
    }));
  };

  useEffect(() => {
    const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
    const tokenFromLocalStorage = JSON.parse(localStorage.getItem('token'));
    setUser(userFromLocalStorage);
    setToken(tokenFromLocalStorage);
    if (userFromLocalStorage) {
      setRole(userFromLocalStorage.role);
    }
  }, []);

  const removeFromCart = (id) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      delete newCart[id];
      return newCart;
    });
  };

  const deleteUser = async (id) => {
    try {
      const headers = { headers: { authorization: token } };
      await requests.deleteUser(id, headers);
      setUsers(users.filter((u) => u.id !== id));
      toast.success('User deleted successfully');
      setMessage('User deleted successfully');
    } catch (error) {
      setMessage(error.response.data.message);
      toast.error(error.response.data.message);
    }
  };

  // GET SALES
  const getSales = async () => {
    try {
      const headers = { headers: { authorization: token } };
      const response = await requests.getSales(role, user.id, headers);
      setSales(response.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const toBRL = (value) => {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    return formatter.format(value);
  };

  // SOCKET.IO
  useEffect(() => {
    const socket = socketIo('http://localhost:3001', {
      transports: ['websocket'],
    });
    socket.on('sales@new', (sale) => {
      setSales((prevState) => prevState.concat(sale));
    });
  }, []);

  // useEffect(() => {
  //   const socket = socketIo('http://localhost:3001', {
  //     transports: ['websocket'],
  //   });
  //   socket.on('sales@update', ({ id, status }) => {
  //     console.log('SALES', sales);
  //     const updatedSales = sales.map((sale) => {
  //       if (Number(sale.id) === Number(id)) {
  //         return { ...sale, status };
  //       }
  //       return sale;
  //     });
  //     console.log('UPDATE SALES', updatedSales);
  //     setSales(updatedSales);
  //   });
  // }, []);

  const values = useMemo(() => ({
    cart,
    setCart,
    addToCart,
    removeFromCart,
    totalValue,
    user,
    setUser,
    message,
    setMessage,
    token,
    setToken,
    users,
    setUsers,
    role,
    setRole,
    sales,
    setSales,
    getSales,
    deleteUser,
    toBRL,
  }), [cart, totalValue, user, message, token, users, sales]);

  return (
    <AppContext.Provider value={ values }>
      {children}
    </AppContext.Provider>
  );
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

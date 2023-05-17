import React, { useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import OrdersCard from '../components/OrdersCard';
import AppContext from '../context/AppContext';
import LoadAnimation from '../components/LoadAnimation';

function Customer() {
  const { sales, getSales } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  console.log(sales);
  // const [sales, setSales] = useState([]);

  // useEffect(() => {
  //   const getSales = async () => {
  //     try {
  //       const headers = { headers: { authorization: token } };
  //       await requests.salesCustomer(user.id, headers)
  //         .then(({ data }) => setSales(data))
  //         .finally(() => setLoading(false));
  //       console.log(sales);
  //     } catch (error) {
  //       console.log(error.response.data.message);
  //     }
  //   };
  //   getSales();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  useEffect(() => {
    const fetchSales = async () => {
      try {
        await getSales();
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Header />
      <div className="flex flex-wrap mt-14 sm:mt-[70px] gap-4 mx-4 justify-evenly">
        {loading ? <LoadAnimation />
          : (sales !== undefined && sales.map((sale) => (
            <OrdersCard
              key={ sale.id }
              { ...sale }
            />
          )))}
      </div>
    </div>
  );
}

export default Customer;

import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';

export default function OrdersCard(props) {
  const { id, totalPrice, saleDate, status, deliveryAddress, deliveryNumber } = props;
  const location = useLocation();
  const currentPath = location.pathname;
  const orderSeller = '/seller/orders';

  const magicNumber = 4;
  const newId = String(id).padStart(magicNumber, '0');
  const date = new Date(saleDate);
  const newDate = new Intl.DateTimeFormat('pt-BR').format(date);
  const newValue = totalPrice
    .toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });

  function getColor() {
    switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-pending';
    case 'preparing':
      return 'bg-preparing';
    case 'delivered':
      return 'bg-delivered';
    case 'in transit':
      return 'bg-inTransit';
    default:
    }
  }

  return (
    <Link
      to={ currentPath === orderSeller
        ? `/seller/orders/${id}` : `/customer/orders/${id}` }
      className={ `flex border bg-bg0 border-bgLBorder shadow-lg drop-shadow-md w-[399px]
      ${currentPath === orderSeller ? 'h-36' : 'h-24'}` }
    >
      <div
        className="flex flex-col items-center h-full w-[113px] justify-center
       bg-white"
      >
        <span className="text-sm">Order</span>
        <span
          className="text-lg"
          data-testid={ currentPath === orderSeller
            ? `seller_orders__element-order-id-${id}`
            : `customer_orders__element-order-id-${id}` }
        >
          {newId}
        </span>
      </div>
      <div className="flex flex-col h-full w-[286px] bg-bg0 ">
        <div className="flex flex-wrap justify-evenly h-full">
          <div
            className={ `flex ${getColor()} rounded-lg items-center
          font-bold text-lg justify-center w-[150px] my-2` }
          >
            <span
              data-testid={ currentPath === orderSeller
                ? `seller_orders__element-delivery-status-${id}`
                : `customer_orders__element-delivery-status-${id}` }
              className="text-center"
            >
              {status}
            </span>
          </div>
          <div className="flex flex-col justify-center text-center w-[95px]">
            <span
              data-testid={ currentPath === orderSeller
                ? `seller_orders__element-order-date-${id}`
                : `customer_orders__element-order-date-${id}` }
              className="flex bg-bg1 rounded-lg font-bold h-full items-center
              justify-center mt-2"
            >
              {newDate}
            </span>
            <span
              data-testid={ currentPath === orderSeller
                ? `seller_orders__element-card-price-${id}`
                : `customer_orders__element-card-price-${id}` }
              className="flex bg-bg1 rounded-lg font-bold h-full items-center
              justify-center my-2"
            >
              {newValue}
            </span>
          </div>
        </div>
        {currentPath === orderSeller
          && (
            <div className="flex items-center justify-center h-[45px] ">
              <span
                data-testid={ `seller_orders__element-card-address-${id}` }
                className="pr-3 text-xs w-full text-right"
              >
                {`${deliveryAddress}, ${deliveryNumber}`}
              </span>
            </div>)}
      </div>
    </Link>
  );
}

OrdersCard.propTypes = {
  id: PropTypes.number.isRequired,
  totalPrice: PropTypes.number.isRequired,
  saleDate: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  deliveryAddress: PropTypes.string.isRequired,
  deliveryNumber: PropTypes.string.isRequired,
};

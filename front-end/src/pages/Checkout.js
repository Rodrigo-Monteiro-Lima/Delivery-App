import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import requests from '../services/requests';
import AppContext from '../context/AppContext';
import Input from '../components/Input';

export default function Checkout() {
  const { totalValue, token,
    salesperson,
    setSalesperson,
    address,
    setAddress,
    addressNumber,
    setAddressNumber } = useContext(AppContext);

  return (
    <div>
      <Header />
      <div>
        <h1>Finish Order</h1>
      </div>
      <div>
        <h1>Details and Delivery Address</h1>
        <div>
          <Input
            label="Responsible Salesperson"
            // Lista de vendedores
            type="text"
            inputName="salespersonInput"
            id="salespersonInput"
            value={ salesperson }
            dataName="customer_checkout__select-seller"
            onChange={ ({ target }) => setSalesperson(target.value) }
          />
          <Input
            label="Addess"
            type="text"
            inputName="addressInput"
            id="addressInput"
            value={ address }
            dataName="customer_checkout__input-address"
            onChange={ ({ target }) => setAddress(target.value) }
          />
          <Input
            label="Number"
            type="text"
            inputName="addressNumberInput"
            id="addressNumberInput"
            value={ addressNumber }
            dataName="customer_checkout__input-address-number"
            onChange={ ({ target }) => setAddressNumber(target.value) }
          />
        </div>
        <button
          type="button"
          data-testid="customer_checkout__button-submit-order"
        >
          FINISH ORDER
        </button>
      </div>
    </div>
  );
}

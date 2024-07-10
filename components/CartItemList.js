/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material'
import CartItem from './CartItem';

function CartItemList() {
  const cartURL = "http://localhost:8000/v1/cartitems";
  const [cartItems, setCartItems] = useState([]); 
  // next steps, update decimal placement/cutoff for total price 
  const totalPrice = cartItems.map(cartItem => cartItem.quantity * cartItem.price).reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  useEffect( () => {
    async function update(){
    const response = await fetch(cartURL,{ method: 'GET'});
    const json = await response.json();
    setCartItems(json);
    }
    update();
  }, [])
  return (
    <div>
      <Grid container direction="column" spacing={1}>
        {cartItems.map(cartItem =>
          <Grid item xs>
            <CartItem
              product_id={cartItem.product_id}
              name={cartItem.name}
              id={cartItem.id}
              
              quantity={cartItem.quantity}
              price={cartItem.price}
              
              />
          </Grid>
        )}
      </Grid>
      <div>
        <Typography variant="h3">
          Total: ${totalPrice}
        </Typography>
        <Typography variant="h2">
          Total with Tax: ${totalPrice} 
        </Typography>
      </div>
    </div>
  );
}

export default CartItemList;
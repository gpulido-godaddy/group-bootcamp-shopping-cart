import React, { useState, useEffect } from 'react';
import { Grid, Box,Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';
import SalesItem from './SalesItem';

function SalesList() {

  // this is the state we will use to hold the response from the api
  const addToCartUrl = "http://localhost:8000/v1/cartitems";
  const getProductsListUrl = "http://localhost:8000/v1/products" ;
  const [saleProducts, setSaleProducts] = useState([]);
  const router = useRouter();

  const [priceLimit,setPriceLimit] = useState('');

const handlePriceLimit = (newPriceLimit) => {
  setPriceLimit(newPriceLimit);
};

const handleReverse = () => {
  setPriceLimit(2000);
}

  useEffect( () => {
    async function update(){
    const response = await fetch(getProductsListUrl,{ method: 'GET'});
    const json = await response.json();
    setSaleProducts (json);
    }
    update();
  }, []);

  const handleAddToCart = async (product) => {
    const responseCart = await fetch(addToCartUrl,{ method: 'GET'});
    const json = await responseCart.json();
    const currentCartItems = json;
    //console.log(product.name);
    //console.log(currentCartItems);
    const body = JSON.stringify(product);
    const alreadyInCartItem = currentCartItems.find(item => item.name == product.name);
    if (alreadyInCartItem) {
      alert("This item is already in the cart. You can update the quantity on the cart page.");
      return;
    }
    const response = await fetch(addToCartUrl, { method: 'POST', body, headers: { 'content-type': 'application/json' }});
    router.push("/cart")
  }

  return (
    <div>
    <div>
    <Typography variant="h6">FILTER BY:</Typography>
    <Button color="inherit" onClick={handleReverse}>All Items</Button>
      <Button color="inherit" onClick={() => handlePriceLimit(80)}>Items Under $70</Button>
      <Button color="inherit" onClick={() => handlePriceLimit(80)}>Items Under $50</Button>
      <Button color="inherit" onClick={() => handlePriceLimit(30)}>Items Under $30</Button>
    </div>
    <Grid container direction="row" spacing={5} sx={{ m: 0.5 }}>
       {saleProducts.map(product => (product.sale_price <= priceLimit) && 
       <Grid
       display="flex"
       minHeight="60vh"
       >
          <SalesItem
            key={product.id}
            product_id={product.product_id}
            name={product.name}
            description={product.description}
            image_url={product.image_url}
            price={product.price}
            is_on_sale={product.is_on_sale}
            sale_price={product.sale_price}
            onAddToCart={handleAddToCart}>
          </SalesItem>

        </Grid>
       )}
    </Grid>
    </div>
  )
}

export default SalesList;
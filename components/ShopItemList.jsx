import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import ShopItem from './ShopItem';

function ShopItemList() {

  const addToCartUrl = "http://localhost:8000/v1/cartitems";
  const getProductsListUrl = "http://localhost:8000/v1/products" ;
  const router = useRouter();
  const [makeupType,setMakeupType] = useState('');
  const [products, setProducts] = useState([]);

const handleFilterChange = (newMakeupType) => {
  setMakeupType(newMakeupType);
};

const handleReverse = () => {
  setMakeupType("");
}

  useEffect( () => {
    async function update(){
    const response = await fetch(getProductsListUrl,{ method: 'GET'});
    const json = await response.json();
    setProducts(json);
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
    router.push("/cart");
  }

  return (
    <div>
    <div>
    <Typography variant="h6">FILTER BY:</Typography>
    <Button color="inherit" onClick={handleReverse}>All Items</Button>
      <Button color="inherit" onClick={() => handleFilterChange("brushes")}>Brushes</Button>
      <Button color="inherit" onClick={() => handleFilterChange("lipstick")}>Lipstick</Button>
      <Button color="inherit" onClick={() => handleFilterChange("primer")}>Primers</Button>
      <Button color="inherit" onClick={() => handleFilterChange("blush")}>Blush</Button>
      <Button color="inherit" onClick={() => handleFilterChange("mascara")}>Mascara</Button>
      <Button color="inherit" onClick={() => handleFilterChange("eyeliner")}>Eyeliner</Button>
      <Button color="inherit" onClick={() => handleFilterChange("eyeshadow")}>Eyeshadow</Button>
    </div>
    <br/>
    <Grid container direction="row" spacing={2}>
       {products.map(product => 
       (!makeupType || product.makeup_type === makeupType) && (
        <Grid item xs>
          <ShopItem
            key={product.id}
            product_id={product.product_id}
            name={product.name}
            description={product.description}
            image_url={product.image_url}
            price={product.price}
            is_on_sale={product.is_on_sale}
            sale_price={product.sale_price}
            onAddToCart={handleAddToCart}>
          </ShopItem>
        </Grid>
       ))}
    </Grid>
    </div>
  )
}

export default ShopItemList;
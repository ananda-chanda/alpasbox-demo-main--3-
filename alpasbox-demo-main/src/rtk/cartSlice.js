import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

// Async thunk to fetch the cart
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem('user_token');
  try {
    const response = await axios.post('https://admin.urbantyohar.com/api/view-cart', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async thunk to add an item to the cart
export const addToCart = createAsyncThunk('cart/addToCart', async (productDetails, { rejectWithValue }) => {
  const token = localStorage.getItem('user_token');
  try {
    // Send the add-to-cart request
    await axios.post('https://admin.urbantyohar.com/api/add-to-cart', {
      product_id: productDetails.id,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Refetch the cart to ensure it is up-to-date
    const response = await axios.post('https://admin.urbantyohar.com/api/view-cart', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data; // Return the updated cart data
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});


// Async thunk to update the cart
export const updateCart = createAsyncThunk('cart/updateCart', async ({ cartId, quantity }, { rejectWithValue }) => {
  const token = localStorage.getItem('user_token');
  try {
    const formData = new FormData();
    formData.append('cart_id', cartId);
    formData.append('quantity', quantity);

    await axios.post('https://admin.urbantyohar.com/api/cart-update', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    // Fetch the updated cart
    const response = await axios.post('https://admin.urbantyohar.com/api/view-cart', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async thunk to remove an item from the cart
export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (cartId, { rejectWithValue }) => {
  const token = localStorage.getItem('user_token');
  try {
    // Create FormData to pass the cart ID
    const formData = new FormData();
    formData.append('id', cartId);

    // Send the API request to remove the item from the cart
    const response = await axios.post('https://admin.urbantyohar.com/api/remove-cart', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    // Check if the remove cart operation is successful
    if (response.data.status === 200) {
      // Fetch the updated cart after successful removal
      const updatedCartResponse = await axios.post('https://admin.urbantyohar.com/api/view-cart', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return updatedCartResponse.data.data; // Return updated cart data
    } else {
      return rejectWithValue('Failed to remove item from cart');
    }
  } catch (error) {
    // Handle any error from the request
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload; // Update state with the new cart data
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;

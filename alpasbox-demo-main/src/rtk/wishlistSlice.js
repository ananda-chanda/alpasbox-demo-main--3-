import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

// Async thunk to fetch the wishlist
export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem('user_token');
  try {
    const response = await axios.post('https://admin.urbantyohar.com/api/all-favourite', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async thunk to add or remove an item from the wishlist
export const toggleWishlist = createAsyncThunk('wishlist/toggleWishlist', async (productDetails, { rejectWithValue }) => {
  const token = localStorage.getItem('user_token');
  try {
    const response = await axios.post('https://admin.urbantyohar.com/api/favourite', {
      product_id: productDetails.id,
      favorite: 1, 
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Fetch the updated wishlist
    const updatedWishlistResponse = await axios.post('https://admin.urbantyohar.com/api/all-favourite', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return updatedWishlistResponse.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default wishlistSlice.reducer;
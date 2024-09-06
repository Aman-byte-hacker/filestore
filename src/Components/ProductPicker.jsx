import React, { useState, useEffect, useCallback } from 'react';
import {
  IconButton,
  TextField,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Checkbox,
  InputAdornment,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RuleIcon from '@mui/icons-material/Rule';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import AddProductButton from './AddProductButton';

const ProductPicker = ({ product, handleProductChange, addProductToList }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]); // Track selected products and variants
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Track if more products are available
  const [searchTerm, setSearchTerm] = useState(''); // Track the search query
  const [initialFetch, setInitialFetch] = useState(false); // Track if initial fetch has happened
  const [buttonText, setButtonText] = useState('Show Variants');
  const [showVariants, setShowVariants] = useState(false);


  // Function to fetch products from the API
  const fetchProducts = useCallback(async (reset = false) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://stageapi.monkcommerce.app/task/products/search?search=${searchTerm}&page=${page}&limit=10`,
        {
          headers: { 'x-api-key': '72njgfa948d9aS7gs5' },
        }
      );
      const fetchedProducts = response.data; // Assuming response structure has a "products" array
      if (fetchedProducts.length === 0) {
        setHasMore(false); // No more products to load
      }

      // If reset is true, we replace the current products; otherwise, append
      setAvailableProducts((prevProducts) =>
        reset ? fetchedProducts : [...prevProducts, ...fetchedProducts]
      );
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  }, [page, searchTerm, loading, hasMore]);

  // Fetch products only once when the drawer opens
  useEffect(() => {
    if (drawerOpen && !initialFetch) {
      setInitialFetch(true);
      fetchProducts(true); // Reset and fetch the first batch of products
    }
  }, [drawerOpen, fetchProducts, initialFetch]);

  // Fetch more products when page number changes (triggered by scroll)
  useEffect(() => {
    if (page > 1) {
      fetchProducts();
    }
  }, [page, fetchProducts]);

  // Handle scroll event to load more products when the user scrolls to the bottom
  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1); // Move to the next page
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to page 1 for new search
    setHasMore(true); // Reset `hasMore` for the new search
    fetchProducts(true); // Fetch with the new search term
  };

  // Toggle drawer visibility
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
    if (!drawerOpen) {
      setInitialFetch(false); // Reset initial fetch flag when closing
      setPage(1); // Reset pagination when reopening
      setHasMore(true); // Reset `hasMore` when reopening
    }
  };

  const handleButtonClick = () => {
    if (buttonText === 'Show Variants') {
      setButtonText('Hide Varaints')
      setShowVariants(true)
    } else if (buttonText === 'Hide Varaints') {
      setButtonText('Show Variants')
      setShowVariants(false)
    }
  }
  // Handle checkbox selection for both product and variant
  const handleSelect = (product, variant) => {
    const isSelected = selectedProducts.some(
      (selected) => selected.product.id === product.id && selected.variant?.id === variant?.id
    );

    if (isSelected) {
      // Remove product or variant
      setSelectedProducts((prevSelected) =>
        prevSelected.filter(
          (selected) => !(selected.product.id === product.id && selected.variant?.id === variant?.id)
        )
      );
    } else {
      // Add product or variant
      setSelectedProducts((prevSelected) => [...prevSelected, { product, variant }]);
    }
  };



  // Add selected products to the list
  const handleAddProduct = () => {
    const productsWithVariants = selectedProducts.map(({ product, variant }) => ({
      ...product,
      selectedVariantId: variant ? variant.id : null,
    }));
    addProductToList(productsWithVariants); // Call the prop function
    setDrawerOpen(false);
  };

  console.log("proewfwe", product)

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      {product !== undefined ? <div>
        <TextField
          label="Product"
          value={product.title || ""}
          onChange={(e) => handleProductChange('name', e.target.value)}
          style={{ width: 200 }}
        />

        <TextField
          label="Discount"
          type="number"
          onChange={(e) => handleProductChange('discount', e.target.value)}
          style={{ width: 100 }}
        />

        <TextField
          select
          label="Discount Type"
          onChange={(e) => handleProductChange('discountType', e.target.value)}
          style={{ width: 120 }}
        >
          <MenuItem value="% Off">% Off</MenuItem>
          <MenuItem value="Flat Off">Flat Off</MenuItem>
        </TextField>
        <button onClick={handleButtonClick} style={{ marginLeft: '20px' }}>{buttonText}</button>
        {showVariants ? product?.variants?.map((variant => {
          return (
            <div style={{ marginLeft: '23px' }}>
              <h5>{variant.title}</h5>
            </div>
          )
        })) : ''}
      </div> : ''}

      {/* Rule Icon to trigger the drawer */}
      <IconButton onClick={toggleDrawer}>
        <RuleIcon />
      </IconButton>

      {/* Drawer with available products */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        <div style={{ width: 300, padding: '20px', position: 'relative' }}>
          <IconButton
            style={{ position: 'absolute', top: 10, right: 10 }}
            onClick={toggleDrawer}
          >
            <CloseIcon />
          </IconButton>

          <h3>Available Products</h3>

          {/* Search bar */}
          <TextField
            fullWidth
            placeholder="Search for products"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            style={{ marginBottom: '10px' }}
          />

          {/* Product List with scroll */}
          <div
            style={{ height: '400px', overflowY: 'auto' }}
            onScroll={handleScroll}
          >
            {availableProducts.map((prod) => (
              <ListItem key={prod.id}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox

                      checked={selectedProducts.some(
                        (selected) => selected.product.id === prod.id && !selected.variantId
                      )}
                      onChange={() => handleSelect(prod, null)} // Product selected without variant
                    />
                    <ListItemText primary={prod.title} />
                  </div>

                  {/* List of variants with checkboxes */}
                  {prod?.variants?.map((variant) => (
                    <div key={variant.id}>
                      <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '20px' }}>
                        <Checkbox
                          checked={selectedProducts.some(
                            (selected) => selected.product.id === prod.id && selected.variantId === variant.id
                          )}
                          onChange={() => handleSelect(prod, variant)} // Variant selected
                        />
                        <ListItemText primary={variant.title} />
                      </div>
                    </div>
                  ))}
                </div>
              </ListItem>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div style={{ textAlign: 'center', padding: '10px' }}>
                <CircularProgress size={24} />
              </div>
            )}
          </div>

          {/* Add Product Button */}
          <AddProductButton handleAddProduct={handleAddProduct} />
        </div>
      </Drawer>
    </div>
  );
};

export default ProductPicker;

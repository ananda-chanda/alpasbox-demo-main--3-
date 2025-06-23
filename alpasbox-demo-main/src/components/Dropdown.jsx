import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dropdown() {
  const [mainCategories, setMainCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch main categories from the first API using Axios
  useEffect(() => {
    axios.post('https://admin.urbantyohar.com/api/main-category')
      .then((response) => {
        if (response.data && response.data.data) {
          setMainCategories(response.data.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching main categories:', error);
      });
  }, []);

  // Fetch categories based on selected main category
  useEffect(() => {
    if (selectedMainCategory) {
      axios.post(`https://admin.urbantyohar.com/api/all-category?maincat_id=${selectedMainCategory}`)
        .then((response) => {
          if (response.data && response.data.data) {
            setCategories(response.data.data);
          } else {
            setCategories([]); // Handle empty or invalid response
          }
        })
        .catch((error) => {
          console.error('Error fetching categories:', error);
        });
    }
  }, [selectedMainCategory]);

  // Fetch subcategories based on selected category
  useEffect(() => {
    if (selectedCategory) {
      axios.post(`https://admin.urbantyohar.com/api/subcategory?category_id=${selectedCategory}`)
        .then((response) => {
          if (response.data && response.data.data) {
            setSubCategories(response.data.data);
          } else {
            setSubCategories([]); // Handle empty or invalid response
          }
        })
        .catch((error) => {
          console.error('Error fetching subcategories:', error);
        });
    }
  }, [selectedCategory]);

  return (
    <div>
      {/* Main Category Dropdown */}
      <DropdownMenu
        title="Main Category"
        items={mainCategories}
        valueKey="id"
        displayKey="maincat_name"
        onChange={(value) => setSelectedMainCategory(value)}
      />

      {/* Category Dropdown */}
      {selectedMainCategory && (
        <DropdownMenu
          title="Category"
          items={categories}
          valueKey="id"
          displayKey="category_name"
          onChange={(value) => setSelectedCategory(value)}
        />
      )}

      {/* Subcategory Dropdown */}
      {selectedCategory && (
        <DropdownMenu
          title="Subcategory"
          items={subCategories}
          valueKey="id"
          displayKey="subcategory_name"
          onChange={() => {}} // Optional: Handle subcategory selection if needed
        />
      )}
    </div>
  );
}

// Generic Dropdown Menu Component
function DropdownMenu({ title, items, valueKey, displayKey, onChange }) {
  return (
<div className="mb-4">
 <label className="block text-sm font-semibold text-black mb-2">
   {title}
 </label>
 <div className="relative">
   <select
     onChange={(e) => onChange(e.target.value)}
     className="block w-full rounded-lg border-2 border-green-500 bg-green-100 px-4 py-3
                text-black shadow-md hover:border-green-600
                focus:border-green-700 focus:ring-2 focus:ring-green-500 
                focus:ring-opacity-30 focus:outline-none appearance-none
                transition-colors duration-200 text-sm"
     style={{ color: 'black' }}
   >
     <option value="" className="text-black bg-green-100">
       Select {title}
     </option>
     {items.map((item) => (
       <option 
         key={item[valueKey]} 
         value={item[valueKey]}
         className="text-black bg-green-100"
         style={{ color: 'black' }}
       >
         {item[displayKey]}
       </option>
     ))}
   </select>
   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
     <svg 
       className="h-5 w-5 text-black" 
       fill="none"
       stroke="currentColor"
       viewBox="0 0 24 24"
     >
       <path 
         strokeLinecap="round"
         strokeLinejoin="round"
         strokeWidth="2"
         d="M19 9l-7 7-7-7"
       />
     </svg>
   </div>
 </div>
</div>
  );
}

export default Dropdown;

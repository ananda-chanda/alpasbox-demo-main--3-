import React from 'react';
import { useParams } from 'react-router-dom';
import AllVideos from './AllVideo';
import AllCards from './AllCards';
import Stationary from './Stationary';

function DynamicCategoryPage() {
  const { maincat_name, category_id, category_name } = useParams();

  // Revert the modified `maincat_name` to match original values
  const normalizedMainCatName = maincat_name.replace(/-/g, ' ');

  // Conditional rendering based on `maincat_name` or other params
  if (normalizedMainCatName === 'Invitation Video') {
    return <AllVideos />;
  } else if (normalizedMainCatName === 'Invitation Card') {
    return <AllCards />;
  } else if (normalizedMainCatName === 'Stationary') {
    return <Stationary />;
  } else {
    return <div>Page not found: {normalizedMainCatName}</div>;
  }
}

export default DynamicCategoryPage;

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BadProductTable from '../../components/Analysis/BadProductTable';

export default function BadProductPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const products = location.state?.products;

  useEffect(() => {
    // Set document title
    document.title = "Detail Menu Kurang Laku | Penjualan Angkringan";
    
    // Redirect back to analysis if no data found in state
    if (!products) {
      navigate('/', { replace: true });
    }
  }, [products, navigate]);

  if (!products) return null;

  return (
    <div className="w-full max-w-[1600px] mx-auto animate-in fade-in duration-300">
      <BadProductTable products={products} isFullPage={true} />
    </div>
  );
}

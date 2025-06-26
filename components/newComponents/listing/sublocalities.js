import { useRouter } from 'next/router';
import { useState } from 'react';

function Sublocalities({ sublocality }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = (sublocality) => {
    setLoading(true);  
    const searchQuery = [{ title: `${sublocality}`, type: "subLocality" }];
    localStorage.setItem("SearchNames", JSON.stringify(searchQuery));

   
    setTimeout(() => {
      router.push('/listing');
    }, 500); 
  };

  return (
    <div className='sublocalities-item'>
      <div className='sub-name'>
        <button 
          className='sub-name-btn' 
          onClick={() => handleClick(sublocality)}
          disabled={loading}  
          style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Loading...' : `Properties in ${sublocality}`}
        </button>
      </div>
    </div>
  );
}

export default Sublocalities;

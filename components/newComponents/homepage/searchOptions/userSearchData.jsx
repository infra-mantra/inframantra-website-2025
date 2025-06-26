import { useState } from 'react';

function useSearchData() {
  const [searchData, setSearchData] = useState({
    selections: []
  });


  const updateSelections = (selections) => {
    setSearchData(prevData => ({ ...prevData, selections }));
  };

  return {
    searchData,
    updateSelections
  };
}

export default useSearchData;

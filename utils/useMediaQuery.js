  import { useState, useEffect } from "react";

  function useMediaQuery(breakpoint) {
    const [matches, setMatches] = useState(false); 

    useEffect(() => {
      const handleResize = () => {
        setMatches(window.innerWidth > breakpoint);
      };

      handleResize(); 
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [breakpoint]);

    return matches;
  }

  export default useMediaQuery;

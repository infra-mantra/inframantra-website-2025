  import { useState, useEffect } from "react";

  function useMediaQuery(breakpoint) {
    const [matches, setMatches] = useState(false); // Default to `false` to match server rendering.

    useEffect(() => {
      // Only run on the client.
      const handleResize = () => {
        setMatches(window.innerWidth > breakpoint);
      };

      handleResize(); // Set the initial value on mount.

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [breakpoint]);

    return matches;
  }

  export default useMediaQuery;

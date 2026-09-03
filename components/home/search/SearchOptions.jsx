import { useState, useEffect } from "react";

import CustomizedHook from "../../shared/search/SearchAutocomplete.jsx";
import { SearchBarSkeleton } from "../HomeSkeletons.jsx";

import styles from "./SearchOptions.module.css"; // Assuming you have a CSS module for styling

const SearchOptions = () => {
  const [autocompleteSelections, setAutocompleteSelections] = useState([]);

  // Dropped along with the `location` prop below: setLocation was never called,
  // so location was permanently undefined and CustomizedHook never read it.
  // `useRouter` and an `isMobile` state were also unused — isMobile was written
  // on every resize but never read, so it only forced extra re-renders.
  const [isDesktop, setIsDesktop] = useState(true);
  // Which layout to draw depends on window.innerWidth, which does not exist during
  // SSR. Rendering either branch on the server means half of all visitors watch it
  // restyle itself on hydration, so a placeholder covers that single frame instead.
  const [mounted, setMounted] = useState(false);

  const checkScreenWidth = () => {
    setIsDesktop(window.innerWidth >= 769); // You can adjust the threshold for desktop here
  };
  useEffect(() => {
    checkScreenWidth();
    setMounted(true);
    window.addEventListener("resize", checkScreenWidth);

    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  // Sized from the real bar's own CSS at both breakpoints, so this swap moves nothing.
  if (!mounted) return <SearchBarSkeleton />;

  return (
    <>
      {isDesktop ? (
        <div className={styles.searchOptionsWrapper}>
          <div className={styles.searchOptionsFlexContainer}>
            <CustomizedHook onSearch={setAutocompleteSelections} />
          </div>
        </div>
      ) : (
        <div className={styles.searchOptionsWrapper}>
          <CustomizedHook onSearch={setAutocompleteSelections} />
          <div className={styles.searchOptionsMobileFlexContainer}></div>
        </div>
      )}
    </>
  );
};

export default SearchOptions;

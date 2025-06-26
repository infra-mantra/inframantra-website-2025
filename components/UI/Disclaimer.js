import Link from "next/link";
import { useState } from "react";

const Disclaimer = (props) => {
  const [disclaimer, setDisclaimer] = useState(true);

  return (
    <>
      {disclaimer && (
        <div className="disclaimer bottom">
          <div className="inner">
            <p>
              Inframantra India Private Limited will take all possible measures
              to avoid any misrepresentation, fraud, illegal and unlawful
              action/inaction by any person using its services but does not
              guarantee the accuracy, correctness, and reliability of any such
              information/content or users. As a user, you are expected and
              assumed to be alert and check the accuracy and correctness of any
              information submitted by any user on the website of Inframantra.
              Further, before using or putting into use any available
              information, or draft document you must consult a Legal
              practitioner.
              <Link href="#">
                <a>Read more</a>
              </Link>
              .
            </p>
            <div className="close" onClick={() => setDisclaimer(false)}>
              &#10006;
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Disclaimer;

import React, { useState } from "react";
import { useRouter } from "next/router"; // Next.js router for dynamic URL handling

// Share component
const Share = ({ content }) => {
  const [copySuccess, setCopySuccess] = useState("");
  // Get the current page's URL
  const router = useRouter();
  const url = `https://inframantra.com${router.asPath}`; // Combine base URL with the current path

  const handleCopy = () => {
    const textToCopy = "Link copied"; // Replace this with your actual text
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopySuccess("Link copied");
        setTimeout(() => setCopySuccess(""), 2000); // Clear message after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        setCopySuccess("Failed to copy text.");
      });
  };

  return (
    <div>
      <div className="share">
        {/* WhatsApp Share */}
        <a
          href={`https://api.whatsapp.com//send?text=${url}`}
          title="Share on WhatsApp" // Tooltip added here
          className="menu-item whatsapp_share_btn"
          target="_blank"
          rel="noreferrer"
        >
          {/* WhatsApp Icon */}
          <img src="/icons/share/whatapp.png" alt="WhatsApp" />
        </a>
        
        {/* LinkedIn Share */}
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}`}
          title="Share on LinkedIn" // Tooltip added here
          className="menu-item linkedin_share_btn"
          target="_blank"
          rel="noreferrer"
          style={{ marginBottom: "4px" }}
        >
          {/* LinkedIn Icon */}
          <img src="/icons/share/linkdin.png" alt="LinkedIn" height="29px" width="29px" />
        </a>

        {/* Facebook Share */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
          title="Share on Facebook" // Tooltip added here
          className="menu-item facebook_share_btn"
          target="_blank"
          rel="noreferrer"
          style={{ marginBottom: "8px" }}
        >
          {/* Facebook Icon */}
          <img src="/icons/share/facebook.png" alt="Facebook" />
        </a>

        {/* Twitter Share */}
        <a
          href={`https://twitter.com/intent/tweet?url=${url}`}
          title="Share on Twitter" // Tooltip added here
          className="menu-item twitter_share_btn"
          target="_blank"
          rel="noreferrer"
          style={{
            width: "27px",
            height: "27px",
            marginBottom: "6px",
          }}
        >
          {/* Twitter Icon */}
          <img src="/icons/share/x.png" alt="Twitter" height="29px" width="29px" />
        </a>

        {/* Copy Link (Email Share) */}
        <p
          className="menu-item twitter_copy_clip"
          style={{ display: "inline-block" }}
          onClick={handleCopy}        >
          <img src="/icons/share/Vector.svg" alt="Email" />
        </p>

        {/* Success Message */}
        {copySuccess && (
          <p
            className="menu-item twitter_copy_clip"
            style={{ display: "inline-block", color: "green" }}
          >
            {copySuccess}
          </p>
        )}
      </div>
    </div>
  );
};

export default Share;

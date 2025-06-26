import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import PropertyWrapper from './propertyWrapper';
import PopUpForm from '../../../../../components/detailSections/CTA_NEW.js';
import 'react-image-gallery/styles/css/image-gallery.css';

// Set PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PropertyBrochure({ pdfUrl, name, leftSection }) {
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [popForm, setPopForm] = useState(false);
  const [error, setError] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const brochuresRef = useRef(null);

  // Set width of the container
  useEffect(() => {
    const updateWidth = () => {
      if (brochuresRef.current) {
        setContainerWidth(brochuresRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Optional: IntersectionObserver to trigger `leftSection` if passed
  useEffect(() => {
    if (!leftSection) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.5) {
          leftSection(false);
        }
      },
      { threshold: 0.5 }
    );
    if (brochuresRef.current) observer.observe(brochuresRef.current);
    return () => {
      if (brochuresRef.current) observer.unobserve(brochuresRef.current);
    };
  }, [leftSection]);

  // PDF load success
  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const togglePopUp = () => setPopForm((prev) => !prev);
  const onClickOff = (val) => setPopForm(val);

  const handleNextPage = () => {
    if (pageNumber < numPages) setPageNumber((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) setPageNumber((prev) => prev - 1);
  };

  return (
    <PropertyWrapper id="brochure" ref={brochuresRef}>
      <div className="aboutProjectWrapper">
        {popForm && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.6)',
              zIndex: 999,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div style={{ position: 'relative', width: '80%', maxWidth: '600px' }}>
              <PopUpForm
                popUpenable={popForm}
                onClickOff={onClickOff}
                text="To download brochure"
                pdf={pdfUrl}
                name={name}
              />
            </div>
          </div>
        )}

        <h2 className="aboutProjectHeader">Brochure</h2>

        <div className="pdf-book-viewer">
          {error ? (
            <p>Error loading PDF: {error}</p>
          ) : (
            <div className="pdf-container">
              <button
                className="nav-button"
                onClick={handlePreviousPage}
                disabled={pageNumber === 1}
              >
                &lt;
              </button>

              <div className="pdf-page">
                <Document
                  file={pdfUrl}
                  onLoadSuccess={onLoadSuccess}
                  onLoadError={(err) => setError(err.message)}
                >
                  <Page
                    pageNumber={pageNumber}
                    width={containerWidth * 0.9 || 600}
                    loading="Loading page..."
                  />
                </Document>
              </div>

              <button
                className="nav-button"
                onClick={handleNextPage}
                disabled={pageNumber === numPages}
              >
                &gt;
              </button>
            </div>
          )}

          <div className="download_btn">
            <div className="vn-orange">
              <button className="btn-wrap" onClick={togglePopUp}>
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </div>
    </PropertyWrapper>
  );
}

export default PropertyBrochure;

import React, { useEffect, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { pdfToImages } from './pdfToImages';

const BookFlip = ({ pdfUrl }) => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAndConvertPdf = async () => {
            try {
                // console.log('Fetching and converting PDF...');
                const pageImages = await pdfToImages(pdfUrl);
                // console.log('PDF conversion complete', pageImages);
                setPages(pageImages);
                setLoading(false);
            } catch (err) {
                console.error('Error converting PDF:', err);
                setError(err);
                setLoading(false);
            }
        };

        fetchAndConvertPdf();
    }, [pdfUrl]);

    if (loading) {
        return <div>Loading PDF...</div>;
    }

    if (error) {
        return <div>Error loading PDF: {error.message}</div>;
    }

    return (
        <HTMLFlipBook width={300} height={500} showCover={true}>
            {pages.map((page, index) => (
                <div key={index}>
                    <img src={page} alt={`Page ${index + 1}`} />
                </div>
            ))}
        </HTMLFlipBook>
    );
};

export default BookFlip;

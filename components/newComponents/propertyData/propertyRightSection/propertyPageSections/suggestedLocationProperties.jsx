import React, { useState, useEffect } from 'react';

// import './propertySectionStyles.css';

const suggestedLocationPropertiesStyles = {
    container: {
        width: '32.5vw',
        borderRadius: '10px',
        height: '50vh',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '500px 500px',
        marginTop: '30px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
    },
    textWrapper: {
        position: 'relative',
        zIndex: 1,
        color: '#fff',
        textAlign: 'center',
    }
};

function SuggestedLocationProperties({ bgdImg, bannerTxt, handleClick}) {
    const [isDesktop, setIsDesktop] = useState(true);
    const [isMobile, setIsMobile] = useState(true);
    const checkScreenWidth = () => {
        setIsDesktop(window.innerWidth >= 768); // You can adjust the threshold for desktop here
        setIsMobile(window.innerWidth <= 768);
    };
 

    useEffect(() => {
        checkScreenWidth();
        window.addEventListener('resize', checkScreenWidth);

        return () => {
            window.removeEventListener('resize', checkScreenWidth);
        };
    }, []);

    return (
        <div style={suggestedLocationPropertiesStyles.container} className='suggestedPropertiesContainer'>
            <div
                style={{
                    ...suggestedLocationPropertiesStyles.background,
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3),
                       rgba(0, 0, 0, 0.3)),url(${bgdImg})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                }}
            />
            <div className='suggestedLocationPropertiesTextWrapper'>
               
                <h4>{bannerTxt}</h4>
                
                <button
                    onClick={handleClick}
                    className='search-button'
                    style={{
                        width: isDesktop ? '20vw' : '60vw',
                        padding: '5px 2px',
                        fontWeight: '900',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px',
                    }}
                >
                    Explore
                </button>
            </div>
        </div>
    );
}

export default SuggestedLocationProperties;

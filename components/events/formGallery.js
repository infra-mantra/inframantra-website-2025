    import React from "react";
    import EventGallery from "./EventGallery";
    import RegistrationForm from "./RegistrationForm";



    const eventImages = [
         {
        src: "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-event-expo/gallery/event-3-f.webp",
        alt: "NRI Event Expo 3",
        caption: "Happy Clients at our Dream Home Fest ",
    },
    {
        src: "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-event-expo/gallery/event-1-f.webp",
        alt: "NRI Event Expo 1",
        caption: "Successful property showcase",
    },
    {
        src: "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-event-expo/gallery/event-2-f.webp",
        alt: "NRI Event Expo 2",
        caption: "Happy Clients at our Dream Home Fest",
    },
      {
        src: "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-event-expo/gallery/01.webp",
        alt: "NRI Event Expo 2",
        caption: "Clients engaging in detailed property discussions",
    },
     
       {
        src: "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-event-expo/gallery/02.webp",
        alt: "NRI Event Expo 2",
        caption: "Happy Clients at our Dream Home Fest",
    },
        {
        src: "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-event-expo/gallery/03.webp",
        alt: "NRI Event Expo 2",
        caption: "Happy Clients at our Tulip Monsella Skyhub Showcase",
    },
         {
        src: "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-event-expo/gallery/04.webp",
        alt: "NRI Event Expo 2",
        caption: "Happy Clients at our Tulip Monsella Skyhub Showcase",
    },
          {
        src: "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-event-expo/gallery/05.webp",
        alt: "NRI Event Expo 2",
        caption: "Happy Clients at our Tulip Monsella Skyhub Showcases",
    },
              {
        src: "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-event-expo/gallery/06.webp",
        alt: "NRI Event Expo 2",
        caption: "Happy Clients at our Tulip Monsella Skyhub Showcase",
    },
                 {
        src: "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-event-expo/gallery/07.webp",
        alt: "NRI Event Expo 2",
        caption: "Happy Clients at our Dream Home Fest",
    },
                  {
        src: "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-event-expo/gallery/08.webp",
        alt: "NRI Event Expo 2",
        caption: "Clients engaging in detailed property discussions",
    },
   
    ];

    export default function NRIPropertyExpoRegistration() {
    const handleSubmit = async (formData) => {
        // formData = { fullName, email, mobile, city }
        const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error("Registration failed");
        return response.json();
    };

    return (
        <section className="reg-section">
        <div className="reg-header">
        
          
        </div>
        
   <h2 className="reg-title">
            Reserve Your Exclusive Access
            </h2>
        <div className="reg-container">
           
            <div className="reg-gallery-col">
            <EventGallery images={eventImages} autoplay autoplayInterval={4500} />
            </div>
            <div className="reg-form-col">
            <RegistrationForm  />
            </div>
        </div>

        <style jsx>{`
            .reg-section {
                width: 100%;
    padding: 0px 70px;
    background: #fff;
    max-width: 1403px;
    margin: 0px auto;
            }
            .reg-section::before {
            content: '';
            position: absolute;
            inset: 0;
            background:
                radial-gradient(ellipse 600px 400px at 20% 10%, rgba(201, 169, 97, 0.05), transparent),
                radial-gradient(ellipse 500px 300px at 90% 90%, rgba(201, 169, 97, 0.03), transparent);
            pointer-events: none;
            }

            .reg-header {
            position: relative;
            z-index: 2;
            text-align: center;
            margin-bottom: 44px;
            }

            .reg-eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            font-size: 11px;
            letter-spacing: 4px;
            text-transform: uppercase;
            color: #d4a64a;
            font-weight: 500;
            margin-bottom: 14px;
            }
            .reg-eyebrow::before, .reg-eyebrow::after {
            content: '';
            width: 24px;
            height: 1px;
            background: #c9a961;
            }
            .reg-title {
                font-size: 1.8rem;
        line-height: 1.08;
        font-weight: 700;
        color: #d4a64a;
        display:flex;
          
       
            }
            .reg-container {
            position: relative;
            z-index: 2;
            max-width: 1280px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1.1fr 1fr;
            gap: 50px;
            align-items: stretch;
            }

            .reg-gallery-col,
            .reg-form-col {
            display: flex;
            flex-direction: column;
            }

            @media (max-width: 1024px) {
            .reg-container {
                grid-template-columns: 1fr;
                gap: 40px;
                max-width: 600px;
            }
            }

            @media (max-width: 600px) {
            .reg-section {
                padding: 2px 1rem;
            }
                  .reg-gallery-col{
                  order:1}
            .reg-title{
            font-size:20px;
              padding: 0px 0px;
            }
            .reg-header {
                margin-bottom: 32px;
            }
            }
        `}</style>
        </section>
    );
    }

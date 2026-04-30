    import React from "react";
    import EventGallery from "./EventGallery";
    import RegistrationForm from "./RegistrationForm";

    /**
     * Drop this into your Next.js page.
     *
     * The two components are completely self-contained.
     * The page-level layout (2-column grid, centered title, white bg)
     * is handled here with styled-jsx so you don't need a third component.
     */

    const eventImages = [
    {
        src: "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-event-expo/1.jpg",
        alt: "NRI Event Expo 1",
        caption: "Highlights from the NRI Event Expo",
    },
    {
        src: "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-event-expo/2.jpg",
        alt: "NRI Event Expo 2",
        caption: "Attendees engaging with projects",
    },
    {
        src: "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-event-expo/3.jpg",
        alt: "NRI Event Expo 3",
        caption: "Successful property showcase",
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
        
            <h2 className="reg-title">
            Reserve Your Exclusive Access
            </h2>
        </div>

        <div className="reg-container">
            <div className="reg-gallery-col">
            <EventGallery images={eventImages} autoplay autoplayInterval={4500} />
            </div>
            <div className="reg-form-col">
            <RegistrationForm onSubmit={handleSubmit} />
            </div>
        </div>

        <style jsx>{`
            .reg-section {
            position: relative;
            background: #fff;
            padding: 11px 12px;
            overflow: hidden;
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
        margin: 0 0 32px;
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
                padding: 50px 16px;
            }
            .reg-header {
                margin-bottom: 32px;
            }
            }
        `}</style>
        </section>
    );
    }

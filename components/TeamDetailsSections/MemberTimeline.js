import { useRef, useEffect } from 'react';
import { gsap } from "gsap";
import Section from '../UI/Section';
import Image from 'next/image';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import NoImage from '../UI/NoImage';
gsap.registerPlugin(ScrollTrigger);

const MemberTimeline = ({journey, content}) => {

const revealRefs = useRef([]);
revealRefs.current = [];

useEffect(() => {

    revealRefs.current.forEach((el, index) => {
        gsap.to(el, {
        ease: 'none',
        scrollTrigger: {
            // id: `tml-dot-${index+1}`,
            trigger: el,
            start: 'top center',
            end: '+=100',
            // markers: true,
            toggleActions: 'play none none reverse',
            onEnter() {
                el.classList.add('active');
            },
            onLeaveBack() {
                el.classList.remove('active');
            },
        }
        });
    });


    revealRefs.current.forEach((el, index) => {
        gsap.to(`#mem-tml-${index+1}` , {
        scrollTrigger: {
            id: `mem-tml-${index+1}`,
            trigger: el,
            start: 'top center',
            end:'+=100',
            // markers: true,
            scrub: 1,
        },
            webkitClipPath: 'inset(0% 0% 0%)',
            clipPath: 'inset(0% 0% 0%)'
        });
    });

});

const addToRefs = el => {
if (el && !revealRefs.current.includes(el)) {
    revealRefs.current.push(el);
}
};
    return journey.length > 0 ? (
        <Section classes="sec-p member-timeline" pageWidth="fluid">
            <div className="tml-container">
                <div className="section-head text-center">
                    <h2>{content.name} Journey</h2>
                    <p>{content.description}</p>
                </div>
                <div className="timeline-with-img">
                    <div className="sticky-img-wrap">
                        {journey.map((data, index)=>(
                            <div key={`image-${data.id}`} className="mem-tml-img" id={`mem-tml-${index+1}`}>
                                {data.image ?
                                  <picture>
                                      <img src={data.image} alt='Timeline Images' layout="fill" objectFit='cover' />
                                  </picture>
                                : <NoImage/>}
                            </div>
                        ))}
                    </div>
                    <div className="timeline-wrapper">
                        <div className="main-dot"></div>
                        {journey.map((data, index)=>(
                            <div key={data.id} className="timeline-item"  ref={addToRefs} id={index+1} target-img="mem-tml-1">
                                <div className="tml-dot"></div>
                                <div className="tml-content">
                                    <h3>{data.title}</h3>
                                    <div key={`image-${data.id}`} className="mob-show mobile-time-image">
                                        {data.image ?
                                          <picture>
                                             <img src={data.image} alt='Timeline Images' layout="fill" objectFit='contain' objectPosition='left' />
                                          </picture>
                                        : <NoImage/>}
                                    </div>
                                    <p>{data.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div> 
            </div>
        </Section>
    ) : ''
}

export default MemberTimeline;
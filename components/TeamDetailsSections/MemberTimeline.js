import { useRef, useEffect } from 'react';
import { gsap } from "gsap";
import Section from '../UI/Section';
import Image from 'next/image';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import NoImage from '../UI/NoImage';
import style from './memberTimeline.module.css';
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
        <Section classes={`${style.secP} ${style.memberTimeline}`} pageWidth="fluid">
            <div className={style.tmlContainer}>
                <div className={`${style.sectionHead} ${style.textCenter}`}>
                    <h2>{content.name} Journey</h2>
                    <p>{content.description}</p>
                </div>
                <div className={style.timelineWithImg}>
                    <div className={style.stickyImgWrap}>
                        {journey.map((data, index)=>(
                            <div key={`image-${data.id}`} className={`${style.memTmlImg}`} id={`mem-tml-${index+1}`}>
                                {data.image ?
                                  <picture>
                                      <img src={data.image} alt='Timeline Images' layout="fill" objectFit='cover' />
                                  </picture>
                                : <NoImage/>}
                            </div>
                        ))}
                    </div>
                    <div className={style.timelineWrapper}>
                        <div className={style.mainDot}></div>
                        {journey.map((data, index)=>(
                            <div key={data.id} className= {style.timelineItem}  ref={addToRefs} id={index+1} target-img="mem-tml-1">
                                <div className={style.tmlDot}></div>
                                <div className={style.tmlContent}>
                                    <h3>{data.title}</h3>
                                    <div key={`image-${data.id}`} className={`${style.mobShow} ${style.mobileTimeImage}`}>
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
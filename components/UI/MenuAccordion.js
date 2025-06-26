import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const MenuAccordion = ({ title, links }) => {
  const [isActive, setIsActive] = useState(true);

  return (
    <div className="menu-accordion-item">
      <div className="menu-accordion-title" role="button" onClick={() => setIsActive(!isActive)}>
        <div>{title}</div>
        <div className='icon'>{isActive ? '-' : '+'}</div>
      </div>
      {isActive && <div className="accordion-content">{
        links.map((link_item, index) => (
            <Link href={link_item.link_url} key={index}>
                <a className='smenu-link-item'>
                  <div className="icon">
                    <Image src={link_item.icon} alt="icon" layout='fill' objectFit='contain'/>
                  </div>
                  <h4>{link_item.link_title}</h4>
                </a>
            </Link>
        ))
      }</div>}
    </div>
  );
};

export default MenuAccordion;
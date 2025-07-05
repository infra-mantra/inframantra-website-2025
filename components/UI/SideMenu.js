import React from 'react'
import MenuAccordion from './MenuAccordion.js'
import Link from 'next/link'
import Image from 'next/image'

function SideMenu({data}) {

    let menu_items = [
        {
            title: 'Quick links',
            links : [
                {
                    icon: '/assets/images/link-1.png',
                    link_title: 'Home',
                    link_url: '/'
                },
                {
                    icon: '/assets/images/link-2.png',
                    link_title: 'About',
                    link_url: '/about-us'
                },
                {
                    icon: '/assets/images/link-3.png',
                    link_title: 'Careers',
                    link_url: '/careers'
                },
                {
                    icon: '/assets/images/link-4.png',
                    link_title: 'Contact',
                    link_url: '/contact-us'
                },
            ],
        },
    ]

    let extra_links = [
        {
            link: '/page/terms-conditions',
            link_title: "Terms and conditionss",
        },
        {
            link: '/page/privacy-policy',
            link_title: "Privacy policy",
        },
        {
            link: '/page/disclaimer',
            link_title: "Disclaimer",
        },
        {
            link: '/page/user-agreement',
            link_title: "User Agreement",
        },
    ]

    let extra_info = [
        {
            link: 'tel: +919069142141',
            link_title: "+91 9069 142 141",
        },
        {
            link: 'mailto: info@inframantra.com',
            link_title: "info@inframantra.com",
        },
        {
            link: '#',
            Name: 'Corporate Office:',
            link_title: `33-B, 2nd and 3rd Floor, Sector 32 Gurugram,
            Haryana, India 122002`,
        },
    ]

    return (
        <div className='sidemenu'>
            <div className="sidemenu-wrapper">
            <div className='desk-show'>
            { menu_items.map((menu_item, index) => (
                <MenuAccordion title={menu_item.title}  links={menu_item.links} key={index}/>
            )) }
            </div>

                <div className="site-config">
                    
                    <div className="extra-links">
                        <ul className='smenu-links mob-show'>
                            <li className='smenu-link'><Link href='/'><a>Home</a></Link></li>
                            <li className='smenu-link'><Link href='/about-us'><a>About Us</a></Link></li>
                            <li className='smenu-link'><Link href='/careers'><a>Careers</a></Link></li>
                            <li className='smenu-link'><Link href='/contact-us'><a>Contact Us</a></Link></li>
                            <li className='smenu-link'><Link href='/home-loans'><a>Loan</a></Link></li>
                            <li className='smenu-link'><Link href='/property-management-services'><a>Property Management</a></Link></li>
                            <li className='smenu-link'><Link href='/home-interiors'><a>Home Interiors</a></Link></li>
                            <li className='smenu-link'><Link href='/listing'><a>Properties</a></Link></li>
                        </ul>
                        <ul className='smenu-links'>
                            <li className="smenu-links">
                                <Link href="/home-loan">
                                     <a>Home Loan</a>
                                </Link>
                            </li>
                            <li className="smenu-links">
                                <Link href="/blogs">
                                    <a >Blogs</a>
                                </Link>
                            </li>
                            <li className="smenu-links">
                                <Link href="/media">
                                     <a>Media</a>
                                </Link>
                            </li>
                            <li className="smenu-links">
                                <Link href="/testimonials">
                                     <a>Testimonials</a>
                                </Link>
                            </li>
                            <li className="smenu-links">
                                <Link href="/faq">
                                     <a>FAQ’s</a>
                                </Link>
                            </li>
                        </ul>
                        <ul className='smenu-links'>
                            {extra_links.map((link_item, index)=>(
                                <li className='smenu-link' key={index}><Link href={link_item.link}><a>{link_item.link_title}</a></Link></li>
                            ))}
                        </ul>
                    </div>
                     <div className="extra-info">
                        <ul className="menu-socials">
                            <li>
                                <Link href={data === null ? '' : data.setting[0].facebook}>
                                    <a >
                                    <div className="icon">
                                        <Image src="/assets/images/fb-icon.png" alt="insta" layout="fill" objectFit="contain" />
                                    </div>
                                    </a>
                               </Link>
                            </li>
                            <li>
                                <Link href={data === null ? '' : data.setting[0].instagram}>
                                     <a>
                                        <div className="icon">
                                           <Image src="/assets/images/insta-icon.png" alt="insta" layout="fill" objectFit="contain" />
                                        </div>
                                     </a>
                                </Link>
                            </li>
                            <li>
                                <Link href={data === null ? '' : data.setting[0].twitter}>
                                    <a>
                                    <div className="icon">
                                        <Image src="/assets/images/twitter-icon.png" alt="insta" layout="fill" objectFit="contain" />
                                    </div>
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <Link href={data === null ? '' : data.setting[0].linkedin}>
                                    <a>
                                    <div className="icon">
                                        <Image src="/assets/images/linkedIn-icon.png" alt="insta" layout="fill" objectFit="contain" />
                                    </div>
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <Link href={data === null ? '' : data.setting[0].youtube}>
                                    <a>
                                         <div className="icon">
                                        <Image src="/assets/images/youtube-icon.png" alt="insta" layout="fill" objectFit="contain" />
                                    </div>
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <Link href={data === null ? '' : data.setting[0].pinterest}>
                                    <a>
                                         <div className="icon">
                                        <Image src="/assets/images/Pinterest-icon.png" alt="insta" layout="fill" objectFit="contain" />
                                    </div>
                                    </a>
                                </Link>
                            </li>
                        </ul>
                        <ul className='smenu-info-items'>
                            {extra_info.map((extra_info_item, index)=>(
                                <li className='smenu_info_item' key={index}>
                                {extra_info_item.Name ? 
                                <h4>{extra_info_item.Name}</h4> 
                                : 
                                <h4>
                                    {extra_info_item.Name}
                                </h4>}
                                <Link href={extra_info_item.link}>
                                    <a>{extra_info_item.link_title}</a>
                                </Link></li>
                            ))}
                        
                        </ul>
                     </div>
                   
                </div>
            </div>
        </div>
    )
}

export default SideMenu
import { FaHome } from "react-icons/fa";
import { PiBuildingApartmentLight } from "react-icons/pi";
import { GrServices } from "react-icons/gr";
import { MdContactMail } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { MdOutlineSpeakerNotes } from "react-icons/md";
import { MdOutlinePermMedia } from "react-icons/md";
import { MdOutlineGavel } from "react-icons/md";
import { MdOutlinePolicy } from "react-icons/md";
import { MdOutlineReportProblem } from "react-icons/md";
import { PiHandshakeThin } from "react-icons/pi";

export const primaryMobileNavValues = [{
    title:'Home',
    icon:<FaHome />,
    nav:''
},
{
    title:'Properties',
    icon:<PiBuildingApartmentLight />,
     nav:'property-listing/city/Gurgaon'
},
{
    title:'Services',
    icon:<GrServices />,
     nav:'our-services'
},
{
    title:'Contact Us',
    icon:<MdContactMail />,
     nav:'contact-us'
}
]
export const secondaryMobileNavValues = [{
    title:'About Us',
    icon:<IoIosPeople />,
     nav:'about-us'
},
{
    title:'Testimonials',
    icon:<MdOutlineSpeakerNotes />,
     nav:'testimonials'
},
{
    title:'Media And Blogs',
    icon:<MdOutlinePermMedia />,
     nav:'blog'
},
]
export const tertiaryMobileNavValues = [{
    title:'Terms And Conditions',
    icon:<MdOutlineGavel  />,
    nav:'page/terms-conditions'
},
{
    title:'Privacy Policy',
    icon:<MdOutlinePolicy />,
    nav:'page/privacy-policy'
},
{
    title:'Disclaimer',
    icon:<MdOutlineReportProblem />,
    nav:'page/disclaimer'
},
{
    title:'User Agreement',
    icon:<PiHandshakeThin />,
    nav:'page/user-agreement'
}]
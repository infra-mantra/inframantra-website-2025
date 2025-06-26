import {useState} from "react";
import { AiOutlineHeart } from "react-icons/ai";

const compareButton = (props) => {


    const { selectedItems = [] } = props; 
    
 
    const [compare,setCompare] = useState(false); 
    const compareHandler = () => {
       compare ? setCompare(false) : setCompare(true)
    }
     
    return (
        <div className="compare-button">
            <div > 
                <AiOutlineHeart className={`Compare-button ${compare ? 'active' : '' }`}/>
                {selectedItems.length > 0 && (
                   <span className="compare-count">{selectedItems.length}</span>
                 )} 
            </div>
         </div>
    ); 
};

export default compareButton;

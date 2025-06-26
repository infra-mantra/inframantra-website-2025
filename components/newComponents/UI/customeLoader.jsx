import React from "react";
// import './loader.css';

const Loader = () => {

    return (
        <div class="form-loader">
            <div class="loader">
                <div class="lds-ripple">
                    <img src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/loader/loader.gif"/>
                </div>
            </div>
        </div>
    )
}

export default Loader;
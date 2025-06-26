import axios from "axios"
// import GetCookie from "./GetCookie";
const Ajax1 = async (action) => {
    // if(action.loader === true) { document.querySelector(".cs-loader").classList.remove("show") }
    // console.log("Api Set Up Checck", process.env.apiUrl1 + action.url);
    try {
        const resp = await axios({
            headers: {
                ...(action.token === true)
            },
            method: action.method ? action.method : 'GET',
            url: process.env.apiUrl1 + action.url,
            ...(action.data && { data: action.data})
        });
        // if(action.loader === true) {document.querySelector(".cs-loader").classList.remove("show") }
        return resp
    } catch (err) {
        // if(action.loader === true) { document.querySelector(".cs-loader").classList.remove("show") }
        return err.response
    }
}
export default Ajax1
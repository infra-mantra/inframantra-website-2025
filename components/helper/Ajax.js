import axios from "axios";
// import GetCookie from "./GetCookie";

const Ajax = async (action) => {

    try {

        // ============================================
        // GET SOURCE FROM LOCALSTORAGE
        // ============================================
        let source = "";

        if (typeof window !== "undefined") {
            source = localStorage.getItem("source") || "SEM";
        }

        // ============================================
        // MERGE SOURCE IN REQUEST DATA
        // ============================================
        const updatedData = {
            ...(action.data || {}),
            source
        };

        const resp = await axios({

            headers: {
                ...(action.token === true && {
                    'Authorization': GetCookie('token')
                })
            },

            method: action.method
                ? action.method
                : 'GET',

            url: process.env.apiUrl + action.url,

            ...(action.data && {
                data: updatedData
            })

        });

        return resp;

    } catch (err) {

        return err.response;

    }

}

export default Ajax;
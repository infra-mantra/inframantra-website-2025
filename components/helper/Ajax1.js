import axios from "axios";

const Ajax1 = async (action) => {

    try {

        console.log(process.env.apiUrl1 + action.url);
        console.log("REQUEST:", action);

        // ============================================
        // GET SOURCE FROM LOCALSTORAGE
        // ============================================
        let source = "SEM";

        if (typeof window !== "undefined") {
            source = localStorage.getItem("source");
        }

        console.log("SOURCE:", source);

        // ============================================
        // ENQUIRY PROJECT CONDITION
        // ============================================
        if (action.url === "/enquiry/project" && source) {

            let updatedData = {
                ...action.data
            };

            // ADS FLOW
            if (source === "ADS") {
                updatedData = {
                    ...updatedData,
                    Campaign: "SEM",
                    Source: "ADS",
                    projectName: "USA-EXPO (Event Specific)"
                };
            }

            // YUPP TV FLOW
            else if (source === "YUPP") {
                updatedData = {
                    ...updatedData,
                    Campaign: "SEM",
                    Source: "YUPP TV",
                    projectName: "USA-EXPO (Event Specific)"
                };
            }else if(source =="ADS(Email)"){
                  updatedData = {
                    ...updatedData,
                    Campaign: "SEM",
                    Source: "ADS(Email)",
                    projectName: "USA-EXPO (Event Specific)"
                };
            }else if(source == "google"){
                  updatedData = {
                    ...updatedData,
                    Campaign: "SEM",
                    Source: "Google",
                    projectName: "USA-EXPO (Event Specific)"
                };
            } else if(source == "KC_Searchad_26May"){
                  updatedData = {
                    ...updatedData,
                    Campaign: "SEM",
                    Source: "Google",
                   
                };
            }


            action.data = updatedData;

            // remove AFTER usage (safe testing behavior)
           localStorage.removeItem("source");
           localStorage.removeItem("utm_params"); 
        }
        

        console.log("FINAL DATA:", action.data);

        const resp = await axios({
            headers: {
                ...(action.token === true && {
                    Authorization: action.token
                })
            },
            method: action.method || "GET",
            url: process.env.apiUrl1 + action.url,
            ...(action.params && { params: action.params }),
            ...(action.data && { data: action.data })
        });

        return resp;

    } catch (err) {
        console.log("API ERROR:", err);
        return err.response;
    }
};

export default Ajax1;
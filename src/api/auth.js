


export const apii='https://goget-ef.website/wheel/public/api'
export const registerUser = async (userData) => {
    const response = await fetch(`${apii}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" , "accept": "application/json" }, body: JSON.stringify(userData) });
    const result = await response.json();

    
    if (!response.ok) {
       throw result;}
    return result;
}


export const loginUser = async (userData) => {
    const response = await fetch(`${apii}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json"  }, body: JSON.stringify(userData) });
    const result = await response.json();

    
    if (!response.ok) {
       throw result;}
    return result;
}



export const forgotPassword = async (email) => {
    const formData = new FormData();
    formData.append('email', email);

    const response = await fetch(`${apii}/auth/forgot-password`, { method: "POST",body:  formData });
    const data = await response.text();
    console.log(data);

    
   // if (!response.ok) {
      // throw new Error(data.message || "Failed to send password reset email");}
    return data;
}


export const logoutUser = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${apii}/auth/logout`, { method: "POST", headers: { "Authorization": `Bearer ${token}` } });
   return response.text()
 

    
    // if (!response.ok) {
    //    throw result;}
    // return result;
}

export const getProfile = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${apii}/profile`, { method: "GET", headers: { "Authorization": `Bearer ${token}` } });
    const result = await res.json();

    
    // if (!res.ok) {
    //    throw result;}
    return result;
}



export const requestUpdateotp = async (userData , token) => {
    try{
    const response = await fetch(`${apii}/profile`, { method: "PUT", headers: { "Content-Type": "application/json" , "accept": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify(userData) });
    const result = await response.json();
    console.log(result)

  
    if (!response.ok) {
       throw new Error(result.message || "Failed to update profile");
    }
    return result;}
    catch(error){
        throw error;
}
}


export const verifyOtp = async (email,otp , token) => {
    try{
    const response = await fetch(`${apii}/profile/verify-email-otp`, { method: "POST", headers: { "Content-Type": "application/json" , "accept": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify({ email, otp }) });
    const result = await response.json();

  
    if (!response.ok) {
       throw new Error(result.message || "otp not correct");}
    return result;}
    catch(error){
        throw error;
}
}


export const changePassword = async (current_password, new_password, confirm_password, token) => { 
     const formData = new FormData(); 
      formData.append("current_password", current_password); 
       formData.append("new_password", new_password); 
        formData.append("new_password_confirmation", confirm_password);
           const response = await fetch(`${apii}/profile/change-password`, {    method: "POST",    headers: {      Authorization: `Bearer ${token}`,      Accept: "application/json"    },    body: formData  }); 
             const data = await response.json(); 
               if (!response.ok)
                 {    throw new Error(data.message || "Failed to change password");  } 
                 return data; };



                 export const deleteAccount = async (token , password) => {  
                     const formData = new FormData(); 
      formData.append("password",password);
                    const response = await fetch(`${apii}/profile`, {    method: "DELETE",    headers: {      Authorization: `Bearer ${token}`,      Accept: "application/json"    } ,    body: formData  }); 
                   const data = await response.json();  
                  if (!response.ok) {    throw new Error(data.message || "Failed to delete account");  }   return data; };
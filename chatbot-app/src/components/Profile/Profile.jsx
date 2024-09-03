import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';

function Profile() {
    const tokenAccess = Cookies.get("accessToken");
    const tokenRefresh = Cookies.get("refreshToken");
    let decodedToken = "";
  
    if (tokenAccess && tokenRefresh) {
        try {
            decodedToken = jwtDecode(tokenAccess);
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    }

    const name = decodedToken ? decodedToken.name : "User";
    const email = decodedToken ? decodedToken.email : "Email";
    const password = decodedToken ? decodedToken.password : "Password";



    return (
    <div>
        <h1>Profile</h1>
        <p>Name: {name}</p>
        <p>Email: {email}</p>
        <p>Password: {password}</p>
      <h1>Profile</h1>
    </div>
  );
}
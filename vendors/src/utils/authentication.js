import cookie from "js-cookie"

export const setJwt = (jwt) => {
    //setting the cookie
    cookie.set("vendorJwt", jwt)
    return
}

export const getJwt = () => {
    const jwt = cookie.get("vendorJwt")
    console.log(jwt, "dadad")
    return jwt
}

import cookie from "js-cookie"

export const setJwt = (jwt) => {
    //setting the cookie
    cookie.set("jwt", jwt)
    return
}

export const getJwt = () => {
    const jwt = cookie.get("jwt")
    console.log(jwt, "dadad")
    return jwt
}

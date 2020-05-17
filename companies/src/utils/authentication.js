import cookie from "js-cookie"

export const setJwt = (jwt) => {
    //setting the cookie
    cookie.set("companyJwt", jwt)
    return
}

export const getJwt = () => {
    const jwt = cookie.get("companyJwt")
    return jwt
}

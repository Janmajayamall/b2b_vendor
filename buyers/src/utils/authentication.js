import cookie from "js-cookie"

export const setJwt = (jwt) => {
    //setting the cookie
    cookie.set("buyerJwt", jwt)
    return
}

export const getJwt = () => {
    console.log(jwt, "dadad")
    return jwt
}

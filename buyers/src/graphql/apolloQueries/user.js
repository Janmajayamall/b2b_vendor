import gql from "graphql-tag"

export const LOGIN_BUYER = gql`
    mutation loginBuyer($emailId: String!, $password: String!) {
        loginBuyer(userInput: { emailId: $emailId, password: $password }) {
            jwt
            profileCreated
            error
        }
    }
`

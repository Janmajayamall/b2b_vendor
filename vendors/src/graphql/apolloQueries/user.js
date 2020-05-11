import gql from "graphql-tag"

export const LOGIN_VENDOR = gql`
    mutation loginVendor($emailId: String!, $password: String!) {
        loginVendor(userInput: { emailId: $emailId, password: $password }) {
            jwt
            profileCreated
            error
        }
    }
`

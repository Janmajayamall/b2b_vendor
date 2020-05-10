import gql from "graphql-tag"

//mutations
export const REGISTER_BUYER = gql`
    mutation registerBuyer(
        $emailId: String!
        $password: String!
        $name: String!
        $contactNumber: String!
        $contactEmailId: String!
    ) {
        registerBuyer(
            userInput: {
                emailId: $emailId
                password: $password
                name: $name
                contactNumber: $contactNumber
                contactEmailId: $contactEmailId
            }
        ) {
            error
        }
    }
`

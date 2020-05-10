import gql from "graphql-tag"

//mutations
export const REGISTER_VENDOR = gql`
    mutation registerVendor(
        $emailId: String!
        $password: String!
        $name: String!
        $contactNumber: String!
        $contactEmailId: String!
    ) {
        registerVendor(
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

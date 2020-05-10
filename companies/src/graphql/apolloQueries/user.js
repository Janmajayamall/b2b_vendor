import gql from "graphql-tag"

//mutations
export const REGISTER_COMPANY = gql`
    mutation registerCompany($emailId: String!, $password: String!) {
        registerCompany(userInput: { emailId: $emailId, password: $password }) {
            jwt
            profileCreated
            error
        }
    }
`

export const CREATE_COMPANY_PROFILE = gql`
    mutation createCompanyProfile(
        $name: String!
        $country: String!
        $city: String!
        $address: String!
        $description: String!
        $locationCoordinates: locationCoordinates!
        $contactEmailId: String!
        $contactNumber: String!
        $website: String!
        $linkedIn: String!
    ) {
        createCompanyProfile(
            userInput: {
                name: $name
                country: $country
                city: $city
                address: $address
                description: $description
                locationCoordinates: $locationCoordinates
                contactEmailId: $contactEmailId
                contactNumber: $contactNumber
                website: $website
                linkedIn: $linkedIn
            }
        )
    }
`

export const LOGIN_COMPANY = gql`
    mutation loginCompany($emailId: String!, $password: String!) {
        loginCompany(userInput: { emailId: $emailId, password: $password }) {
            jwt
            profileCreated
            error
        }
    }
`

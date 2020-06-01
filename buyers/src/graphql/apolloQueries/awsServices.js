import gql from "graphql-tag"

//queries
export const GET_SIGNED_URL_PUT_OBJECT = gql`
    query getSignedUrlPutObject($getSignedUrlPutObjectInput: getSignedUrlPutObjectInput!) {
        getSignedUrlPutObject(userInput: $getSignedUrlPutObjectInput)
    }
`

import gql from "graphql-tag"

// mutations
export const ADD_TEMP_ITEM = gql`
    mutation addTempItem(
        $buyerRfqId: ID!
        $buyerPrId: ID!
        $buyerItemId: ID!
        $productName: String!
        $productDescription: String!
        $productParameters: String!
        $quantity: Float!
        $unit: String!
        $termsAndConditions: String!
        $id: ID!
        $deliveryDays: Float!
    ) {
        addTempItem(
            itemInput: {
                buyerRfqId: $buyerRfqId
                buyerPrId: $buyerPrId
                buyerItemId: $buyerItemId
                productName: $productName
                productDescription: $productDescription
                productParameters: $productParameters
                quantity: $quantity
                unit: $unit
                termsAndConditions: $termsAndConditions
                id: $id
                deliveryDays: $deliveryDays
            }
        ) @client
    }
`

// queries
export const GET_TEMP_RFQ = gql`
    query get_temp_rfq {
        tempRfq @client {
            buyerRfqId
            buyerPrId
            buyerItemId
            productName
            productDescription
            productParameters
            quantity
            unit
            termsAndConditions
            id
            deliveryDays
        }
    }
`

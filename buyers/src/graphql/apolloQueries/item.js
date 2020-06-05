import gql from "graphql-tag"

//mutations
export const CREATE_ITEM_ORDERS = gql`
    mutation createItemOrders(
        $categories: [String!]!
        $products: [String!]!
        $items: [itemInput!]!
        $chosenPreferredVendors: [ID!]!
    ) {
        createItemOrders(
            userInput: {
                categories: $categories
                products: $products
                items: $items
                chosenPreferredVendors: $chosenPreferredVendors
            }
        )
    }
`

//queries
export const BUYER_GET_ACTIVE_ITEM_ORDERS = gql`
    query buyerGetActiveItemOrders {
        buyerGetActiveItemOrders {
            _id
            buyerId
            buyerName
            buyerRfqId
            buyerPrId
            buyerItemId
            productName
            productDescription
            productParameters
            quantity
            unit
            termsAndConditions
            deliveryDays
            buyerGroupId
            createdAt
            lastModified
            status
        }
    }
`

export const BUYER_GET_ITEM_DETAILS = gql`
    query buyerGetItemDetails($orderId: ID!) {
        buyerGetItemDetails(orderId: $orderId) {
            _id
            buyerId
            buyerName
            buyerRfqId
            buyerPrId
            buyerItemId
            productName
            productDescription
            productParameters
            quantity
            unit
            termsAndConditions
            productFile
            deliveryDays
            buyerGroupId
            createdAt
            lastModified
            status
        }
    }
`
export const BUYER_SEARCH_ORDERS = gql`
    query buyerSearchOrders($buyerSearchOrdersInput: buyerSearchOrdersInput!) {
        buyerSearchOrders(userInput: $buyerSearchOrdersInput) {
            _id
            buyerId
            buyerName
            buyerRfqId
            buyerPrId
            buyerItemId
            productName
            productDescription
            productParameters
            quantity
            unit
            termsAndConditions
            productFile
            deliveryDays
            buyerGroupId
            createdAt
            lastModified
            status
        }
    }
`

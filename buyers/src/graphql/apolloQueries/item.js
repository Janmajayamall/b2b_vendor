import gql from "graphql-tag"

//mutations
export const CREATE_ITEM_ORDERS = gql`
    mutation createItemOrders($categories: [String!]!, $products: [String!]!, $items: [itemInput!]!) {
        createItemOrders(userInput: { categories: $categories, products: $products, items: $items })
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

import gql from "graphql-tag"

//mutations
export const CREATE_ITEM_ORDERS = gql`
    mutation createItemOrders($categories: [String!]!, $products: [String!]!, $items: [itemInput!]!) {
        createItemOrders(userInput: { categories: $categories, products: $products, items: $items })
    }
`

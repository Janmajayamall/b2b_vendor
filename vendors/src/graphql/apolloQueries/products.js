import gql from "graphql-tag"

export const ADD_CATEGORY_PRODUCTS = gql`
    mutation addCategoryProducts($addCategoryProductsInput: [addCategoryProductsInput!]!) {
        addCategoryProducts(userInput: $addCategoryProductsInput)
    }
`

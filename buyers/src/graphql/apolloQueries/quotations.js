import gql from "graphql-tag"

//queries
export const GET_ITEM_ORDER_QUOTATIONS = gql`
    query getItemOrderQuotations($getItemOrderQuotationsInput: getItemOrderQuotationsInput!) {
        getItemOrderQuotations(userInput: $getItemOrderQuotationsInput) {
            _id
            vendorId
            orderId

            # quotation
            quotedProductName
            quotedProductDescription
            quotedProductParameters
            quotedQuantity
            quotedUnit
            quotedLandingPrice
            quotedPriceCurrency
            quotedValidity
            quotedDeliveryDays
            quotedTermsAndConditions
            status

            # vendor's company
            vendorName
            vendorCompanyName
            vendorCompanyId
            vendorCompanyCity
            vendorCompanyState
        }
    }
`

export const GET_QUOTATION_DETAILS = gql`
    query getQuotationDetails($quotationId: ID!) {
        getQuotationDetails(quotationId: $quotationId) {
            _id
            vendorId
            orderId

            # quotation
            quotedProductName
            quotedProductDescription
            quotedProductParameters
            quotedQuantity
            quotedUnit
            quotedLandingPrice
            quotedPriceCurrency
            quotedValidity
            quotedDeliveryDays
            quotedTermsAndConditions
            status

            # vendor's company
            vendorName
            vendorCompanyName
            vendorCompanyId
            vendorCompanyCity
            vendorCompanyState
        }
    }
`

export const GET_ITEM_ORDER_QUOTATIONS_UNDER_REVIEW = gql`
    query getItemOrderQuotationsUnderReview($orderId: ID!) {
        getItemOrderQuotationsUnderReview(orderId: $orderId) {
            _id
            vendorId
            orderId

            # quotation
            quotedProductName
            quotedProductDescription
            quotedProductParameters
            quotedQuantity
            quotedUnit
            quotedLandingPrice
            quotedPriceCurrency
            quotedValidity
            quotedDeliveryDays
            quotedTermsAndConditions
            status

            # vendor's company
            vendorName
            vendorCompanyName
            vendorCompanyId
            vendorCompanyCity
            vendorCompanyState
        }
    }
`

export const GET_ITEM_ORDER_ACCEPTED_QUOTATION = gql`
    query getItemOrderAcceptedQuotation($orderId: ID!) {
        getItemOrderAcceptedQuotation(orderId: $orderId) {
            _id
            vendorId
            orderId

            # quotation
            quotedProductName
            quotedProductDescription
            quotedProductParameters
            quotedQuantity
            quotedUnit
            quotedLandingPrice
            quotedPriceCurrency
            quotedValidity
            quotedDeliveryDays
            quotedTermsAndConditions
            status

            # vendor's company
            vendorName
            vendorCompanyName
            vendorCompanyId
            vendorCompanyCity
            vendorCompanyState
        }
    }
`

//mutations
export const BUYER_MARK_UNDER_REVIEW_QUOTATION = gql`
    mutation buyerMarkUnderReviewQuotation($quotationId: ID!) {
        buyerMarkUnderReviewQuotation(quotationId: $quotationId) {
            error
        }
    }
`

export const BUYER_UNMARK_UNDER_REVIEW_QUOTATION = gql`
    mutation buyerUnmarkUnderReviewQuotation($quotationId: ID!) {
        buyerUnmarkUnderReviewQuotation(quotationId: $quotationId) {
            error
        }
    }
`

export const BUYER_FINALIZE_QUOTATION = gql`
    mutation buyerFinalizeQuotation($quotationId: ID!, $orderId: ID!) {
        buyerFinalizeQuotation(quotationId: $quotationId, orderId: $orderId) {
            error
        }
    }
`

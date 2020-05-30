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

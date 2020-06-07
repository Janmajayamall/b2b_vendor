import gql from "graphql-tag"

// queries
export const GET_INCOMING_VENDOR_ORDERS = gql`
    query getIncomingVendorOrders {
        getIncomingVendorOrders {
            vendorId
            orderId

            # buyer's input
            productName
            productDescription
            quantity
            unit
            termsAndConditions
            deliveryDays
            buyerId
            buyerName
            companyId
            companyName
            companyCity
            companyState
            companyLocationCoordinates
            companyCountry
        }
    }
`

export const GET_VENDOR_ORDER_DETAILS = gql`
    query getVendorOrderDetails($orderId: ID!) {
        getVendorOrderDetails(orderId: $orderId) {
            error
            itemOrder {
                vendorId
                orderId

                # buyer's input
                productName
                productDescription
                quantity
                unit
                termsAndConditions
                productParameters
                productFile
                deliveryDays
                buyerId
                buyerName
                companyId
                companyName
                companyCity
                companyState
                companyLocationCoordinates
                companyCountry

                # vendor's input
                quotedProductName
                quotedProductDescription
                quotedProductParameters
                quotedPricePerUnit
                quotedQuantityPrice
                quotedQuantity
                quotedUnit
                quotedDiscount
                quotedDeliveryCost
                quotedLandingPrice
                quotedPriceCurrency
                quotedValidity
                quotedDeliveryDays
                quotedTermsAndConditions
                quotedProductFile
                status

                # vendor's company
                vendorName
                vendorCompanyName
                vendorCompanyId
                vendorCompanyCity
                vendorCompanyState
                vendorCompanyLocationCoordinates

                createdAt
                lastModified
            }
        }
    }
`

export const VENDOR_SEARCH_ORDERS = gql`
    query vendorSearchOrders($vendorSearchOrdersInput: vendorSearchOrdersInput!) {
        vendorSearchOrders(userInput: $vendorSearchOrdersInput) {
            vendorId
            orderId

            # buyer's input
            productName
            productDescription
            quantity
            unit
            termsAndConditions
            deliveryDays
            buyerId
            buyerName
            companyId
            companyName
            companyCity
            companyState
            companyLocationCoordinates
            companyCountry
            status
        }
    }
`

// mutations
export const REJECT_ITEM_ORDER = gql`
    mutation rejectItemOrder($orderId: ID!) {
        rejectItemOrder(orderId: $orderId)
    }
`

export const UPDATE_VENDOR_ORDER_DETAILS = gql`
    mutation updateVendorOrderDetails($orderId: ID!, $updateVendorOrderDetailsInput: updateVendorOrderDetailsInput!) {
        updateVendorOrderDetails(orderId: $orderId, userInput: $updateVendorOrderDetailsInput) {
            error
        }
    }
`

import gql from "graphql-tag"

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

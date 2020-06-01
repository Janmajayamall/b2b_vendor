import gql from "graphql-tag"

//queries
export const BUYER_GET_PREFERRED_VENDORS = gql`
    query buyerGetPreferredVendors {
        buyerGetPreferredVendors {
            vendorCompanyId
            vendorCompanyName
        }
    }
`

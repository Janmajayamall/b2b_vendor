import gql from "graphql-tag"

//mutation
export const ADD_PREFERRED_VENDOR = gql`
    mutation addPreferredVendor($vendorCompanyId: ID!) {
        addPreferredVendor(vendorCompanyId: $vendorCompanyId) {
            error
        }
    }
`

export const REMOVE_PREFERRED_VENDOR = gql`
    mutation removePreferredVendor($vendorCompanyId: ID!) {
        removePreferredVendor(vendorCompanyId: $vendorCompanyId) {
            error
        }
    }
`

//query
export const COMPANY_GET_PREFERRED_VENDORS = gql`
    query companyGetPreferredVendors {
        companyGetPreferredVendors {
            vendorCompanyId
            vendorCompanyName
        }
    }
`

export const COMPANY_GET_VENDOR_COMPANY_PROFILE = gql`
    query companyGetVendorCompanyProfile($vendorCompanyId: ID!) {
        companyGetVendorCompanyProfile(vendorCompanyId: $vendorCompanyId) {
            preferredVendor
        }
    }
`

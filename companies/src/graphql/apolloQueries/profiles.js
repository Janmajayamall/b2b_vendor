import gql from "graphql-tag"

//queries
export const SEARCH_COMPANY_PROFILES = gql`
    query searchCompanyProfiles($searchCompanyProfilesInput: searchCompanyProfilesInput!) {
        searchCompanyProfiles(userInput: $searchCompanyProfilesInput) {
            companyId
            name
            country
            city
            state
        }
    }
`

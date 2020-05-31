import React from "react"
import { withRouter } from "next/router"
import {
    CREATE_COMPANY_PROFILE,
    COMPANY_GET_VENDOR_COMPANY_PROFILE,
    REMOVE_PREFERRED_VENDOR,
    ADD_PREFERRED_VENDOR
} from "../../graphql/apolloQueries/index"
import { withApollo } from "react-apollo"
import { Card, Divider, Table, Button } from "antd"
import Link from "next/link"
import { constants } from "./../../utils/index"

const defaultErrorState = {
    error: false,
    text: "",
    description: ""
}

class ExploreCompanyVendorProfile extends React.PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            vendorCompanyId: this.props.query.vendorCompanyId,
            preferredVendor: false,

            //loading state
            vendorCompanyProfileLoading: true,

            //error states
            error: defaultErrorState
        }
    }

    componentDidMount() {
        this.getVendorCompanyProfile()
    }

    getVendorCompanyProfile = async () => {
        const vendorCompanyId = this.state.vendorCompanyId
        if (vendorCompanyId == undefined) {
            this.setState({
                vendorCompanyProfileLoading: false,
                error: {
                    error: true,
                    text: "Error!",
                    description: "Sorry! Something went wrong. Please try again later!"
                }
            })
        }

        //set vendorCompanyProfileLoading to true
        this.setState({
            vendorCompanyProfileLoading: true,
            error: defaultErrorState
        })

        try {
            const { data } = await this.props.client.query({
                query: COMPANY_GET_VENDOR_COMPANY_PROFILE,
                variables: {
                    vendorCompanyId: vendorCompanyId
                },
                fetchPolicy: "no-cache"
            })
            const { companyGetVendorCompanyProfile } = data
            console.log(companyGetVendorCompanyProfile)
            this.setState({
                preferredVendor: companyGetVendorCompanyProfile.preferredVendor,
                vendorCompanyProfileLoading: false,
                error: defaultErrorState
            })
        } catch (e) {
            this.setState({
                vendorCompanyProfileLoading: false,
                error: {
                    error: true,
                    text: "Error!",
                    description: "Sorry! Something went wrong. Please try again later!"
                }
            })
        }
    }

    makePreferredVendor = async () => {
        const vendorCompanyId = this.state.vendorCompanyId
        if (vendorCompanyId == undefined) {
            return
        }

        try {
            const { data } = await this.props.client.mutate({
                mutation: ADD_PREFERRED_VENDOR,
                variables: {
                    vendorCompanyId: vendorCompanyId
                }
            })
            const { addPreferredVendor } = data
            if (addPreferredVendor.error === constants.errorCodes.noError) {
                this.setState({
                    preferredVendor: true
                })
            } else {
                throw new Error(`response with error code: ${addPreferredVendor.error}`)
            }
        } catch (e) {
            console.log("exploreCompanyVendorProfile error: ", e)
            this.setState({
                error: {
                    error: true,
                    text: "Error!",
                    description: "Sorry! Something went wrong. Please try again later!"
                }
            })
        }
    }

    removePreferredVendor = async () => {
        const vendorCompanyId = this.state.vendorCompanyId
        if (vendorCompanyId == undefined) {
            return
        }

        try {
            const { data } = await this.props.client.mutate({
                mutation: REMOVE_PREFERRED_VENDOR,
                variables: {
                    vendorCompanyId: vendorCompanyId
                }
            })
            const { removePreferredVendor } = data
            if (removePreferredVendor.error === constants.errorCodes.noError) {
                this.setState({
                    preferredVendor: false
                })
            } else {
                throw new Error(`response with error code: ${removePreferredVendor.error}`)
            }
        } catch (e) {
            console.log("exploreCompanyVendorProfile error: ", e)
            this.setState({
                error: {
                    error: true,
                    text: "Error!",
                    description: "Sorry! Something went wrong. Please try again later!"
                }
            })
        }
    }

    render() {
        return (
            <div className="initial-page">
                <Card>
                    {this.state.preferredVendor === false ? (
                        <Button onClick={this.makePreferredVendor} type="primary">
                            Add as preferred vendor
                        </Button>
                    ) : (
                        <Button onClick={this.removePreferredVendor} type="primary">
                            remove preferred vendor
                        </Button>
                    )}
                </Card>
                <style jsx>{`
                    .initial-page {
                        display: flex;
                        height: 100%;
                        width: 100%;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }
                `}</style>
            </div>
        )
    }
}

export async function getServerSideProps(content) {
    const query = content.query

    return {
        props: {
            query: query
        }
    }
}

export default withRouter(withApollo(ExploreCompanyVendorProfile))

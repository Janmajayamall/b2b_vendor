import React from "react"
import { withRouter } from "next/router"
import { SEARCH_COMPANY_PROFILES, COMPANY_GET_PREFERRED_VENDORS } from "../../graphql/apolloQueries/index"
import { withApollo } from "react-apollo"
import { Card, Divider, Table, Input, Spin } from "antd"
import Link from "next/link"
import { LoadingOutlined } from "@ant-design/icons"
const { Search } = Input

const defaultErrorState = {
    error: false,
    text: "",
    description: ""
}

const vendorColumn = [
    {
        title: "Vendor Company",
        dataIndex: "vendorCompanyName"
    },
    {
        title: "Visit Profile",
        dataIndex: "operation",
        width: 100,
        render: (_, item) => {
            return (
                <Link
                    href={{
                        pathname: "/explore/exploreCompanyVendorProfile",
                        query: { vendorCompanyId: item.vendorCompanyId }
                    }}
                >
                    <a target="_blank">Visit Profile</a>
                </Link>
            )
        }
    }
]

const searchVendorColumn = [
    {
        title: "Vendor Company",
        dataIndex: "name"
    },
    {
        title: "City",
        dataIndex: "city"
    },
    {
        title: "Visit Profile",
        dataIndex: "operation",
        width: 100,
        render: (_, item) => {
            return (
                <Link
                    href={{
                        pathname: "/explore/exploreCompanyVendorProfile",
                        query: { vendorCompanyId: item.companyId }
                    }}
                >
                    <a target="_blank">Visit Profile</a>
                </Link>
            )
        }
    }
]

class PreferredVendors extends React.PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            preferredVendors: [],
            searchCompanyProfiles: [],

            //loading states
            searchCompanyProfilesLoading: false,
            preferredVendorsLoading: true,

            //error states
            preferredVendorsError: defaultErrorState,
            searchCompanyProfilesError: defaultErrorState
        }
    }

    getPreferredVendors = async () => {
        //set preferredVendorsLoading to true
        this.setState({
            preferredVendorsLoading: true,
            preferredVendorsError: defaultErrorState
        })

        try {
            const { data } = this.props.client.query({
                query: COMPANY_GET_PREFERRED_VENDORS,
                fetchPolicy: "no-cache"
            })
            const { companyGetPreferredVendors } = data
            this.setState({
                preferredVendors: companyGetPreferredVendors,
                preferredVendorsLoading: false,
                preferredVendorsError: defaultErrorState
            })
        } catch (e) {
            this.setState({
                preferredVendorsLoading: false,
                preferredVendorsError: {
                    error: true,
                    text: "Error!",
                    description: "Something went wrong. Please try again later!"
                }
            })
        }
    }

    searchCompanyProfiles = async (value) => {
        //set searchCompanyProfilesLoading to true
        this.setState({
            searchCompanyProfilesLoading: true
        })

        try {
            const { data } = await this.props.client.query({
                query: SEARCH_COMPANY_PROFILES,
                variables: {
                    searchCompanyProfilesInput: {
                        keywords: value.trim()
                    }
                },
                fetchPolicy: "no-cache"
            })

            const { searchCompanyProfiles } = data
            this.setState({
                searchCompanyProfilesLoading: false,
                searchCompanyProfiles: searchCompanyProfiles,
                searchCompanyProfilesError: defaultErrorState
            })
        } catch (e) {
            this.setState({
                searchCompanyProfilesLoading: false,
                searchCompanyProfilesError: {
                    error: true,
                    text: "Error!",
                    description: "Something went wrong. Please try again later!"
                }
            })
        }
    }

    render() {
        return (
            <div className="initial-page">
                <Card
                    title="Vendor Configuration"
                    style={{
                        height: "100%",
                        width: "100%"
                    }}
                    // extra={
                    //     <Link href="/buyerAccounts/addBuyerAccount">
                    //         <a>Add new buyer</a>
                    //     </Link>
                    // }
                >
                    <Card
                        title="Trusted Vendors"
                        style={{
                            height: "100%",
                            width: "100%"
                        }}
                        // extra={
                        //     <Link href="/buyerAccounts/addBuyerAccount">
                        //         <a>Add new buyer</a>
                        //     </Link>
                        // }
                    >
                        {this.state.preferredVendorsLoading === true ? (
                            <div className="spinner-div">
                                <Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} tip="Loading" />
                            </div>
                        ) : (
                            <Table
                                style={{
                                    height: "100%",
                                    width: "100%"
                                }}
                                columns={vendorColumn}
                                dataSource={this.state.preferredVendors}
                                pagination={false}
                            />
                        )}
                    </Card>
                    <Card
                        title="Search Vendors"
                        style={{
                            height: "100%",
                            width: "100%"
                        }}
                        // extra={
                        //     <Link href="/buyerAccounts/addBuyerAccount">
                        //         <a>Add new buyer</a>
                        //     </Link>
                        // }
                    >
                        <Search
                            placeholder="Company Name"
                            enterButton="Search"
                            size="large"
                            onSearch={this.searchCompanyProfiles}
                        />
                        <Divider />
                        {this.state.searchCompanyProfilesLoading === true ? (
                            <div className="spinner-div">
                                <Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} tip="Loading" />
                            </div>
                        ) : (
                            <Table
                                style={{
                                    height: "100%",
                                    width: "100%"
                                }}
                                columns={searchVendorColumn}
                                dataSource={this.state.searchCompanyProfiles}
                                pagination={false}
                            />
                        )}
                    </Card>
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

                    .spinner-div {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                `}</style>
            </div>
        )
    }
}

export default withRouter(withApollo(PreferredVendors))

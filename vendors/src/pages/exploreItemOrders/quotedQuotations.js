import React from "react"
import { Table, Alert, Card, Button, Typography, Input, DatePicker, Select } from "antd"
import { withRouter } from "next/router"
import { VENDOR_SEARCH_ORDERS } from "../../graphql/apolloQueries/index"
import { withApollo } from "react-apollo"
import Link from "next/link"
import { SearchOutlined } from "@ant-design/icons"
const { Text } = Typography
const { RangePicker } = DatePicker

const defaultErrorState = {
    error: false,
    text: "",
    description: ""
}

const columns = [
    {
        title: "Order ID",
        dataIndex: "orderId"
    },
    {
        title: "Product Name",
        dataIndex: "productName"
    },
    {
        title: "Product Description",
        dataIndex: "productDescription"
    },
    {
        title: "Quantity",
        dataIndex: "quantity",
        render: (_, item) => <div>{`${item.quantity} ${item.unit}`}</div>
    },
    {
        title: "Company Name",
        dataIndex: "companyName"
    },
    {
        title: "City",
        dataIndex: "companyCity"
    },
    {
        title: "Status",
        dataIndex: "status",
        render: (_, item) => {
            if (item.status === "REVIEW" || item.status === "QUOTED") {
                return <div>UNDER PROGRESS</div>
            } else if (item.status === "REJECTED") {
                return <div>REJECTED</div>
            } else if (item.status === "CANCELLED") {
                return <div>CANCELLED</div>
            } else if (item.status === "ACCEPTED") {
                return <div>ACCEPTED</div>
            }
            return undefined
        }
    },
    {
        title: "Action",
        key: "operation",
        width: 100,
        render: (_, item) => {
            return (
                <Link href={{ pathname: "/exploreItemOrders/itemOrderDetails", query: { orderId: item.orderId } }}>
                    <a target="_blank">Details</a>
                </Link>
            )
        }
    }
]

class QuotedQuotations extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            error: defaultErrorState,
            quotations: [],

            searchQuery: {}
        }
    }

    componentDidMount() {
        this.searchVendorQuotations({})
    }

    renderError = () => {
        return (
            <Alert
                message={this.state.error.text}
                description={this.state.error.description}
                type="error"
                closable
                onClose={() => {
                    this.setState({
                        error: defaultErrorState
                    })
                }}
            />
        )
    }

    onDateRangeChange = (dateRange) => {
        if (dateRange == undefined) {
            this.setState({
                searchQuery: {
                    ...this.state.searchQuery,
                    dateRange: dateRange
                }
            })
        } else {
            this.setState({
                searchQuery: {
                    ...this.state.searchQuery,
                    dateRange: {
                        startDate: dateRange[0],
                        endDate: dateRange[1]
                    }
                }
            })
        }
    }

    onOrderIdChange = (e) => {
        this.setState({
            searchQuery: {
                ...this.state.searchQuery,
                orderId: e.target.value.trim()
            }
        })
    }

    onCompanyNameChange = (e) => {
        this.setState({
            searchQuery: {
                ...this.state.searchQuery,
                companyName: e.target.value.trim()
            }
        })
    }

    onStatusChange = (val) => {
        this.setState({
            searchQuery: {
                ...this.state.searchQuery,
                status: val
            }
        })
    }

    resetSearch = () => {
        this.setState({
            searchQuery: {}
        })
    }

    searchVendorQuotations = async () => {
        //if loading is true then return
        if (this.state.loading === true) {
            return
        }

        //set loading to true
        this.setState({
            loading: true
        })

        const searchQuery = this.state.searchQuery

        try {
            // get quotations
            const { data } = await this.props.client.query({
                query: VENDOR_SEARCH_ORDERS,
                variables: {
                    vendorSearchOrdersInput: searchQuery
                },
                fetchPolicy: "no-cache"
            })

            const { vendorSearchOrders } = data
            console.log(vendorSearchOrders)
            this.setState({
                loading: false,
                error: defaultErrorState,
                quotations: vendorSearchOrders
            })
        } catch (e) {
            console.log("error in quotedQuotations.js: ", e)
            this.setState({
                loading: false,
                error: {
                    error: true,
                    text: "Sorry!",
                    description: "Something went wrong. Please try again later!"
                }
            })
        }
    }

    render() {
        return (
            <div className="initial-page">
                <div className="order-list">
                    <Card
                        title="All Item Orders"
                        style={{
                            height: "100%",
                            width: "100%"
                        }}
                    >
                        <Card
                            title="Search Query"
                            type="inner"
                            extra={
                                <div>
                                    <Button
                                        onClick={this.searchVendorQuotations}
                                        type={"primary"}
                                        icon={<SearchOutlined />}
                                        loading={this.state.loading}
                                        style={{
                                            marginRight: 5
                                        }}
                                    >
                                        Search
                                    </Button>
                                    <Button onClick={this.resetSearch} type={"primary"}>
                                        Reset
                                    </Button>
                                </div>
                            }
                        >
                            <div className="search-frame">
                                <div className="search-columns">
                                    <div className="search-box">
                                        <Text>Order ID</Text>
                                        <Input value={this.state.searchQuery.orderId} onChange={this.onOrderIdChange} />
                                    </div>
                                    <div className="search-box">
                                        <Text>Company Name</Text>
                                        <Input
                                            value={this.state.searchQuery.companyName}
                                            onChange={this.onCompanyNameChange}
                                        />
                                    </div>
                                </div>
                                <div className="search-columns">
                                    <div className="search-box">
                                        <Text>Status</Text>
                                        <Select
                                            value={this.state.searchQuery.status}
                                            defaultValue=""
                                            onChange={this.onStatusChange}
                                        >
                                            <Select.Option value="">SELECT ALL</Select.Option>
                                            <Select.Option value="QUOTED_REVIEW">UNDER PROGRESS</Select.Option>
                                            <Select.Option value="ACCEPTED">ACCEPTED</Select.Option>
                                            <Select.Option value="REJECTED">REJECTED</Select.Option>
                                        </Select>
                                    </div>
                                    <div className="search-box">
                                        <Text>Date Range</Text>
                                        <RangePicker
                                            value={
                                                this.state.searchQuery.dateRange == undefined
                                                    ? null
                                                    : [
                                                          this.state.searchQuery.dateRange.startDate,
                                                          this.state.searchQuery.dateRange.endDate
                                                      ]
                                            }
                                            onChange={this.onDateRangeChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <Table
                            style={{
                                height: "100%",
                                width: "100%"
                            }}
                            columns={columns}
                            dataSource={this.state.quotations}
                        />
                        {this.state.error.error === true ? this.renderError() : undefined}
                    </Card>
                </div>
                <style jsx>{`
                    .initial-page {
                        display: flex;
                        height: 100%;
                        width: 100%;
                        flex-direction: column;
                    }

                    .order-list {
                        width: 100%;
                    }

                    .search-frame {
                        width: 100%;
                        display: flex;
                        flex-direction: row;
                    }

                    .search-columns {
                        width: 50%;
                        display: flex;
                        flex-direction: column;
                    }

                    .search-box {
                        display: flex;
                        flex-direction: column;
                        width: 90%;
                    }
                `}</style>
            </div>
        )
    }
}

export default withRouter(withApollo(QuotedQuotations))

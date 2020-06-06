import React from "react"
import { Table, Alert, Card, Button, Typography, Input, DatePicker, Select } from "antd"
import { withRouter } from "next/router"
import { BUYER_SEARCH_ORDERS } from "../../graphql/apolloQueries/index"
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
        dataIndex: "_id"
    },
    {
        title: "RFQ ID",
        dataIndex: "buyerRfqId"
    },
    {
        title: "PR ID",
        dataIndex: "buyerPrId"
    },
    {
        title: "Item Id",
        dataIndex: "buyerItemId"
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
        dataIndex: "quantity"
    },
    {
        title: "Unit",
        dataIndex: "unit"
    },
    {
        title: "Ordered Time",
        dataIndex: "createdAt"
    },
    {
        title: "Quantity",
        dataIndex: "quantity"
    },
    {
        title: "Unit",
        dataIndex: "unit"
    },
    {
        title: "Ordered Time",
        dataIndex: "createdAt"
    },
    {
        title: "Status",
        dataIndex: "status"
    },
    {
        title: "Action",
        key: "operation",
        fixed: "right",
        width: 100,
        render: (_, item) => {
            return (
                <Link href={{ pathname: "/orders/itemQuotations", query: { orderId: item._id } }}>
                    <a target="_blank">Quotations</a>
                </Link>
            )
        }
    }
]

class AllOrders extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            error: defaultErrorState,
            activeItemOrders: [],

            searchQuery: {}
        }
    }

    componentDidMount() {
        this.searchItemOrders({})
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

    onRfqIdChange = (e) => {
        this.setState({
            searchQuery: {
                ...this.state.searchQuery,
                buyerRfqId: e.target.value.trim()
            }
        })
    }

    onPrIdChange = (e) => {
        this.setState({
            searchQuery: {
                ...this.state.searchQuery,
                buyerPrId: e.target.value.trim()
            }
        })
    }

    onItemIdChange = (e) => {
        this.setState({
            searchQuery: {
                ...this.state.searchQuery,
                buyerItemId: e.target.value.trim()
            }
        })
    }

    onProductNameChange = (e) => {
        this.setState({
            searchQuery: {
                ...this.state.searchQuery,
                productName: e.target.value.trim()
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

    searchItemOrders = async () => {
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
            //get active item orders
            const { data } = await this.props.client.query({
                query: BUYER_SEARCH_ORDERS,
                variables: {
                    buyerSearchOrdersInput: searchQuery
                },
                fetchPolicy: "no-cache"
            })
            const { buyerSearchOrders } = data
            console.log(buyerSearchOrders)
            //set active orders in state
            this.setState({
                loading: false,
                error: defaultErrorState,
                activeItemOrders: buyerSearchOrders
            })
        } catch (e) {
            console.log("error in allOrders.js: ", e)
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
                                        onClick={this.searchItemOrders}
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
                                        <Text>RFQ ID</Text>
                                        <Input
                                            value={this.state.searchQuery.buyerRfqId}
                                            onChange={this.onRfqIdChange}
                                        />
                                    </div>
                                    <div className="search-box">
                                        <Text>PR ID</Text>
                                        <Input value={this.state.searchQuery.buyerPrId} onChange={this.onPrIdChange} />
                                    </div>
                                    <div className="search-box">
                                        <Text>Item ID</Text>
                                        <Input
                                            value={this.state.searchQuery.buyerItemId}
                                            onChange={this.onItemIdChange}
                                        />
                                    </div>
                                </div>
                                <div className="search-columns">
                                    <div className="search-box">
                                        <Text>Product Name</Text>
                                        <Input
                                            value={this.state.searchQuery.productName}
                                            onChange={this.onProductNameChange}
                                        />
                                    </div>
                                    <div className="search-box">
                                        <Text>Status</Text>
                                        <Select
                                            value={this.state.searchQuery.status}
                                            defaultValue=""
                                            onChange={this.onStatusChange}
                                        >
                                            <Select.Option value="">SELECT ALL</Select.Option>
                                            <Select.Option value="ACTIVE">ACTIVE ORDERS</Select.Option>
                                            <Select.Option value="NOT_ACTIVE">CLOSED ORDERS</Select.Option>
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
                            dataSource={this.state.activeItemOrders}
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

export default withRouter(withApollo(AllOrders))

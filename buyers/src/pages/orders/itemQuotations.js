import React from "react"
import { Table, Alert, Card, Button, Divider, Select, Typography, Checkbox, Spin, Modal } from "antd"
import { withRouter } from "next/router"
import {
    BUYER_GET_ITEM_DETAILS,
    GET_ITEM_ORDER_QUOTATIONS,
    GET_ITEM_ORDER_QUOTATIONS_UNDER_REVIEW,
    GET_ITEM_ORDER_ACCEPTED_QUOTATION,
    CLOSE_ITEM_ORDER
} from "../../graphql/apolloQueries/index"
import { withApollo } from "react-apollo"
import Link from "next/link"
import { ReloadOutlined, LoadingOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
const { Text } = Typography
const { Option } = Select
const { confirm } = Modal

const defaultErrorState = {
    error: false,
    text: "",
    description: ""
}

const defaultFilterValues = {
    city: "default",
    state: "default",
    country: "default",
    preferredVendors: false
}

const defaultSortValues = {
    nearest: false
}

const productColumns = [
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
        dataIndex: "quantity",
        render: (text, record) => <div>{`${record.quantity} ${record.unit}`}</div>
    },
    {
        title: "Ordered Time",
        dataIndex: "createdAt"
    }
]

const quotationsColumns = [
    {
        title: "Quotation Ref",
        dataIndex: "_id"
    },
    {
        title: "Product Name",
        dataIndex: "quotedProductName"
    },
    {
        title: "Product Description",
        dataIndex: "quotedProductDescription"
    },
    {
        title: "Quantity",
        dataIndex: "quotedQuantity",
        render: (text, record) => <div>{`${record.quotedQuantity} ${record.quotedUnit}`}</div>
    },
    {
        title: "Quote valid till (in days)",
        dataIndex: "quotedValidity"
    },
    {
        title: "Delivery Days (in days)",
        dataIndex: "quotedDeliveryDays"
    },
    {
        title: "Company Name",
        dataIndex: "vendorCompanyName"
    },
    {
        title: "City",
        dataIndex: "vendorCompanyCity"
    },
    {
        title: "Vendor Name",
        dataIndex: "vendorName"
    },
    {
        title: "Landing Price",
        dataIndex: "quotedLandingPrice",
        fixed: "right",
        render: (text, record) => <div>{`${record.quotedLandingPrice} ${record.quotedPriceCurrency}`}</div>
    },
    {
        title: "Action",
        dataIndex: "operation",
        fixed: "right",
        width: 100,
        render: (_, item) => {
            return (
                <Link
                    href={{
                        pathname: "/orders/quotationDetails",
                        query: { orderId: item.orderId, quotationId: item._id }
                    }}
                >
                    <a target="_blank">Details</a>
                </Link>
            )
        }
    }
]

class ItemQuotations extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            error: defaultErrorState,

            itemDetailsLoading: true,
            quotationsLoading: true,
            quotationsUnderReviewLoading: true,
            quotationAcceptedLoading: true,

            itemDetails: [],
            itemQuotations: [],
            itemQuotationsUnderReview: [],
            itemQuotationAccepted: [],
            orderId: this.props.query.orderId,

            // filter options
            cities: ["value1", "value2", "value3", "value4"],
            states: ["value1", "value2", "value3", "value4"],
            countries: ["value1", "value2", "value3", "value4"],

            //filters & sorts
            filters: defaultFilterValues,
            sorts: defaultSortValues
        }
    }

    componentDidMount() {
        this.getItemOrderDetails()
        this.getItemOrderQuotations({}, {})
        this.getItemOrderQuotationsUnderReview()
        this.getItemOrderAcceptedQuotation()
    }

    getItemOrderDetails = async () => {
        const orderId = this.state.orderId

        if (orderId == undefined) {
            this.setState({
                error: {
                    error: true,
                    text: "Error Item Order ID!",
                    description: "Please refresh the page."
                },
                itemDetailsLoading: false
            })
            return
        }

        this.setState({
            itemDetailsLoading: true
        })

        try {
            //get item order details
            const { data } = await this.props.client.query({
                query: BUYER_GET_ITEM_DETAILS,
                variables: {
                    orderId: orderId
                },
                fetchPolicy: "no-cache"
            })
            const { buyerGetItemDetails } = data
            this.setState({
                itemDetailsLoading: false,
                itemDetails: [buyerGetItemDetails]
            })
        } catch (e) {
            console.log("error itemQuotations: ", e)
            this.setState({
                error: {
                    error: true,
                    text: "Error!",
                    description: "Something went wrong! Please try again later"
                },
                itemDetailsLoading: false
            })
        }
    }

    getQuotationsPostFiltersChange = (filters, sorts) => {
        const finalFilters = {}
        Object.keys(filters).forEach((key) => {
            if (filters[key] !== "default" && filters[key] !== false) {
                finalFilters[key] = filters[key]
            }
        })

        const finalSorts = {}
        Object.keys(sorts).forEach((key) => {
            if (sorts[key] !== false) {
                finalSorts[key] = true
            }
        })

        this.getItemOrderQuotations(finalFilters, finalSorts)
    }

    getItemOrderQuotations = async (filters, sorts) => {
        console.log(filters, sorts)
        const orderId = this.state.orderId

        if (orderId == undefined) {
            console.log("dad")
            this.setState({
                error: {
                    error: true,
                    text: "Error Item Order ID!",
                    description: "Please refresh the page."
                },
                quotationsLoading: false
            })
            return
        }

        //set quotationsLoading to true
        this.setState({
            quotationsLoading: true
        })

        try {
            const { data } = await this.props.client.query({
                query: GET_ITEM_ORDER_QUOTATIONS,
                variables: {
                    getItemOrderQuotationsInput: {
                        orderId: orderId,
                        quotationFilters: {
                            ...filters,
                            sort: sorts
                        }
                    }
                },
                fetchPolicy: "no-cache"
            })

            const { getItemOrderQuotations } = data
            console.log(getItemOrderQuotations)
            this.setState({
                itemQuotations: getItemOrderQuotations,
                error: defaultErrorState,
                quotationsLoading: false
            })
        } catch (e) {
            this.setState({
                quotationsLoading: false,
                error: {
                    error: true,
                    text: "Sorry!",
                    description: "Something went wrong. Please try again later!"
                }
            })
        }
    }

    getItemOrderQuotationsUnderReview = async () => {
        const orderId = this.state.orderId

        if (orderId == undefined) {
            this.setState({
                error: {
                    error: true,
                    text: "Error Item Order ID!",
                    description: "Please refresh the page."
                },
                quotationsUnderReviewLoading: false
            })
            return
        }

        //set quotationsUnderReviewLoading to true
        this.setState({
            quotationsUnderReviewLoading: true,
            error: defaultErrorState
        })

        try {
            const { data } = await this.props.client.query({
                query: GET_ITEM_ORDER_QUOTATIONS_UNDER_REVIEW,
                variables: {
                    orderId: orderId
                },
                fetchPolicy: "no-cache"
            })
            const { getItemOrderQuotationsUnderReview } = data
            console.log(getItemOrderQuotationsUnderReview, "getItemOrderQuotationsUnderReview")
            this.setState({
                itemQuotationsUnderReview: getItemOrderQuotationsUnderReview,
                error: defaultErrorState,
                quotationsUnderReviewLoading: false
            })
        } catch (e) {
            this.setState({
                quotationsUnderReviewLoading: false,
                error: {
                    error: true,
                    text: "Sorry!",
                    description: "Something went wrong. Please try again later!"
                }
            })
        }
    }

    getItemOrderAcceptedQuotation = async () => {
        const orderId = this.state.orderId

        if (orderId == undefined) {
            this.setState({
                error: {
                    error: true,
                    text: "Error Item Order ID!",
                    description: "Please refresh the page."
                },
                quotationAcceptedLoading: false
            })
            return
        }

        //set quotationAcceptedLoading to true
        this.setState({
            quotationAcceptedLoading: true,
            error: defaultErrorState
        })

        try {
            const { data } = await this.props.client.query({
                query: GET_ITEM_ORDER_ACCEPTED_QUOTATION,
                variables: {
                    orderId: orderId
                },
                fetchPolicy: "no-cache"
            })
            const { getItemOrderAcceptedQuotation } = data
            console.log(getItemOrderAcceptedQuotation, "getItemOrderAcceptedQuotation")
            let acceptedQuotation = []
            if (getItemOrderAcceptedQuotation != undefined) {
                acceptedQuotation = [getItemOrderAcceptedQuotation]
            }
            this.setState({
                itemQuotationAccepted: acceptedQuotation,
                error: defaultErrorState,
                quotationAcceptedLoading: false
            })
        } catch (e) {
            console.log(e, "a")
            this.setState({
                quotationAcceptedLoading: false,
                error: {
                    error: true,
                    text: "Sorry!",
                    description: "Something went wrong. Please try again later!"
                }
            })
        }
    }

    // filters change functions
    onChangeCity = (value) => {
        const updatedFilter = {
            ...defaultFilterValues,
            city: value
        }
        this.setState({
            filters: updatedFilter
        })

        this.getQuotationsPostFiltersChange(updatedFilter, this.state.sorts)
    }

    onChangeState = (value) => {
        const updatedFilter = {
            ...defaultFilterValues,
            state: value
        }
        this.setState({
            filters: updatedFilter
        })
        this.getQuotationsPostFiltersChange(updatedFilter, this.state.sorts)
    }

    onChangeCountry = (value) => {
        const updatedFilter = {
            ...defaultFilterValues,
            country: value
        }
        this.setState({
            filters: updatedFilter
        })
        this.getQuotationsPostFiltersChange(updatedFilter, this.state.sorts)
    }

    onChangePreferredVendors = (value) => {
        const updatedFilter = {
            ...defaultFilterValues,
            preferredVendors: value.target.checked
        }
        this.setState({
            filters: updatedFilter
        })
        this.getQuotationsPostFiltersChange(updatedFilter, this.state.sorts)
    }

    //sort change functions
    onChangeNearestSort = (value) => {
        const updatedSorts = {
            ...defaultSortValues,
            nearest: value.target.checked
        }
        this.setState({
            sorts: updatedSorts
        })
        this.getQuotationsPostFiltersChange(this.state.filters, updatedSorts)
    }

    refreshQuotations = () => {
        this.getQuotationsPostFiltersChange(this.state.filters, this.state.sorts)
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

    closeItemOrderRequest = async () => {
        try {
            const orderId = this.state.orderId
            const { data } = await this.props.client.mutate({
                mutation: CLOSE_ITEM_ORDER,
                variables: {
                    orderId: orderId
                }
            })
            console.log(data)
            this.getItemOrderDetails()
            this.getItemOrderQuotations(this.state.filters, this.state.sorts)
            this.getItemOrderQuotationsUnderReview()
            this.getItemOrderAcceptedQuotation()
        } catch (e) {
            this.setState({
                error: {
                    error: true,
                    text: "Sorry! Something went wrong",
                    description: "Please refresh the page & try again!"
                }
            })
        }
    }

    closeItemOrderConfirm = async () => {
        const parentThis = this
        confirm({
            title: "Are you sure you want to close this order?",
            icon: <ExclamationCircleOutlined />,
            content:
                "Please note that after closing this order, without finalizing & selecting any quotation, all quotations for the item order will be rejected.",
            onOk() {
                return new Promise(async (resolve, reject) => {
                    await parentThis.closeItemOrderRequest()
                    resolve(true)
                })
            },
            onCancel() {}
        })
    }

    render() {
        return (
            <div className="initial-page">
                <div className="main-display">
                    {this.state.error.error === true ? this.renderError() : undefined}
                    <Card
                        title="Item Order Quotations"
                        style={{
                            height: "100%",
                            width: "100%"
                        }}
                        extra={
                            this.state.itemDetails[0] && this.state.itemDetails[0].status === "NOT_ACTIVE" ? (
                                <Text type="danger" strong>
                                    ORDER CLOSED
                                </Text>
                            ) : undefined
                        }
                    >
                        <Card title="Your Item Order Details" type="inner">
                            {this.state.itemDetailsLoading === true ? (
                                <div className="spinner-div">
                                    <Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} tip="Loading" />
                                </div>
                            ) : (
                                <Table
                                    style={{
                                        height: "100%",
                                        width: "100%"
                                    }}
                                    columns={productColumns}
                                    dataSource={this.state.itemDetails}
                                    pagination={false}
                                />
                            )}
                        </Card>
                        <Card
                            title="Finalized Quotation"
                            type="inner"
                            extra={
                                <Button
                                    onClick={this.getItemOrderAcceptedQuotation}
                                    type={"primary"}
                                    icon={<ReloadOutlined />}
                                />
                            }
                        >
                            {this.state.quotationAcceptedLoading === true ? (
                                <div className="spinner-div">
                                    <Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} tip="Loading" />
                                </div>
                            ) : this.state.itemQuotationAccepted.length !== 0 ? (
                                <Table
                                    style={{
                                        height: "100%",
                                        width: "100%"
                                    }}
                                    columns={quotationsColumns}
                                    dataSource={this.state.itemQuotationAccepted}
                                    pagination={false}
                                />
                            ) : undefined}
                        </Card>
                        <Card
                            title="Quotations Under Review"
                            type="inner"
                            extra={
                                <Button
                                    onClick={this.getItemOrderQuotationsUnderReview}
                                    type={"primary"}
                                    icon={<ReloadOutlined />}
                                />
                            }
                        >
                            {this.state.quotationsUnderReviewLoading === true ? (
                                <div className="spinner-div">
                                    <Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} tip="Loading" />
                                </div>
                            ) : this.state.itemQuotationsUnderReview.length !== 0 ? (
                                <Table
                                    style={{
                                        height: "100%",
                                        width: "100%"
                                    }}
                                    columns={quotationsColumns}
                                    dataSource={this.state.itemQuotationsUnderReview}
                                    pagination={false}
                                />
                            ) : undefined}
                        </Card>
                        <Card
                            title="Search Quotations"
                            type="inner"
                            extra={
                                <Button onClick={this.refreshQuotations} type={"primary"} icon={<ReloadOutlined />} />
                            }
                        >
                            <Divider orientation="left" plain>
                                Filter by
                            </Divider>
                            <div className="filters">
                                <div className="filters-select">
                                    <Text>Select City</Text>
                                    <Select
                                        value={this.state.filters.city}
                                        defaultValue="default"
                                        onChange={this.onChangeCity}
                                    >
                                        <Option value="default">Choose</Option>
                                        {this.state.cities.map((value) => {
                                            return <Option value={value}>{value}</Option>
                                        })}
                                    </Select>
                                </div>
                                <div className="filters-select">
                                    <Text>Select State</Text>
                                    <Select
                                        value={this.state.filters.state}
                                        defaultValue="default"
                                        onChange={this.onChangeState}
                                    >
                                        <Option value="default">Choose</Option>
                                        {this.state.states.map((value) => {
                                            return <Option value={value}>{value}</Option>
                                        })}
                                    </Select>
                                </div>
                                <div className="filters-select">
                                    <Text>Select Country</Text>
                                    <Select
                                        value={this.state.filters.country}
                                        defaultValue="default"
                                        onChange={this.onChangeCountry}
                                    >
                                        <Option value="default">Choose</Option>
                                        {this.state.countries.map((value) => {
                                            return <Option value={value}>{value}</Option>
                                        })}
                                    </Select>
                                </div>
                                <div className="filters-select">
                                    <Checkbox
                                        checked={this.state.filters.preferredVendors}
                                        onChange={this.onChangePreferredVendors}
                                    >
                                        Only Preferred Vendors
                                    </Checkbox>
                                </div>
                            </div>
                            <Divider orientation="left" plain>
                                Sort by
                            </Divider>
                            <div className="sorts">
                                <div className="filters-select">
                                    <Checkbox checked={this.state.sorts.nearest} onChange={this.onChangeNearestSort}>
                                        Nearest
                                    </Checkbox>
                                </div>
                            </div>
                            <div className="filters">
                                <div className="filters-select"></div>
                            </div>
                            <Divider plain />
                            {this.state.quotationsLoading === true ? (
                                <div className="spinner-div">
                                    <Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} tip="Loading" />
                                </div>
                            ) : (
                                <Table
                                    style={{
                                        height: "100%",
                                        width: "100%"
                                    }}
                                    columns={quotationsColumns}
                                    dataSource={this.state.itemQuotations}
                                    pagination={false}
                                />
                            )}
                        </Card>
                        {this.state.itemDetails[0] == undefined ? undefined : this.state.itemDetails[0].status ===
                          "ACTIVE" ? (
                            <Button
                                onClick={this.closeItemOrderConfirm}
                                style={{
                                    margin: 20,
                                    backgroundColor: "#ff0000",
                                    color: "#ffffff"
                                }}
                            >
                                Close Item Order
                            </Button>
                        ) : undefined}
                    </Card>
                </div>
                <style jsx>{`
                    .initial-page {
                        display: flex;
                        height: 100%;
                        width: 100%;
                        flex-direction: column;
                    }

                    .main-display {
                        width: 100%;
                    }

                    .filters {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-evenly;
                    }

                    .sorts {
                        display: flex;
                        flex-direction: row;
                    }

                    .filters-select {
                        display: flex;
                        flex-direction: column;
                        width: 20%;
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

export async function getServerSideProps(content) {
    const query = content.query

    return {
        props: {
            query: query
        }
    }
}

export default withRouter(withApollo(ItemQuotations))

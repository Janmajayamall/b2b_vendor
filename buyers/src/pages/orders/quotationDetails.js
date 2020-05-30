import React from "react"
import { Table, Alert, Card, Button, Divider, Select, Typography, Checkbox, Spin, Space } from "antd"
import { withRouter } from "next/router"
import { BUYER_GET_ITEM_DETAILS, GET_QUOTATION_DETAILS } from "../../graphql/apolloQueries/index"
import { withApollo } from "react-apollo"
import Link from "next/link"
import { LoadingOutlined } from "@ant-design/icons"
const { Text } = Typography
const { Option } = Select

const defaultErrorState = {
    error: false,
    text: "",
    description: ""
}

const productColumns = [
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

const quotationItemColumn = [
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
    }
]

const quotationCostColumn = [
    {
        title: "Price Per Unit",
        dataIndex: "quotedPricePerUnit",
        render: (text, record) => <div>{`${record.quotedQuantity} ${record.quotedUnit}`}</div>
    },
    {
        title: "Total Price",
        dataIndex: "quotedQuantityPrice",
        render: (text, record) => <div>{`${record.quotedQuantity} ${record.quotedUnit}`}</div>
    },
    {
        title: "Discount",
        dataIndex: "quotedDiscount",
        render: (text, record) => <div>{`${record.quotedQuantity} ${record.quotedUnit}`}</div>
    },
    {
        title: "Delivery Cost",
        dataIndex: "quotedDeliveryCost",
        render: (text, record) => <div>{`${record.quotedQuantity} ${record.quotedUnit}`}</div>
    },
    {
        title: "Landing Price",
        dataIndex: "quotedLandingPrice",
        render: (text, record) => <div>{`${record.quotedQuantity} ${record.quotedUnit}`}</div>
    }
]

const quotationCompanyColumn = [
    {
        title: "Vendor Name",
        dataIndex: "vendorName"
    },
    {
        title: "Company Name",
        dataIndex: "vendorCompanyName"
    },
    {
        title: "City",
        dataIndex: "vendorCompanyCit"
    }
]

class QuotationDetails extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            //other details
            orderId: this.props.query.orderId,
            quotationId: this.props.query.quotationId,

            itemDetails: [],
            quotationDetails: [],

            //loading states
            itemDetailsLoading: true,
            quotationDetailsLoading: true,

            error: defaultErrorState
        }
        console.log(this.props.router.query.orderId, "dadada")
    }

    componentDidMount() {
        this.getItemDetails()
        this.getQuotationDetails()
    }

    getItemDetails = async () => {
        const orderId = this.state.orderId

        if (orderId == undefined) {
            this.setState({
                itemDetailsLoading: false,
                error: {
                    error: true,
                    text: "Sorry!",
                    description: "Something went wrong! Please try again later!"
                }
            })
            return
        }

        try {
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
            console.log("error quotationDetails: ", e)
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

    getQuotationDetails = async () => {
        const quotationId = this.state.quotationId

        if (quotationId == undefined) {
            this.setState({
                quotationDetailsLoading: false,
                error: {
                    error: true,
                    text: "Sorry!",
                    description: "Something went wrong! Please try again later!"
                }
            })
            return
        }

        try {
            const { data } = await this.props.client.query({
                query: GET_QUOTATION_DETAILS,
                variables: {
                    quotationId: quotationId
                },
                fetchPolicy: "no-cache"
            })
            const { getQuotationDetails } = data
            this.setState({
                quotationDetailsLoading: false,
                quotationDetails: [getQuotationDetails]
            })
        } catch (e) {
            console.log("error quotationDetails: ", e)
            this.setState({
                error: {
                    error: true,
                    text: "Error!",
                    description: "Something went wrong! Please try again later"
                },
                quotationDetailsLoading: false
            })
        }
    }

    changeToUnderReview = () => {
        const quotationId = this.state.quotationId

        if (quotationId == undefined) {
            return
        }

        //TODO: short list
    }

    finalizeQuotation = () => {
        const quotationId = this.state.quotationId

        if (quotationId == undefined) {
            return
        }
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

    render() {
        return (
            <div className="initial-page">
                <div className="main_display">
                    <Card
                        title="Quotation Details"
                        style={{
                            height: "100%",
                            width: "100%"
                        }}
                    >
                        {this.state.error.error === true ? this.renderError() : undefined}
                        <Card title="Item Details" type="inner">
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
                                />
                            )}
                        </Card>
                        <Card title="Quotation" type="inner">
                            {this.state.quotationDetailsLoading === true ? (
                                <div className="spinner-div">
                                    <Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} tip="Loading" />
                                </div>
                            ) : (
                                <div>
                                    <Table
                                        style={{
                                            height: "100%",
                                            width: "100%"
                                        }}
                                        columns={quotationItemColumn}
                                        dataSource={this.state.quotationDetails}
                                    />
                                    <Table
                                        style={{
                                            height: "100%",
                                            width: "100%"
                                        }}
                                        columns={quotationCostColumn}
                                        dataSource={this.state.quotationDetails}
                                    />
                                    <Table
                                        style={{
                                            height: "100%",
                                            width: "100%"
                                        }}
                                        columns={quotationCompanyColumn}
                                        dataSource={this.state.quotationDetails}
                                    />
                                    <div className="bottom-buttons">
                                        <Button
                                            style={{ marginBottom: 10 }}
                                            onClick={this.changeToUnderReview}
                                            type={"primary"}
                                        >
                                            Mark this quotation
                                        </Button>
                                        <Button onClick={this.finalizeQuotation} type={"primary"}>
                                            Finalize this quotation
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Card>
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

                    .spinner-div {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .bottom-buttons {
                        display: flex;
                        flex-direction: column;
                        width: 15%;
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

export default withRouter(withApollo(QuotationDetails))

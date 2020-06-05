import React from "react"
import { Table, Alert, Card, Button, Divider, Select, Typography, Checkbox, Spin, Modal } from "antd"
import { withRouter } from "next/router"
import {
    BUYER_GET_ITEM_DETAILS,
    GET_QUOTATION_DETAILS,
    BUYER_MARK_UNDER_REVIEW_QUOTATION,
    BUYER_UNMARK_UNDER_REVIEW_QUOTATION,
    BUYER_FINALIZE_QUOTATION
} from "../../graphql/apolloQueries/index"
import { withApollo } from "react-apollo"
import Link from "next/link"
import { LoadingOutlined, ReloadOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
import { constants } from "./../../utils/index"
const { Text } = Typography
const { Option } = Select
const { confirm } = Modal

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
    },
    {
        title: "Attached File",
        dataIndex: "productFile",
        render: (text, record) => {
            if (record.productFile === "") {
                return <div>No File</div>
            } else {
                return <a href={`${constants.B2B_BUCKET_S3_PUBLIC_URL}/${record.productFile}`}>Download</a>
            }
        }
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
    },
    {
        title: "Attached File",
        dataIndex: "quotedProductFile",
        render: (text, record) => {
            if (record.quotedProductFile === "") {
                return <div>No File</div>
            } else {
                return <a href={`${constants.B2B_BUCKET_S3_PUBLIC_URL}/${record.quotedProductFile}`}>Download</a>
            }
        }
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
            //button loadin states
            changeToReviewLoading: false,
            changeToQuotedLoading: false,
            finalizeQuotationLoading: false,

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

        //set quotationDetailsLoading to true
        this.setState({
            quotationDetailsLoading: true,
            error: defaultErrorState
        })

        try {
            const { data } = await this.props.client.query({
                query: GET_QUOTATION_DETAILS,
                variables: {
                    quotationId: quotationId
                },
                fetchPolicy: "no-cache"
            })
            const { getQuotationDetails } = data
            console.log(getQuotationDetails, "add")
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

    changeToReview = async () => {
        const quotationId = this.state.quotationId

        if (quotationId == undefined) {
            return
        }

        if (
            this.state.changeToQuotedLoading === true ||
            this.state.changeToReviewLoading === true ||
            this.state.finalizeQuotationLoading === true
        ) {
            return
        }

        //set changeToReviewLoading to true
        this.setState({
            changeToReviewLoading: true,
            error: defaultErrorState
        })

        try {
            const { data } = await this.props.client.mutate({
                mutation: BUYER_MARK_UNDER_REVIEW_QUOTATION,
                variables: {
                    quotationId: quotationId
                }
            })

            const { buyerMarkUnderReviewQuotation } = data
            if (buyerMarkUnderReviewQuotation.error === constants.errorCodes.noError) {
                this.setState({
                    changeToReviewLoading: false
                })

                this.getQuotationDetails()
            } else {
                throw new Error(`response - ${buyerMarkUnderReviewQuotation.error}`)
            }
        } catch (e) {
            console.log("changeToReview quotationDetails.js with error: ", e)
            this.setState({
                changeToReviewLoading: false,
                error: {
                    error: true,
                    text: "Error!",
                    description: "Sorry something went wrong, please try again later!"
                }
            })
        }
    }

    changeToQuoted = async () => {
        const quotationId = this.state.quotationId

        if (quotationId == undefined) {
            return
        }

        if (
            this.state.changeToQuotedLoading === true ||
            this.state.changeToReviewLoading === true ||
            this.state.finalizeQuotationLoading === true
        ) {
            return
        }

        //set changeToQuotedLoading to true
        this.setState({
            changeToQuotedLoading: true,
            error: defaultErrorState
        })

        try {
            const { data } = await this.props.client.mutate({
                mutation: BUYER_UNMARK_UNDER_REVIEW_QUOTATION,
                variables: {
                    quotationId: quotationId
                }
            })
            const { buyerUnmarkUnderReviewQuotation } = data
            if (buyerUnmarkUnderReviewQuotation.error === constants.errorCodes.noError) {
                this.setState({
                    changeToQuotedLoading: false
                })
                this.getQuotationDetails()
            } else {
                throw new Error(`response - ${buyerUnmarkUnderReviewQuotation.error}`)
            }
        } catch (e) {
            console.log("changeToQuoted quotationDetails.js with error: ", e)
            this.setState({
                changeToQuotedLoading: false,
                error: {
                    error: true,
                    text: "Error!",
                    description: "Sorry something went wrong, pleas try again later!"
                }
            })
        }
    }

    finalizeQuotation = async () => {
        const quotationId = this.state.quotationId
        const orderId = this.state.orderId

        if (quotationId == undefined || orderId == undefined) {
            return
        }

        if (
            this.state.changeToQuotedLoading === true ||
            this.state.changeToReviewLoading === true ||
            this.state.finalizeQuotationLoading === true
        ) {
            return
        }

        //set finalizeQuotationLoading to true
        this.setState({
            finalizeQuotationLoading: true,
            error: defaultErrorState
        })

        try {
            const { data } = await this.props.client.mutate({
                mutation: BUYER_FINALIZE_QUOTATION,
                variables: {
                    quotationId: quotationId,
                    orderId: orderId
                }
            })
            const { buyerFinalizeQuotation } = data
            if (buyerFinalizeQuotation.error === constants.errorCodes.noError) {
                this.setState({
                    finalizeQuotationLoading: false
                })
                this.getQuotationDetails()
            } else {
                throw new Error(`response - ${buyerFinalizeQuotation.error}`)
            }
        } catch (e) {
            console.log("finalizedQuotation quotationDetails.js with error: ", e)
            this.setState({
                finalizeQuotationLoading: false,
                error: {
                    error: true,
                    text: "Error!",
                    description: "Sorry something went wrong, pleas try again later!"
                }
            })
        }
        return
    }

    finalizeQuotationConfirmation = async () => {
        const parentThis = this
        confirm({
            title: "Finalize the quotation",
            icon: <ExclamationCircleOutlined />,
            content:
                "Please note that after finalizing this quotation, rest of the quotations for the item order will be rejected & this Item order will be closed.",
            onOk() {
                return new Promise(async (resolve, reject) => {
                    await parentThis.finalizeQuotation()
                    resolve(true)
                })
            },
            onCancel() {}
        })
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
                        extra={
                            this.state.quotationDetails[0] ? (
                                this.state.quotationDetails[0].status === "REJECTED" ? (
                                    <Text type="danger" strong>
                                        QUOTATION REJECTED
                                    </Text>
                                ) : this.state.quotationDetails[0].status === "ACCEPTED" ? (
                                    <Text type="secondary" strong>
                                        QUOTATION FINALIZED
                                    </Text>
                                ) : undefined
                            ) : undefined
                        }
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
                                    pagination={false}
                                />
                            )}
                        </Card>
                        <Card
                            title="Quotation"
                            type="inner"
                            extra={
                                <Button onClick={this.getQuotationDetails} type={"primary"} icon={<ReloadOutlined />} />
                            }
                        >
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
                                        pagination={false}
                                    />
                                    <Table
                                        style={{
                                            height: "100%",
                                            width: "100%"
                                        }}
                                        columns={quotationCostColumn}
                                        dataSource={this.state.quotationDetails}
                                        pagination={false}
                                    />
                                    <Table
                                        style={{
                                            height: "100%",
                                            width: "100%"
                                        }}
                                        columns={quotationCompanyColumn}
                                        dataSource={this.state.quotationDetails}
                                        pagination={false}
                                    />
                                    <div className="bottom-buttons">
                                        {this.state.quotationDetails[0].status === "QUOTED" ? (
                                            <Button
                                                style={{ marginBottom: 10 }}
                                                onClick={this.changeToReview}
                                                type={"primary"}
                                                loading={this.state.changeToReviewLoading}
                                            >
                                                Mark quotation
                                            </Button>
                                        ) : undefined}
                                        {this.state.quotationDetails[0].status === "REVIEW" ? (
                                            <Button
                                                style={{ marginBottom: 10 }}
                                                onClick={this.changeToQuoted}
                                                type={"primary"}
                                                loading={this.state.changeToQuotedLoading}
                                            >
                                                Unmark quotation
                                            </Button>
                                        ) : undefined}
                                        {this.state.quotationDetails[0].status === "QUOTED" ||
                                        this.state.quotationDetails[0].status === "REVIEW" ? (
                                            <Button
                                                onClick={this.finalizeQuotationConfirmation}
                                                type={"primary"}
                                                loading={this.state.finalizeQuotationLoading}
                                            >
                                                Finalize quotation
                                            </Button>
                                        ) : undefined}
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

import React from "react"
import { Button, Form, Input, Alert, Card, Descriptions, Typography, Spin, InputNumber, Space, Divider } from "antd"
import { LoadingOutlined, QuestionOutlined } from "@ant-design/icons"
import { withRouter } from "next/router"
import {
    LOGIN_VENDOR,
    GET_ITEM_ORDER_DETAILS,
    REJECT_ITEM_ORDER,
    UPDATE_VENDOR_ORDER_DETAILS
} from "../../graphql/apolloQueries/index"
import { withApollo } from "react-apollo"
import { constants, setJwt } from "./../../utils/index"

const defaultErrorState = {
    error: false,
    text: "",
    description: ""
}

class ItemOrderDetails extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            //loading states
            loading: true,
            rejectLoading: false,
            submitLoading: false,

            error: defaultErrorState,

            orderItem: {},
            quotation: {}
        }
    }

    componentDidMount() {
        this.getItemOrderDetails()
    }

    rejectItemOrder = async () => {
        if (this.state.orderItem.orderId === undefined) {
            return
        }

        //return if any loading is true
        if (this.state.loading === true || this.state.rejectLoading === true || this.state.submitLoading === true) {
            return
        }

        //set Loading true
        this.setState({
            loading: false,
            submitLoading: false,
            rejectLoading: true,
            error: defaultErrorState
        })

        try {
            const { data } = await this.props.client.mutate({
                mutation: REJECT_ITEM_ORDER,
                variables: {
                    orderId: this.state.orderItem.orderId
                }
            })

            this.props.router.push("/exploreItemOrders")
        } catch (e) {
            this.setState({
                loading: false,
                submitLoading: false,
                rejectLoading: false,
                error: {
                    error: true,
                    text: "Sorry!",
                    description: "Something went wrong. Please try again later!"
                }
            })
        }
    }

    getItemOrderDetails = async () => {
        const orderId = this.props.router.query.orderId
        console.log(orderId)
        if (orderId === undefined) {
            this.setState({
                error: {
                    error: true,
                    text: "Order ID Error",
                    description: "Something went wrong"
                },
                loading: false,
                rejectLoading: false,
                submitLoading: false
            })
            return
        }

        try {
            const { data } = await this.props.client.query({
                query: GET_ITEM_ORDER_DETAILS,
                variables: {
                    orderId: orderId
                },
                fetchPolicy: "no-cache"
            })
            const { getItemOrderDetails } = data

            //check for error
            if (getItemOrderDetails.error !== constants.errorCodes.noError) {
                this.setState({
                    error: {
                        error: true,
                        text: "Sorry!",
                        description: "Sorry something went wrong!"
                    },
                    loading: false,
                    rejectLoading: false,
                    submitLoading: false
                })
            }

            //getting quotation object
            const quotation = getItemOrderDetails.itemOrder

            this.setState({
                orderItem: getItemOrderDetails.itemOrder,
                quotation: quotation,
                loading: false,
                rejectLoading: false,
                submitLoading: false
            })
        } catch (e) {
            console.log("Not able to get order details with error: ", e)
            this.setState({
                error: {
                    error: true,
                    text: "Sorry!",
                    description: "Sorry something went wrong!"
                },
                loading: false,
                rejectLoading: false,
                submitLoading: false
            })
        }
    }

    generateProductParametersDisplay = (productParameters) => {
        if (productParameters === undefined) {
            return
        }

        const parameters = JSON.parse(productParameters)

        if (Object.keys(parameters).length === 0) {
            return
        }

        return (
            <Descriptions.Item label="Product Parameters">
                {Object.keys(parameters).map((parameter) => {
                    return (
                        <div className="product-parameter-div">
                            <Typography.Text strong={true}>{`${parameter}: `}</Typography.Text>
                            <Typography.Text>{parameters[parameter]}</Typography.Text>
                            <Divider />
                        </div>
                    )
                })}
            </Descriptions.Item>
        )
    }

    generateQuotedProductParametersDisplay = (quotedProductParameters) => {
        if (quotedProductParameters === undefined) {
            return
        }

        const parameters = JSON.parse(quotedProductParameters)
        if (Object.keys(parameters).length === 0) {
            return
        }

        return (
            <Form.Item label="Product Parameters" name="quotedProductParameters">
                {Object.keys(parameters).map((parameter) => {
                    return (
                        <Form.Item initialValue={parameters[parameter]} label={parameter} name={parameter}>
                            <Input />
                        </Form.Item>
                    )
                })}
            </Form.Item>
        )
    }

    renderItemOrderDetails = () => {
        return (
            <div>
                <Descriptions
                    style={{ marginBottom: 10 }}
                    title={<Typography.Text strong={true}>Buyer Details</Typography.Text>}
                    bordered
                >
                    <Descriptions.Item label="Company Name">{this.state.orderItem.companyName}</Descriptions.Item>
                    <Descriptions.Item label="Contact Person Name">{this.state.orderItem.buyerName}</Descriptions.Item>
                    <Descriptions.Item label="Company City">{this.state.orderItem.companyCity}</Descriptions.Item>
                    <Descriptions.Item label="Company State">{this.state.orderItem.companyState}</Descriptions.Item>
                    <Descriptions.Item label="Company Country">{this.state.orderItem.companyCountry}</Descriptions.Item>
                </Descriptions>
                <Descriptions title={<Typography.Text strong={true}>Product Details</Typography.Text>} bordered>
                    <Descriptions.Item label="Product Name">{this.state.orderItem.productName}</Descriptions.Item>
                    <Descriptions.Item label="Product Description">
                        {this.state.orderItem.productDescription}
                    </Descriptions.Item>
                    {this.generateProductParametersDisplay(this.state.orderItem.productParameters)}
                    <Descriptions.Item label="Product Quantity">{`${this.state.orderItem.quantity} ${this.state.orderItem.unit}`}</Descriptions.Item>
                    <Descriptions.Item label="Deliver In (Days)">{`${this.state.orderItem.deliveryDays}`}</Descriptions.Item>
                </Descriptions>
                <Divider />
            </div>
        )
    }

    renderQuotationInput = () => {
        return (
            <Form onFinish={this.submitVendorOrderDetails} layout={"vertical"} initialValues={this.state.quotation}>
                <Form.Item
                    label="Product Name"
                    name="quotedProductName"
                    rules={[
                        {
                            required: false
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Product Description"
                    name="quotedProductDescription"
                    rules={[
                        {
                            required: false
                        }
                    ]}
                >
                    <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
                </Form.Item>

                {this.generateQuotedProductParametersDisplay(this.state.quotation.quotedProductParameters)}

                <Form.Item
                    label="Product Quantity"
                    name="quotedQuantity"
                    rules={[
                        {
                            required: false
                        }
                    ]}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item
                    label="Product Unit"
                    name="quotedUnit"
                    rules={[
                        {
                            required: false
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Price Per Unit"
                    name="quotedPricePerUnit"
                    rules={[
                        {
                            required: false
                        }
                    ]}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item
                    label="Quantity Total Price"
                    name="quotedQuantityPrice"
                    rules={[
                        {
                            required: false
                        }
                    ]}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item
                    label="Discount (in Amount)"
                    name="quotedDiscount"
                    rules={[
                        {
                            required: false
                        }
                    ]}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item
                    label="Delivery Cost"
                    name="quotedDeliveryCost"
                    rules={[
                        {
                            required: false
                        }
                    ]}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item
                    label="Landing Price"
                    name="quotedLandingPrice"
                    rules={[
                        {
                            required: false
                        }
                    ]}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item
                    label="Currency"
                    name="quotedPriceCurrency"
                    rules={[
                        {
                            required: false
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Quotation Validity (in Days)"
                    name="quotedValidity"
                    rules={[
                        {
                            required: false
                        }
                    ]}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item
                    label="Estimated Delivery Time (in Days)"
                    name="quotedDeliveryDays"
                    rules={[
                        {
                            required: false
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={`Terms & Conditions and Other details`}
                    name="quotedTermsAndConditions"
                    rules={[
                        {
                            required: false
                        }
                    ]}
                >
                    <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
                </Form.Item>

                <Form.Item>
                    <Button loading={this.state.submitLoading} type="primary" htmlType="submit">
                        Submit Quotation
                    </Button>
                </Form.Item>
            </Form>
        )
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

    submitVendorOrderDetails = async (values) => {
        if (Object.keys(this.state.orderItem).length === 0) {
            return
        }

        //return if any loading is true
        if (this.state.loading === true || this.state.rejectLoading === true || this.state.submitLoading === true) {
            return
        }

        //state submitLoading to true
        this.setState({
            loading: false,
            rejectLoading: false,
            submitLoading: true,
            error: defaultErrorState
        })

        try {
            //generate vendor update input
            let updateVendorOrderDetails = {
                ...values
            }

            //generate product parameters
            if (Object.keys(JSON.parse(this.state.orderItem.quotedProductParameters)).length === 0) {
                updateVendorOrderDetails.quotedProductParameters = this.state.orderItem.quotedProductParameters
            } else {
                const buyerProductParameters = JSON.parse(this.state.orderItem.quotedProductParameters)
                let vendorProductParameters = {}
                let errorFlag = false
                Object.keys(buyerProductParameters).forEach((key) => {
                    if (updateVendorOrderDetails[key]) {
                        vendorProductParameters[key] = updateVendorOrderDetails[key]
                    } else {
                        errorFlag = true
                    }
                })
                if (errorFlag === true) {
                    this.setState({
                        loading: false,
                        rejectLoading: false,
                        submitLoading: false
                    })
                    return
                }
                vendorProductParameters = JSON.stringify(vendorProductParameters)
                updateVendorOrderDetails.quotedProductParameters = vendorProductParameters
            }

            //submit vendor order details update
            const { data } = await this.props.client.mutate({
                mutation: UPDATE_VENDOR_ORDER_DETAILS,
                variables: {
                    orderId: this.state.orderItem.orderId,
                    updateVendorOrderDetailsInput: {
                        quotedProductName: updateVendorOrderDetails.quotedProductName,
                        quotedProductDescription: updateVendorOrderDetails.quotedProductDescription,
                        quotedProductParameters: updateVendorOrderDetails.quotedProductParameters,
                        quotedPricePerUnit: parseFloat(updateVendorOrderDetails.quotedPricePerUnit),
                        quotedQuantityPrice: parseFloat(updateVendorOrderDetails.quotedQuantityPrice),
                        quotedQuantity: parseFloat(updateVendorOrderDetails.quotedQuantity),
                        quotedUnit: updateVendorOrderDetails.quotedUnit,
                        quotedDiscount: parseFloat(updateVendorOrderDetails.quotedDiscount),
                        quotedDeliveryCost: parseFloat(updateVendorOrderDetails.quotedDeliveryCost),
                        quotedLandingPrice: updateVendorOrderDetails.quotedLandingPrice,
                        quotedPriceCurrency: updateVendorOrderDetails.quotedPriceCurrency,
                        quotedValidity: parseFloat(updateVendorOrderDetails.quotedValidity),
                        quotedDeliveryDays: updateVendorOrderDetails.quotedDeliveryDays,
                        quotedTermsAndConditions: updateVendorOrderDetails.quotedTermsAndConditions
                    }
                }
            })

            //check for error
            if (data.updateVendorOrderDetails.error !== constants.errorCodes.noError) {
                this.setState({
                    loading: false,
                    submitLoading: false,
                    rejectLoading: false,
                    error: {
                        error: true,
                        text: "Sorry! Something went wrong!",
                        description: "Please try again after sometime."
                    }
                })
                return
            }

            //TODO: inform user that the quote has been submitted
            this.setState({
                loading: false,
                submitLoading: false,
                rejectLoading: false,
                error: defaultErrorState
            })

            this.getItemOrderDetails()
        } catch (e) {
            this.setState({
                loading: false,
                submitLoading: false,
                rejectLoading: false,
                error: {
                    error: true,
                    text: "Sorry! Something went wrong!",
                    description: "Please try again after sometime."
                }
            })
        }
    }

    render() {
        if (this.state.loading === true) {
            return (
                <div className="initial-page">
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} tip="Loading" />
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

        return (
            <div className="initial-page">
                <Card
                    title={"Item Order Details"}
                    style={{
                        width: "100%",
                        height: "100%",
                        flex: 1
                    }}
                    extra={
                        <Button loading={this.state.rejectLoading} onClick={this.rejectItemOrder} type={"primary"}>
                            Not Interested
                        </Button>
                    }
                >
                    {this.state.error.error === true ? this.renderError() : undefined}
                    {Object.keys(this.state.orderItem).length > 0 ? this.renderItemOrderDetails() : undefined}
                    {Object.keys(this.state.quotation).length > 0 ? this.renderQuotationInput() : undefined}
                </Card>
                <style jsx>{`
                    .initial-page {
                        display: flex;
                        width: 100%;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }

                    .product-parameter-div {
                        display: flex;
                        flex-direction: row;
                    }
                `}</style>
            </div>
        )
    }
}

export default withRouter(withApollo(ItemOrderDetails))

import React from "react"
import {
    Button,
    Form,
    Input,
    Alert,
    Card,
    Descriptions,
    Typography,
    Spin,
    InputNumber,
    Divider,
    Table,
    Upload
} from "antd"
import { LoadingOutlined, UploadOutlined, CloseCircleFilled } from "@ant-design/icons"
import { withRouter } from "next/router"
import {
    GET_VENDOR_ORDER_DETAILS,
    REJECT_ITEM_ORDER,
    UPDATE_VENDOR_ORDER_DETAILS,
    GET_SIGNED_URL_PUT_OBJECT
} from "../../graphql/apolloQueries/index"
import { withApollo } from "react-apollo"
import { constants, setJwt } from "./../../utils/index"
import { v4 as uuidv4 } from "uuid"
import axios from "axios"
const { Text } = Typography

const defaultErrorState = {
    error: false,
    text: "",
    description: ""
}

const buyerDetailsColumn = [
    {
        title: "Company Name",
        dataIndex: "companyName"
    },
    {
        title: "Contact Person Name",
        dataIndex: "buyerName"
    },
    {
        title: "City",
        dataIndex: "companyCity"
    },
    {
        title: "State",
        dataIndex: "companyState"
    },
    {
        title: "Country",
        dataIndex: "companyCountry"
    }
]

const buyerProductDetails = [
    {
        title: "Order Id",
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
        title: "Product Quantity",
        dataIndex: "productQuantity"
    },
    {
        title: "Product Delivery Time (expected) (in Days)",
        dataIndex: "deliveryDays"
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

class ItemOrderDetails extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            //loading states
            loading: true,
            rejectLoading: false,
            submitLoading: false,
            editMode: false,

            error: defaultErrorState,

            quotation: {},

            uploadedQuotationFile: undefined
        }
    }

    componentDidMount() {
        this.getItemOrderDetails()
    }

    rejectItemOrder = async () => {
        if (this.state.quotation.orderId === undefined) {
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
                    orderId: this.state.quotation.orderId
                }
            })

            this.setState({
                rejectLoading: false
            })

            this.getItemOrderDetails()
            // this.props.router.push("/exploreItemOrders")
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
        const orderId = this.props.query.orderId
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

        this.setState({
            loading: true,
            submitLoading: false,
            rejectLoading: false,
            error: defaultErrorState
        })

        try {
            const { data } = await this.props.client.query({
                query: GET_VENDOR_ORDER_DETAILS,
                variables: {
                    orderId: orderId
                },
                fetchPolicy: "no-cache"
            })
            const { getVendorOrderDetails } = data

            //check for error
            if (getVendorOrderDetails.error !== constants.errorCodes.noError) {
                // this.setState({
                //     error: {
                //         error: true,
                //         text: "Sorry!",
                //         description: "Sorry something went wrong!"
                //     },
                //     loading: false,
                //     rejectLoading: false,
                //     submitLoading: false
                // })
                // return
                throw new Error(getVendorOrderDetails.error)
            }

            //getting quotation object
            const quotation = getVendorOrderDetails.itemOrder
            console.log(quotation)

            this.setState({
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

    removeAlreadyInPlaceFile = () => {
        //TODO: remove the file from AWS
        console.log
        this.setState({
            quotation: {
                ...this.state.quotation,
                quotedProductFile: ""
            }
        })
    }

    renderItemOrderDetails = () => {
        return (
            <div>
                <Card title="Buyer Details" type="inner">
                    <Table
                        style={{
                            height: "100%",
                            width: "100%"
                        }}
                        columns={buyerDetailsColumn}
                        dataSource={[this.state.quotation]}
                        pagination={false}
                    />
                </Card>
                <Card title="Product Details" type="inner">
                    <Table
                        style={{
                            height: "100%",
                            width: "100%"
                        }}
                        columns={buyerProductDetails}
                        dataSource={[this.state.quotation]}
                        pagination={false}
                    />
                </Card>
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

                {this.state.quotation.quotedProductFile !== "" ? (
                    <div className="upload-box">
                        <Text>Uploaded Files (1) : </Text>
                        <a href={`${constants.B2B_BUCKET_S3_PUBLIC_URL}/${this.state.quotation.quotedProductFile}`}>
                            Click to download
                        </a>
                        <Button
                            style={{ marginLeft: 5 }}
                            onClick={this.removeAlreadyInPlaceFile}
                            icon={<CloseCircleFilled style={{ color: "#ff0000" }} />}
                        />
                    </div>
                ) : (
                    <div className="upload-box">
                        <Upload
                            onRemove={(file) => {
                                this.setState({
                                    uploadedQuotationFile: undefined
                                })
                            }}
                            beforeUpload={(file) => {
                                this.setState({
                                    uploadedQuotationFile: file
                                })
                            }}
                            fileList={
                                this.state.uploadedQuotationFile == undefined ? [] : [this.state.uploadedQuotationFile]
                            }
                        >
                            <Button>
                                <UploadOutlined /> Upload a file
                            </Button>
                        </Upload>
                    </div>
                )}

                <Form.Item>
                    <Button
                        style={{ marginRight: 20 }}
                        loading={this.state.submitLoading}
                        type="primary"
                        htmlType="submit"
                    >
                        Submit Quotation
                    </Button>
                    <Button
                        onClick={() => {
                            this.setState({
                                editMode: false
                            })
                            this.getItemOrderDetails()
                        }}
                        type="primary"
                    >
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        )
    }

    renderQuotationTable = () => {
        const columns = [
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
                dataIndex: "quantity",
                render: (_, item) => <div>{`${item.quotedQuantity} ${item.quotedUnit}`}</div>
            },
            {
                title: "Price Per Unit",
                dataIndex: "quotedPricePerUnit"
            },
            {
                title: "Total Price",
                dataIndex: "quotedQuantityPrice"
            },
            {
                title: "Discount",
                dataIndex: "quotedDiscount"
            },
            {
                title: "Delivery Cost",
                dataIndex: "quotedDeliveryCost"
            },
            {
                title: "Landing Price",
                dataIndex: "quotedLandingPrice"
            },
            {
                title: "Validity",
                dataIndex: "quotedValidity"
            },
            {
                title: "Delivery Time (in Days)",
                dataIndex: "quotedDeliveryDays"
            },
            {
                title: "Terms and conditions",
                dataIndex: "quotedTermsAndConditions"
            },
            {
                title: "Attached file",
                dataIndex: "quotedProductFile"
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
            }
        ]

        return <Table columns={columns} dataSource={[this.state.quotation]} />
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
        if (Object.keys(this.state.quotation).length === 0) {
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
                ...values,
                quotedProductFile: this.state.quotation.quotedProductFile
            }

            //checking & uploading, if file is selected, file to s3
            if (this.state.uploadedQuotationFile != undefined) {
                const fileName = await this.uploadItemFileToS3(this.state.uploadedQuotationFile)
                updateVendorOrderDetails.quotedProductFile = fileName
                console.log(fileName, "file uploaded 2")
            }

            //generate product parameters
            if (Object.keys(JSON.parse(this.state.quotation.quotedProductParameters)).length === 0) {
                updateVendorOrderDetails.quotedProductParameters = this.state.quotation.quotedProductParameters
            } else {
                const buyerProductParameters = JSON.parse(this.state.quotation.quotedProductParameters)
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
                    orderId: this.state.quotation.orderId,
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
                        quotedTermsAndConditions: updateVendorOrderDetails.quotedTermsAndConditions,
                        quotedProductFile: updateVendorOrderDetails.quotedProductFile
                    }
                }
            })

            //check for error
            if (data.updateVendorOrderDetails.error !== constants.errorCodes.noError) {
                // this.setState({
                //     loading: false,
                //     submitLoading: false,
                //     rejectLoading: false,
                //     error: {
                //         error: true,
                //         text: "Sorry! Something went wrong!",
                //         description: "Please try again after sometime."
                //     }
                // })
                // return
                throw new Error("Error with response: ", data.updateVendorOrderDetails.error)
            }

            //TODO: inform user that the quote has been submitted
            this.setState({
                loading: false,
                submitLoading: false,
                rejectLoading: false,
                editMode: false,
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

    getSignedUrlPutObject = async (fileName, fileMime) => {
        const { data } = await this.props.client.query({
            query: GET_SIGNED_URL_PUT_OBJECT,
            variables: {
                getSignedUrlPutObjectInput: {
                    fileName: fileName,
                    fileMime: fileMime
                }
            }
        })
        const { getSignedUrlPutObject } = data
        return getSignedUrlPutObject
    }

    uploadItemFileToS3 = async (file) => {
        console.log(file, "this is the uploaded file")
        try {
            //changing file name
            //getting file extension
            const fileNameSplit = file.name.split(".")
            const fileExtension = fileNameSplit[fileNameSplit.length - 1]
            const newFileName = `${uuidv4()}.${fileExtension}`

            const signedUrl = await this.getSignedUrlPutObject(newFileName, file.type)
            const response = await axios.put(signedUrl, file)
            console.log(response, "file uploaded")
            return newFileName
        } catch (e) {
            console.log("uploadItemFileS3 createRfq-index with error: ", e)
            return ""
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
                    <Card type="inner">
                        {Object.keys(this.state.quotation).length > 0 ? this.renderItemOrderDetails() : undefined}
                    </Card>
                    <Card
                        type="inner"
                        title="Your Quotation"
                        extra={
                            Object.keys(this.state.quotation).length > 0 ? (
                                this.state.quotation.status === "WAITING" ||
                                this.state.quotation.status === "CANCELLED" ||
                                this.state.quotation.status === "ACCEPTED" ? undefined : this.state.editMode ===
                                  false ? (
                                    <Button
                                        onClick={() => {
                                            this.setState({
                                                editMode: true
                                            })
                                        }}
                                        type={"primary"}
                                    >
                                        Edit
                                    </Button>
                                ) : undefined
                            ) : undefined
                        }
                    >
                        {Object.keys(this.state.quotation).length > 0 ? (
                            this.state.quotation === "CANCELLED" ? (
                                <Text>You have cancelled the quotation for this order. You can no longer quote</Text>
                            ) : this.state.quotation.status === "WAITING" || this.state.editMode === true ? (
                                this.renderQuotationInput()
                            ) : (
                                this.renderQuotationTable()
                            )
                        ) : undefined}
                    </Card>
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

                    .upload-box {
                        margin-bottom: 20px;
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

export default withRouter(withApollo(ItemOrderDetails))

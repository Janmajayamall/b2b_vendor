import React from "react"
import { Table, Button, Select, Card, Upload, notification } from "antd"
import { withRouter } from "next/router"
import { v4 as uuidv4 } from "uuid"
import { withApollo } from "react-apollo"
import {
    GET_TEMP_RFQ,
    CREATE_ITEM_ORDERS,
    BUYER_GET_PREFERRED_VENDORS,
    GET_SIGNED_URL_PUT_OBJECT
} from "../../graphql/apolloQueries"
import { constants } from "./../../utils/index"
import { ReloadOutlined, UploadOutlined } from "@ant-design/icons"
import axios from "axios"

const defaultRFQ = {
    buyerRfqId: `rfqid:::${new Date()}`,
    buyerPrId: `buyerId:::${new Date()}`,
    buyerItemId: `buyerItemId:::${new Date()}`,
    productName: undefined,
    productDescription: `productDescription:::${new Date()}`,
    productParameters: {},
    quantity: 0.0,
    unit: `unit:::${new Date()}`,
    termsAndConditions: `termsAndConditions:::${new Date()}`,
    deliveryDays: "0.0",
    id: undefined
}

class CreateRfq extends React.PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            //values for creating item orders
            rfqTable: [],
            rfqCategories: "",
            chosenPreferredVendorsIdList: [],

            //uploaded files
            uploadedItemFiles: {},

            preferredVendorsList: []
        }
    }

    componentDidMount() {
        //get tempRfq in cache & put it into the state
        this.getTempRfq()
        this.getPreferredVendorsList()
    }

    getPreferredVendorsList = async () => {
        try {
            const { data } = await this.props.client.query({
                query: BUYER_GET_PREFERRED_VENDORS,
                fetchPolicy: "no-cache"
            })
            const { buyerGetPreferredVendors } = data
            console.log(buyerGetPreferredVendors)
            this.setState({
                preferredVendorsList: buyerGetPreferredVendors
            })
        } catch (e) {
            console.log("getPreferredVendorsList createRfq index with error: ", e)
        }
    }

    getTempRfq = async () => {
        const { data } = await this.props.client.query({
            query: GET_TEMP_RFQ //@client local query
        })
        const tempRfq = data.tempRfq
        this.setState({
            rfqTable: tempRfq
        })
    }

    handleCategorySelect = (value) => {
        this.setState({ rfqCategories: value })
    }

    handlePreferredVendorSelect = (value) => {
        console.log(value)
        this.setState({
            chosenPreferredVendorsIdList: value
        })
    }

    onRefreshPreferredVendorsList = () => {
        //refetch preferredVendorsList
        this.getPreferredVendorsList()
    }

    getProductsArray = () => {
        const productArr = []
        this.state.rfqTable.forEach((item) => {
            productArr.push(item.productName)
        })
        return productArr
    }

    submitRfq = async () => {
        const rfqTable = this.state.rfqTable

        if (rfqTable.length === 0) {
            return
        }

        //get final rfq
        const finalRfq = await this.rfqRefine(rfqTable)
        console.log(finalRfq, "about to submit")

        //create item orders request
        try {
            const res = await this.props.client.mutate({
                mutation: CREATE_ITEM_ORDERS,
                variables: {
                    categories: this.state.rfqCategories,
                    products: this.getProductsArray(),
                    items: finalRfq,
                    chosenPreferredVendors: this.state.chosenPreferredVendorsIdList
                }
            })
            console.log(res)
        } catch (e) {
            console.log(e, "CreateItemOrders request function")
        }
    }

    rfqRefine = async (rfq) => {
        const finalRfq = []
        for (let i = 0; i < rfq.length; i++) {
            let newItem = {
                ...rfq[i],
                productFile: ""
            }

            //if image file exists
            if (this.state.uploadedItemFiles[newItem.id] != undefined) {
                const fileUploadName = await this.uploadItemFileToS3(this.state.uploadedItemFiles[newItem.id])
                console.log(fileUploadName, "file name")
                newItem.productFile = fileUploadName
            }

            //deleting unnecessary keys
            delete newItem.id
            delete newItem.__typename

            finalRfq.push(newItem)
        }
        return finalRfq
    }

    openMaxFileSizeNotification = (fileName) => {
        notification.warning({
            message: `${fileName} size too big`
        })
    }

    uploadItemFileLocal = (itemId, file) => {
        if (file.size > constants.limits.maxFileSize) {
            this.openMaxFileSizeNotification(file.name)
            return
        }

        let tempFiles = {
            ...this.state.uploadedItemFiles
        }
        tempFiles[itemId] = file
        this.setState({
            uploadedItemFiles: tempFiles
        })
    }

    removeItemFileLocal = (itemId) => {
        let tempFiles = {
            ...this.state.uploadedItemFiles
        }
        tempFiles[itemId] = undefined
        this.setState({
            uploadedItemFiles: tempFiles
        })
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
        try {
            //getting signed url

            //changing file name
            //getting file extension
            const fileNameSplit = file.name.split(".")
            const fileExtension = fileNameSplit[fileNameSplit.length - 1]
            const newFileName = `${uuidv4()}.${fileExtension}`

            const signedUrl = await this.getSignedUrlPutObject(newFileName, file.type)
            const response = await axios.put(signedUrl, file)
            return newFileName
        } catch (e) {
            console.log("uploadItemFileS3 createRfq-index with error: ", e)
            return ""
        }
    }

    render() {
        const columns = [
            {
                title: "RFQ ID",
                dataIndex: "buyerRfqId"
            },
            {
                title: "PR ID",
                dataIndex: "buyerPrId"
            },
            {
                title: "Item ID",
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
                title: "Product Parameters",
                dataIndex: "productParameters"
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
                title: "Terms & Conditions",
                dataIndex: "termsAndConditions"
            },
            {
                title: "Delivery Days",
                dataIndex: "deliveryDays"
            },
            {
                title: "Attach File",
                dataIndex: "operation",
                width: 100,
                render: (_, item) => {
                    return (
                        <Upload
                            onRemove={(f) => {
                                this.removeItemFileLocal(item.id)
                            }}
                            beforeUpload={(file) => {
                                this.uploadItemFileLocal(item.id, file)
                            }}
                            fileList={
                                this.state.uploadedItemFiles[item.id] == undefined
                                    ? []
                                    : [this.state.uploadedItemFiles[item.id]]
                            }
                            name={uuidv4()}
                        >
                            <Button>
                                <UploadOutlined /> Upload a file
                            </Button>
                        </Upload>
                    )
                }
            }
        ]

        return (
            <div className="initial-page">
                <Card
                    title="Create RFQ"
                    style={{
                        height: "100%",
                        width: "100%"
                    }}
                >
                    <Card title="Enter Item Broad Categories" type="inner">
                        <Select
                            mode="tags"
                            placeholder={"Select Item Categories"}
                            style={{ width: "100%" }}
                            onChange={this.handleCategorySelect}
                            tokenSeparators={[","]}
                        >
                            {[]}
                        </Select>
                    </Card>

                    <Card
                        title="Add Items to order"
                        type="inner"
                        extra={
                            <Button
                                onClick={() => {
                                    this.props.router.push({
                                        pathname: "/createRfq/item",
                                        query: {
                                            ...defaultRFQ,
                                            id: uuidv4()
                                        }
                                    })
                                }}
                                type="primary"
                            >
                                Add New Item
                            </Button>
                        }
                    >
                        <div className="rfq-list">
                            <Table
                                style={{
                                    height: "100%",
                                    width: "100%"
                                }}
                                columns={columns}
                                dataSource={this.state.rfqTable}
                            />
                        </div>
                    </Card>

                    <Card
                        title="Select vendors from preferred vendors list"
                        type="inner"
                        extra={
                            <Button
                                type={"primary"}
                                onClick={this.onRefreshPreferredVendorsList}
                                icon={<ReloadOutlined />}
                            />
                        }
                    >
                        <Select
                            mode="multiple"
                            style={{ width: "100%" }}
                            placeholder="Please select from preferred vendors"
                            onChange={this.handlePreferredVendorSelect}
                            allowClear={true}
                        >
                            {this.state.preferredVendorsList.map((object) => {
                                return <Option key={object.vendorCompanyId}>{object.vendorCompanyName}</Option>
                            })}
                        </Select>
                    </Card>
                    <div className="submit-button">
                        <Button onClick={this.submitRfq} type="primary" disabled={this.state.rfqTable.length === 0}>
                            Submit Items
                        </Button>
                    </div>
                </Card>
                <style jsx>{`
                    .initial-page {
                        display: flex;
                        height: 100%;
                        width: 100%;
                        flex-direction: column;
                    }

                    .rfq-list {
                        width: 100%;
                    }

                    .submit-button {
                        width: 10px;
                        align-self: right;
                    }
                `}</style>
            </div>
        )
    }
}

export default withRouter(withApollo(CreateRfq))

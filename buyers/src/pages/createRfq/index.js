import React from "react"
import { Table, Button, Select } from "antd"
import { withRouter } from "next/router"
import { v4 as uuidv4 } from "uuid"
import { withApollo } from "react-apollo"
import { GET_TEMP_RFQ, CREATE_ITEM_ORDERS } from "../../graphql/apolloQueries"
import { RetryLink } from "apollo-link-retry"

const defaultRFQ = {
    buyerRfqId: `rfqid:::${new Date()}`,
    buyerPrId: `buyerId:::${new Date()}`,
    buyerItemId: `buyerItemId:::${new Date()}`,
    productName: undefined,
    productDescription: `productDescription:::${new Date()}`,
    productParameters: {},
    quantity: 0,
    unit: `unit:::${new Date()}`,
    termsAndConditions: `termsAndConditions:::${new Date()}`,
    deliveryDays: 0,
    id: undefined
}

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
    }
]

class CreateRfq extends React.PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            rfqTable: [],
            rfqCategories: ""
        }
    }

    componentDidMount() {
        //get tempRfq in cache & put it into the state
        this.getTempRfq()
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

    getProductsArray = () => {
        const productArr = []
        this.state.rfqTable.forEach((item) => {
            productArr.push(item.productName)
        })
        return productArr
    }

    submitRfq = async () => {
        if (this.state.rfqTable.length === 0) {
            return
        }

        //get final rfq
        const finalRfq = this.rfqRefine()

        //create item orders request
        try {
            const res = await this.props.client.mutate({
                mutation: CREATE_ITEM_ORDERS,
                variables: {
                    categories: this.state.rfqCategories,
                    products: this.getProductsArray(),
                    items: finalRfq
                }
            })
            console.log(res)
        } catch (e) {
            console.log(e, "CreateItemOrders request function")
        }
    }

    rfqRefine = () => {
        const finalRfq = []
        this.state.rfqTable.forEach((item) => {
            const newItem = {
                ...item,
                quantity: String(item.quantity)
            }

            //deleting unnecessary keys
            delete newItem.id
            delete newItem.__typename

            finalRfq.push(newItem)
        })
        return finalRfq
    }

    render() {
        return (
            <div className="initial-page">
                <Select
                    mode="tags"
                    placeholder={"Select Item Categories"}
                    style={{ width: "100%" }}
                    onChange={this.handleCategorySelect}
                    tokenSeparators={[","]}
                >
                    {[]}
                </Select>
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
                <div className="add-button">
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
                </div>
                <div className="add-button">
                    <Button onClick={this.submitRfq} type="primary" disabled={this.state.rfqTable.length === 0}>
                        Submit Items
                    </Button>
                </div>
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

                    .add-button {
                        width: 10px;
                        align-self: right;
                    }
                `}</style>
            </div>
        )
    }
}

export default withRouter(withApollo(CreateRfq))

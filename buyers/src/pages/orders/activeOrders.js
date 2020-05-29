import React from "react"
import { Table, Alert, Card, Button } from "antd"
import { withRouter } from "next/router"
import { BUYER_GET_ACTIVE_ITEM_ORDERS } from "../../graphql/apolloQueries/index"
import { withApollo } from "react-apollo"
import Link from "next/link"

const defaultErrorState = {
    error: false,
    text: "",
    description: ""
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
        title: "Action",
        key: "operation",
        fixed: "right",
        width: 100,
        render: (_, item) => {
            return (
                <Link href={{ pathname: "/orders/itemQuotations", query: { orderId: item._id } }}>
                    <a>Quotations</a>
                </Link>
            )
        }
    }
]

class ActiveOrders extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            error: defaultErrorState,
            activeItemOrders: []
        }
    }

    componentDidMount() {
        this.getActiveItemOrders()
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

    getActiveItemOrders = async () => {
        //if loading is true then return
        if (this.state.loading === true) {
            return
        }

        //set loading to true
        this.setState({
            loading: true
        })

        try {
            //get active item orders
            const { data } = await this.props.client.query({
                query: BUYER_GET_ACTIVE_ITEM_ORDERS
            })
            const { buyerGetActiveItemOrders } = data
            console.log(buyerGetActiveItemOrders)
            //set active orders in state
            this.setState({
                loading: false,
                error: defaultErrorState,
                activeItemOrders: buyerGetActiveItemOrders
            })
        } catch (e) {
            console.log("error in activeOrder.js: ", e)
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

    evaluateQuotations = (orderId) => {}

    render() {
        return (
            <div className="initial-page">
                <div className="order-list">
                    <Card
                        title="Active Item Orders"
                        style={{
                            height: "100%",
                            width: "100%"
                        }}
                    >
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
                `}</style>
            </div>
        )
    }
}

export default withRouter(withApollo(ActiveOrders))

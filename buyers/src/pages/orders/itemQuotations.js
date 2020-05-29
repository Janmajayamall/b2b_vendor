import React from "react"
import { Table, Alert, Card, Button, Divider } from "antd"
import { withRouter } from "next/router"
import { BUYER_GET_ITEM_DETAILS } from "../../graphql/apolloQueries/index"
import { withApollo } from "react-apollo"
import Link from "next/link"

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
    }
]

const quotationsColumns = [
    {
        title: "RFQ ID",
        dataIndex: "buyerRfqId"
    },
    {
        title: "RFQ ID",
        dataIndex: "buyerRfqId"
    },
    {
        title: "RFQ ID",
        dataIndex: "buyerRfqId"
    },
    {
        title: "RFQ ID",
        dataIndex: "buyerRfqId"
    },
    {
        title: "RFQ ID",
        dataIndex: "buyerRfqId"
    },
    {
        title: "RFQ ID",
        dataIndex: "buyerRfqId"
    }
]

class ItemQuotations extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            error: defaultErrorState,

            itemDetailsLoading: true,
            quotationsLoading: true,

            itemDetails: [],
            orderId: this.props.router.query.orderId
        }
    }

    componentDidMount() {
        this.getItemOrderDetails()
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

    getItemOrderQuotations = async () => {
        const orderId = this.state.orderId

        if (orderId == undefined) {
            this.setState({
                error: {
                    error: true,
                    text: "Error Item Order ID!",
                    description: "Please refresh the page."
                }
            })
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
                <div className="main-display">
                    {this.state.error.error === true ? this.renderError() : undefined}
                    <Card
                        title="Item Order Quotations"
                        style={{
                            height: "100%",
                            width: "100%"
                        }}
                    >
                        <Card title="Your Item Order Details" type="inner">
                            <Table
                                style={{
                                    height: "100%",
                                    width: "100%"
                                }}
                                columns={productColumns}
                                dataSource={this.state.itemDetails}
                            />
                        </Card>
                        <Card title="Quotations from vendors" type="inner">
                            <Divider orientation="left" plain>
                                Filter by
                            </Divider>
                            <Divider orientation="left" plain>
                                Sort by
                            </Divider>
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
                `}</style>
            </div>
        )
    }
}

export default withRouter(withApollo(ItemQuotations))

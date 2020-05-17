import React from "react"
import { Alert, Card, List, Button, Form, Descriptions } from "antd"
import { withRouter } from "next/router"
import { GET_INCOMING_VENDOR_ORDERS } from "../../graphql/apolloQueries/index"
import { withApollo } from "react-apollo"
import { StarOutlined } from "@ant-design/icons"

const defaultErrorState = {
    error: false,
    text: "",
    description: ""
}

class ExploreItemOrders extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            error: defaultErrorState,
            itemOrders: []
        }
    }

    componentDidMount() {
        this.getIncomingOrders()
    }

    getIncomingOrders = async () => {
        try {
            const { data } = await this.props.client.query({
                query: GET_INCOMING_VENDOR_ORDERS,
                fetchPolicy: "no-cache"
            })
            console.log(data.getIncomingVendorOrders)
            this.setState({
                itemOrders: data.getIncomingVendorOrders,
                loading: false
            })
        } catch (e) {
            //error in getting getIncomingItemOrder
            console.log("error in itemOrder: ", e)
            this.setState({ loading: false })
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

    routeOrderDetails = (orderId) => {
        this.props.router.push({
            pathname: "/exploreItemOrders/itemOrderDetails",
            query: {
                orderId: orderId
            }
        })
    }

    renderListItems = (item) => {
        return (
            <List.Item
                actions={[
                    <Button
                        onClick={() => {
                            this.routeOrderDetails(item.orderId)
                        }}
                        type="primary"
                    >
                        {" "}
                        Detail{" "}
                    </Button>
                ]}
            >
                <div>
                    <Descriptions title={item.companyName}>
                        <Descriptions.Item label={"Country"}>{item.companyCountry}</Descriptions.Item>
                    </Descriptions>
                </div>
            </List.Item>
        )
    }

    render() {
        return (
            <div className="initial-page">
                <Card
                    title="Incoming Item Orders"
                    style={{
                        height: "100%",
                        width: "100%"
                    }}
                >
                    <List itemLayout="vertical" dataSource={this.state.itemOrders} renderItem={this.renderListItems} />
                </Card>
                <style jsx>{`
                    .initial-page {
                        display: flex;
                        width: 100%;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }
                `}</style>
            </div>
        )
    }
}

export default withRouter(withApollo(ExploreItemOrders))

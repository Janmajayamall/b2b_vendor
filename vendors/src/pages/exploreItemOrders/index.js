import React from "react"
import { Alert, Card } from "antd"
import { withRouter } from "next/router"
import { GET_INCOMING_VENDOR_ORDERS } from "../../graphql/apolloQueries/index"
import { withApollo } from "react-apollo"

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
            error: defaultErrorState
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
            console.log(data)
        } catch (e) {
            //error in getting getIncomingItemOrder
            console.log("error in itemOrder: ", e)
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
                <Card
                    title="Incoming Item Orders"
                    style={{
                        height: "100%",
                        width: "100%"
                    }}
                ></Card>
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
}

export default withRouter(withApollo(ExploreItemOrders))

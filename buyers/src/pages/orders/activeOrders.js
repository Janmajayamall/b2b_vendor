import React from "react"
import { Button, Form, Input, Alert } from "antd"
import { withRouter } from "next/router"
import { LOGIN_BUYER, BUYER_GET_ACTIVE_ITEM_ORDERS } from "../../graphql/apolloQueries/index"
import { withApollo } from "react-apollo"
import { constants, setJwt } from "./../../utils/index"

const defaultErrorState = {
    error: false,
    text: "",
    description: ""
}

class ActiveOrders extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            error: defaultErrorState
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

        //get active item orders
        const { data } = await this.props.client.query({
            query: BUYER_GET_ACTIVE_ITEM_ORDERS
        })

        console.log(data)
    }

    render() {
        return (
            <div className="initial-page">
                <style jsx>{`
                    .initial-page {
                        display: flex;
                        height: 100%;
                        width: 100%;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }

                    .login-form {
                        width: 50%;
                        display: flex;
                        flex-direction: column;
                    }
                `}</style>
            </div>
        )
    }
}

export default withRouter(withApollo(ActiveOrders))

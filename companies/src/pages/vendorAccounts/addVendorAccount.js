import React from "react"
import { withRouter } from "next/router"
import { REGISTER_VENDOR } from "../../graphql/apolloQueries/index"
import { withApollo } from "react-apollo"
import LoadingSpinner from "./../../components/loadingSpinner/index"
import { Card, Form, Input, Button, Alert } from "antd"
import { constants } from "./../../utils/index"

const defaultErrorState = {
    error: false,
    text: "",
    description: ""
}

class CreateVendorAccount extends React.PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            submitLoading: false,
            error: defaultErrorState
        }
    }

    createSellerAccount = async (values) => {
        //if submitLoading is true return
        if (this.state.submitLoading === true) {
            return
        }

        //set submitLoading to true
        this.setState({
            submitLoading: true,
            error: defaultErrorState
        })

        try {
            //calling req
            const { data } = await this.props.client.mutate({
                mutation: REGISTER_VENDOR,
                variables: values
            })
            const registerVendor = data.registerVendor
            console.log(registerVendor)
            //checking for error
            if (registerVendor.error !== constants.errorCodes.noError) {
                //check for error: email already exists
                if (registerVendor.error === constants.errorCodes.emailExists) {
                    this.setState({
                        error: {
                            error: true,
                            text: "Error Email ID",
                            description: "Email ID already in use"
                        },
                        submitLoading: false
                    })
                    return
                }

                //throw error as error code is unidentified
                throw new Error("Unknown error code: ", registerBuyer.error)
            }

            //go back to buyerAccounts page
            this.props.router.push("/vendorAccounts")
        } catch (e) {
            console.log(`create vendor account error: ${e}`)
            this.setState({
                error: {
                    error: true,
                    text: "ERROR",
                    description: "Sorry something went wrong! Please try again later"
                },
                submitLoading: false
            })
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
                    title="New Seller Account"
                    style={{
                        height: "100%",
                        width: "100%"
                    }}
                >
                    {this.state.error.error === true ? this.renderError() : undefined}

                    <Form layout="vertical" onFinish={this.createSellerAccount}>
                        <Form.Item
                            label="Account Email ID"
                            name="emailId"
                            rules={[
                                {
                                    required: false
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Assign Password"
                            name="password"
                            rules={[
                                {
                                    required: false
                                }
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: false
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Contact Number"
                            name="contactNumber"
                            rules={[
                                {
                                    required: false
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Contact Email Id"
                            name="contactEmailId"
                            rules={[
                                {
                                    required: false
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <Button loading={this.state.submitLoading} type="primary" htmlType="submit">
                                Add Seller
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
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

export default withRouter(withApollo(CreateVendorAccount))

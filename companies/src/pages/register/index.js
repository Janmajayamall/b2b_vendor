import React from "react"
import { Button, Form, Input, InputNumber, Alert } from "antd"
import { withRouter } from "next/router"
import { REGISTER_COMPANY } from "../../graphql/apolloQueries/index"
import { withApollo } from "react-apollo"
import { constants, setJwt, getJwt } from "./../../utils/index"

const defaultErrorState = {
    error: false,
    text: "",
    description: ""
}

class Register extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            error: defaultErrorState
        }
    }

    registerAdmin = async (values) => {
        //if loading then return
        if (this.state.loading === true) {
            return
        }

        //set screen state to loading
        this.setState({
            loading: true,
            error: defaultErrorState
        })

        //registration of the user
        try {
            const { data } = await this.props.client.mutate({
                mutation: REGISTER_COMPANY,
                variables: values,
                fetchPolicy: "no-cache"
            })
            const { registerCompany } = data

            //checking error state
            if (registerCompany.error === constants.errorCodes.emailExists) {
                this.setState({
                    error: {
                        error: true,
                        text: "Error Email ID",
                        description: "Email ID already in use"
                    },
                    loading: false
                })
            }
            console.log(registerCompany)
            //setting jwt
            setJwt(registerCompany.jwt)

            //routing
            if (registerCompany.profileCreated) {
            } else {
                this.props.router.push("/profile/createProfile")
            }
        } catch (e) {
            console.log(e)
            this.setState({
                error: {
                    error: true,
                    text: "ERROR",
                    description: "Sorry something went wrong! Please try again later"
                },
                loading: false
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
                <div className="register-form">
                    {/* rendering Error */}
                    {this.state.error.error === true ? this.renderError() : undefined}

                    <Form
                        style={{ width: "100%" }}
                        className="login-form"
                        layout="vertical"
                        onFinish={this.registerAdmin}
                    >
                        <Form.Item
                            label="Admin Email Id"
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
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: false
                                }
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Register
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <style jsx>{`
                    .initial-page {
                        display: flex;
                        height: 100%;
                        width: 100%;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }

                    .register-form {
                        width: 50%;
                        display: flex;
                        flex-direction: column;
                    }
                `}</style>
            </div>
        )
    }
}

export default withRouter(withApollo(Register))

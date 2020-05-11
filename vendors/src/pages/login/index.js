import React from "react"
import { Button, Form, Input, Alert } from "antd"
import { withRouter } from "next/router"
import { LOGIN_VENDOR } from "../../graphql/apolloQueries/index"
import { withApollo } from "react-apollo"
import { constants, setJwt } from "./../../utils/index"

const defaultErrorState = {
    error: false,
    text: "",
    description: ""
}

class Login extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            submitLoading: false,
            error: defaultErrorState
        }
    }

    login = async (values) => {
        //if submitLoading is true then return
        if (this.state.submitLoading === true) {
            return
        }

        //set submitLoading to true
        this.setState({
            submitLoading: true,
            error: defaultErrorState
        })

        try {
            //create request
            const { data } = await this.props.client.mutate({
                mutation: LOGIN_VENDOR,
                variables: values
            })
            let loginVendor = data.loginVendor
            console.log(loginVendor)
            //check for errors
            if (loginVendor.error !== constants.errorCodes.noError) {
                //check error type
                if (loginVendor.error === constants.errorCodes.emailDoesNotExists) {
                    this.setState({
                        error: {
                            error: true,
                            text: "Error User",
                            description: "User with EmailID does not exists"
                        },
                        submitLoading: false
                    })
                    return
                }

                if (loginVendor.error === constants.errorCodes.invalidCreds) {
                    this.setState({
                        error: {
                            error: true,
                            text: "Error User",
                            description: "Invalid Credentials!"
                        },
                        submitLoading: false
                    })
                    return
                }

                //else throw error because it is unidentified
                throw new Error(`Unrecognized error response code: ${loginVendor.error}`)
            }

            //set jwt
            setJwt(loginVendor.jwt)

            //check if profile exists & route accordingly
            if (loginVendor.profileCreated === false) {
                console.log("stuck here")
                //route to create Profile page
            } else {
                //route to home page
                this.props.router.push("/")
            }
        } catch (e) {
            console.log("vendor login error: ", e)
            this.setState({
                error: {
                    error: true,
                    text: "Error. Sorry.",
                    description: "Something went wrong! Please try again later."
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
                <div className="login-form">
                    {this.state.error.error === true ? this.renderError() : undefined}

                    <Form style={{ width: "100%" }} layout="vertical" onFinish={this.login}>
                        <Form.Item
                            label="Email ID"
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
                            <Button loading={this.state.submitLoading} type="primary" htmlType="submit">
                                Login
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

export default withRouter(withApollo(Login))

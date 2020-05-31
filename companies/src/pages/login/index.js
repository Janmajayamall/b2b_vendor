import React from "react"
import { Button, Form, Input, Alert } from "antd"
import { withRouter } from "next/router"
import { LOGIN_COMPANY } from "../../graphql/apolloQueries/index"
import { withApollo } from "react-apollo"
import { constants, setJwt } from "../../utils"

const defaultErrorState = {
    error: false,
    text: "",
    description: ""
}

class Login extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            error: defaultErrorState
        }
    }

    login = async (values) => {
        //if loading is true then return
        if (this.state.loading === true) {
            return
        }

        //set loading to true
        this.setState({
            loading: true,
            error: defaultErrorState
        })

        try {
            //create request
            const { data } = await this.props.client.mutate({
                mutation: LOGIN_COMPANY,
                variables: values
            })
            let loginCompany = data.loginCompany

            //check for errors
            if (loginCompany.error !== constants.errorCodes.noError) {
                //check error type
                if (loginCompany.error === constants.errorCodes.emailDoesNotExists) {
                    this.setState({
                        error: {
                            error: true,
                            text: "Error User",
                            description: "User with EmailID does not exists"
                        },
                        loading: false
                    })
                    return
                }

                //else throw error because it is unidentified
                throw new Error(`Unrecognized error response code: ${loginCompany.error}`)
            }

            //set jwt
            setJwt(loginCompany.jwt)

            //check if profile exists & route accordingly
            if (loginCompany.profileCreated === false) {
                //route to create Profile page
                this.props.router.push("/profile/createProfile")
            } else {
                //route to home page
            }
        } catch (e) {
            console.log("company login error: ", e)
            this.setState({
                error: {
                    error: true,
                    text: "Error. Sorry.",
                    description: "Something went wrong! Please try again later."
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
                            <Button type="primary" htmlType="submit">
                                Login
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                onClick={() => {
                                    this.props.router.push("/register")
                                }}
                            >
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

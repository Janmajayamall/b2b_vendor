import React from "react"
import { Button, Form, Input, Alert } from "antd"
import { withRouter } from "next/router"
import { LOGIN_VENDOR } from "../../graphql/apolloQueries/index"
import { withApollo } from "react-apollo"

const defaultErrorState = {
    error: false,
    text: "",
    description: ""
}

class AddProducts extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            submitLoading: false,
            error: defaultErrorState
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

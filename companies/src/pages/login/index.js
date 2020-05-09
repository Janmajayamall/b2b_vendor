import React from "react"
import { Button, Form, Input, InputNumber } from "antd"
import { withRouter } from "next/router"
import { ADD_TEMP_ITEM } from "../../graphql/apolloQueries/index"
import { withApollo } from "react-apollo"

class Login extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            tempItem: this.props.router.query
        }
    }

    login = (values) => {
        console.log("login pressed")
    }

    render() {
        return (
            <div className="initial-page">
                <div className="login-form">
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
                            <Input />
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
                    }
                `}</style>
            </div>
        )
    }
}

export default withRouter(withApollo(Login))

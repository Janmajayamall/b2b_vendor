import React from "react"
import { Table, Button, Form, Input, InputNumber, Card, Alert } from "antd"
import { withRouter } from "next/router"
import { CREATE_COMPANY_PROFILE } from "../../graphql/apolloQueries/index"
import { withApollo } from "react-apollo"
import { constants } from "../../utils"

const createProfileDefaultValues = {
    //TODO: remove in prod
    name: `name:::${new Date()}`,
    country: `country:::${new Date()}`,
    state: `state:::${new Date()}`,
    city: `city:::${new Date()}`,
    address: `address:::${new Date()}`,
    description: `description:::${new Date()}`,
    locationCoordinates: {
        lat: "27.2038",
        lon: "77.5011"
    },
    contactEmailId: `contactEmailId:::${new Date()}`,
    contactNumber: `contactNumber:::${new Date()}`,
    website: `website:::${new Date()}`,
    linkedIn: `linkedIn:::${new Date()}`
}

const defaultErrorState = {
    error: false,
    text: "",
    description: ""
}

class CreateProfile extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            error: defaultErrorState
        }
    }

    createProfile = async (values) => {
        //if loading is true then return
        if (this.state.loading === true) {
            return
        }

        //set loading to true
        this.setState({
            loading: true,
            error: defaultErrorState
        })

        //TODO: validate, if validation already not done

        //generating variables
        const variables = {
            ...values,
            ...createProfileDefaultValues
        }

        console.log(variables, "req vars")

        try {
            //create profile req
            const { data } = await this.props.client.mutate({
                mutation: CREATE_COMPANY_PROFILE,
                variables: variables
            })

            const { createCompanyProfile } = data
            console.log(data, "data response")

            if (createCompanyProfile.error === constants.errorCodes.profileAlreadyCreated) {
                this.setState({
                    loading: false,
                    error: {
                        error: true,
                        text: "ERROR PROFILE EXISTS",
                        description:
                            "Profile for the account already exists, please use edit profile for changing updating profile"
                    }
                })
                setTimeout(() => {
                    this.props.router.push("/")
                }, 5000)
            } else {
                this.setState({
                    loading: false
                })
                console.log("Profile created")
            }

            //route
        } catch (e) {
            console.log(e)
            this.setState({
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
                <div className="create-profile-list">
                    <Card title="Create Company Profile" bordered={false}>
                        {this.state.error.error === true ? this.renderError() : undefined}
                        <Form
                            layout="vertical"
                            initialValues={createProfileDefaultValues}
                            onFinish={this.createProfile}
                        >
                            <Form.Item
                                label="Company Name"
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
                                label="Country"
                                name="country"
                                rules={[
                                    {
                                        required: false
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="City"
                                name="city"
                                rules={[
                                    {
                                        required: false
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="State"
                                name="state"
                                rules={[
                                    {
                                        required: false
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Address"
                                name="address"
                                rules={[
                                    {
                                        required: false
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Short Description"
                                name="description"
                                rules={[
                                    {
                                        required: false
                                    }
                                ]}
                            >
                                <Input.TextArea rows={4} />
                            </Form.Item>

                            <Form.Item
                                label="Contact Email ID"
                                name="contactEmailId"
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
                                label="Website URL"
                                name="website"
                                rules={[
                                    {
                                        required: false
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="LinkedIn Profile"
                                name="linkedIn"
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
                                    Done
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
                <style jsx>{`
                    .initial-page {
                        display: flex;
                        height: 100%;
                        width: 100%;
                        flex-direction: column;
                        align-items: center;
                    }

                    .create-profile-list {
                        width: 80%;
                    }
                `}</style>
            </div>
        )
    }
}

export default withRouter(withApollo(CreateProfile))

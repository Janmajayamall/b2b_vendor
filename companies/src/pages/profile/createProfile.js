import React from "react"
import { Table, Button, Form, Input, InputNumber, Card } from "antd"
import Router, { useRouter, withRouter } from "next/router"
import { CREATE_COMPANY_PROFILE } from "../../graphql/apolloQueries/index"
import { withApollo } from "react-apollo"

const createProfileDefaultValues = {
    name: `name:::${new Date()}`,
    country: `country:::${new Date()}`,
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

class CreateProfile extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false
        }
    }

    createProfile = async (values) => {
        //if loading is true then return
        if (this.state.loading === true) {
            return
        }

        //set loading to true
        this.setState({
            loading: true
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
                variables: variables,
                fetchPolicy: "no-cache"
            })

            console.log(data, "data response")

            //reroute to the home page
            if (data.createCompanyProfile === true) {
                console.log("ho gaya")
            }
        } catch (e) {
            console.log(e)
            this.setState({
                loading: false
            })
        }
    }

    render() {
        return (
            <div className="initial-page">
                <div className="create-profile-list">
                    <Card title="Create Company Profile" bordered={false}>
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

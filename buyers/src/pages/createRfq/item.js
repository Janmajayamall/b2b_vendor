import React from "react"
import { Table, Button, Form, Input, InputNumber } from "antd"
import { withRouter } from "next/router"
import { ADD_TEMP_ITEM } from "../../graphql/apolloQueries/index"
import { withApollo } from "react-apollo"
import { PlusOutlined, MinusOutlined } from "@ant-design/icons"

class Item extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            tempItem: this.props.router.query
        }
    }

    addItem = (values) => {
        //converting product parameters array to productParameters object
        const productParameters = {}
        if (values.productParametersNames) {
            //checking productParametersNames & productParametersValues are in equal length
            if (values.productParametersNames.length !== values.productParametersValues.length) {
                return
            }

            values.productParametersNames.forEach((element, index) => {
                productParameters[element] = values.productParametersValues[index]
            })
        }

        //deleting productParametersNames & productParametersValues & adding productParameters
        values.productParameters = JSON.stringify(productParameters)
        delete values.productParametersNames
        delete values.productParametersValues

        //getting query from router
        let item = {
            ...this.state.tempItem,
            ...values,

            //parsing numerical values to float
            quantity: parseFloat(values.quantity)
        }

        this.props.client.mutate({
            mutation: ADD_TEMP_ITEM,
            variables: item
        })

        this.props.router.push("/createRfq")
    }

    render() {
        return (
            <div className="initial-page">
                <div className="rfq-list">
                    <Form layout="vertical" initialValues={this.state.tempItem} onFinish={this.addItem}>
                        <Form.Item
                            label="RFQ ID"
                            name="buyerRfqId"
                            rules={[
                                {
                                    required: false
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="PR ID"
                            name="buyerPrId"
                            rules={[
                                {
                                    required: false
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Item ID"
                            name="buyerItemId"
                            rules={[
                                {
                                    required: false
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Product Name"
                            name="productName"
                            rules={[
                                {
                                    required: true,
                                    message: "Product Name is required"
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Product Description"
                            name="productDescription"
                            rules={[
                                {
                                    required: true,
                                    message: "Product Description is required"
                                }
                            ]}
                        >
                            <Input.TextArea rows={5} />
                        </Form.Item>

                        <Form.Item label="Product Parameters">
                            <div className="product-parameters-div">
                                <Form.List name="productParametersNames">
                                    {(fields, { add, remove }) => {
                                        return (
                                            <div className="product-parameters">
                                                {fields.map((field, index) => {
                                                    return (
                                                        <div>
                                                            <Form.Item
                                                                {...field}
                                                                rules={[
                                                                    {
                                                                        required: false
                                                                    }
                                                                ]}
                                                                noStyle
                                                            >
                                                                <Input
                                                                    placeholder="Parameter Name"
                                                                    style={{
                                                                        width: "100%"
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </div>
                                                    )
                                                })}
                                                <Form.Item>
                                                    <Button
                                                        type="dashed"
                                                        onClick={() => {
                                                            if (fields.length <= 0) {
                                                                return
                                                            }

                                                            const removeName = fields[fields.length - 1].name

                                                            remove(removeName)

                                                            //removing new parameter value
                                                            if (this.removeParamterValue) {
                                                                this.removeParamterValue(removeName)
                                                            }
                                                        }}
                                                        style={{
                                                            width: "50%"
                                                        }}
                                                    >
                                                        <MinusOutlined /> Remove Parameter
                                                    </Button>
                                                    <Button
                                                        type="dashed"
                                                        onClick={() => {
                                                            add()
                                                            // adding new parameter value
                                                            if (this.addParameterValue) {
                                                                this.addParameterValue()
                                                            }
                                                        }}
                                                        style={{
                                                            width: "50%"
                                                        }}
                                                    >
                                                        <PlusOutlined /> Add Parameter
                                                    </Button>
                                                </Form.Item>
                                            </div>
                                        )
                                    }}
                                </Form.List>

                                <Form.List name="productParametersValues">
                                    {(fields, { add, remove }) => {
                                        this.addParameterValue = add
                                        this.removeParamterValue = remove
                                        return (
                                            <div className="product-parameters">
                                                {fields.map((field, index) => {
                                                    return (
                                                        <div>
                                                            <Form.Item
                                                                {...field}
                                                                rules={[
                                                                    {
                                                                        required: false
                                                                    }
                                                                ]}
                                                                noStyle
                                                            >
                                                                <Input
                                                                    placeholder="Parameter Value"
                                                                    style={{
                                                                        width: "100%"
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )
                                    }}
                                </Form.List>
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="Quantity"
                            name="quantity"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter the quantity of Item"
                                }
                            ]}
                        >
                            <InputNumber />
                        </Form.Item>

                        <Form.Item
                            label="Unit"
                            name="unit"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter the unit of the quantity"
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Terms and Conditions"
                            name="termsAndConditions"
                            rules={[
                                {
                                    required: false
                                }
                            ]}
                        >
                            <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
                        </Form.Item>

                        <Form.Item
                            label="Delivery days"
                            name="deliveryDays"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter when do you expect the item to be delivered"
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
                </div>
                <style jsx>{`
                    .initial-page {
                        display: flex;
                        height: 100%;
                        width: 100%;
                        flex-direction: column;
                    }

                    .rfq-list {
                        width: 100%;
                    }

                    .product-parameters {
                        width: 50%;
                    }

                    .product-parameters-div {
                        display: flex;
                        flex-direction: row;
                    }
                `}</style>
            </div>
        )
    }
}

export default withRouter(withApollo(Item))

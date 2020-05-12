import React from "react"
import { Button, Form, Input, Select, Card, Divider, Alert } from "antd"
import { withRouter } from "next/router"
import { ADD_CATEGORY_PRODUCTS } from "../../graphql/apolloQueries/index"
import { withApollo } from "react-apollo"
import { PlusOutlined, MinusOutlined } from "@ant-design/icons"

const defaultCategoryObject = {
    productsCategory: "",
    products: []
}

const defaultErrorState = {
    error: false,
    text: "",
    description: ""
}

class AddProducts extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            tempValues: [defaultCategoryObject],
            submitLoading: false,
            error: defaultErrorState
        }
    }

    handleCategoryChange = (value, categoryIndex) => {
        const tempArr = []

        this.state.tempValues.forEach((element, index) => {
            if (index === categoryIndex) {
                tempArr.push({
                    ...element,
                    productsCategory: value
                })
            } else {
                tempArr.push(element)
            }
        })

        this.setState({
            tempValues: tempArr
        })
    }

    handleAddProduct = (products, categoryIndex) => {
        const tempArr = []

        //verifying products
        const productVeri = []
        products.forEach((element) => {
            if (element.trim() != "") {
                productVeri.push(element.trim())
            }
        })

        //iterating & adding products to matching index category
        this.state.tempValues.forEach((element, index) => {
            if (index === categoryIndex) {
                tempArr.push({
                    ...element,
                    products: productVeri
                })
            } else {
                tempArr.push(element)
            }
        })

        //set it to state
        this.setState({
            tempValues: tempArr
        })
    }

    addNewCategory = () => {
        this.setState((prevState) => {
            const tempArr = [...prevState.tempValues, defaultCategoryObject]
            return {
                tempValues: tempArr
            }
        })
    }

    removeCategory = (categoryIndex) => {
        const tempArr = []

        this.state.tempValues.forEach((element, index) => {
            if (index != categoryIndex) {
                tempArr.push(element)
            }
        })

        this.setState({
            tempValues: tempArr
        })
    }

    verifyTempList = () => {
        const currList = this.state.tempValues
        for (let i = 0; i < currList.length; i++) {
            if (currList[i].productsCategory.trim() === "" || !currList[i].productsCategory) {
                return {
                    valid: false
                }
            }
        }

        return {
            valid: true
        }
    }

    submitProductCategories = async () => {
        //if submitLoading true return
        if (this.state.submitLoading === true) {
            return
        }

        //set submitLoading to true
        this.setState({
            submitLoading: true,
            error: defaultErrorState
        })

        //verify Product Categories
        let validRes = this.verifyTempList()

        if (validRes.valid == false) {
            this.setState({
                error: {
                    error: true,
                    text: "Error Category",
                    description: "Please enter values for each product category"
                },
                submitLoading: false
            })
            return
        }

        try {
            //add Product Categories
            const result = await this.props.client.mutate({
                mutation: ADD_CATEGORY_PRODUCTS,
                variables: {
                    addCategoryProductsInput: this.state.tempValues
                }
            })

            this.setState({
                error: defaultErrorState,
                submitLoading: false
            })
        } catch (e) {
            console.log(e, "submitProductCategories, vendor: addProducts.js")
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

    renderInputs = () => {
        return (
            <div>
                {this.state.tempValues.map((object, index) => {
                    return (
                        <div key={index}>
                            <div className="category-input">
                                <Input
                                    onChange={(e) => {
                                        this.handleCategoryChange(e.target.value, index)
                                    }}
                                    defaultValue={object.productsCategory}
                                    placeholder="Category"
                                    style={{ width: "20%", marginRight: 5 }}
                                />
                                <Select
                                    mode="tags"
                                    placeholder={"Add Category Products"}
                                    style={{ width: "70%", marginRight: 5 }}
                                    onChange={(products) => {
                                        this.handleAddProduct(products, index)
                                    }}
                                    tokenSeparators={[","]}
                                    defaultValue={object.products}
                                >
                                    {[]}
                                </Select>
                                <Button
                                    icon={<MinusOutlined />}
                                    type="primary"
                                    onClick={() => {
                                        this.removeCategory(index)
                                    }}
                                />
                            </div>
                            <Divider
                                style={{
                                    backgroundColor: "#000000"
                                }}
                            />
                        </div>
                    )
                })}
            </div>
        )
    }

    renderError = () => {
        return (
            <Alert
                style={{ marginTop: 5 }}
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
                <div className="add-products">
                    <Card title="Add Product Categories" bordered={false}>
                        {this.renderInputs()}
                        <Button
                            type="primary"
                            onClick={() => {
                                this.addNewCategory()
                            }}
                        >
                            <PlusOutlined /> Add Category
                        </Button>

                        <Button
                            type="primary"
                            onClick={() => {
                                this.submitProductCategories()
                            }}
                            loading={this.state.submitLoading}
                        >
                            Submit Product Categories
                        </Button>
                        {this.state.error.error === true ? this.renderError() : undefined}
                    </Card>
                </div>
                <style jsx>{`
                    .initial-page {
                        display: flex;
                        height: 100%;
                        width: 100%;
                        flex-direction: column;
                    }

                    .add-products {
                        width: 100%;
                    }

                    .category-input {
                        width: 100%;
                        flex-direction: row;
                        display: flex;
                        justify-content: space-evenly;
                    }
                `}</style>
            </div>
        )
    }
}

export default withRouter(withApollo(AddProducts))

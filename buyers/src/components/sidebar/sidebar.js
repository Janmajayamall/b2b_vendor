import React from "react"
import { Button, Menu } from "antd"
import { withRouter } from "next/router"

const defaultKeyRouteMap = {
    "/createRfq": ["1"],
    "/orders/activeOrders": ["2"],
    "/orders/allOrders": ["3"]
}

class SideBar extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            collapsed: false
        }
    }

    getDefaultKey = () => {
        const pathname = this.props.pathname

        if (defaultKeyRouteMap[pathname] != undefined) {
            return defaultKeyRouteMap[pathname]
        }

        return []
    }

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed
        })
    }

    render() {
        return (
            <div className="sidebar">
                <Menu
                    defaultSelectedKeys={this.getDefaultKey()}
                    defaultOpenKeys={["sub1"]}
                    mode="inline"
                    style={{
                        height: "100%"
                    }}
                    inlineCollapsed={false}
                >
                    <Menu.Item
                        onClick={() => {
                            this.props.router.push("/createRfq")
                        }}
                        key="1"
                    >
                        Submit RFQ
                    </Menu.Item>
                    <Menu.ItemGroup key="group1" title="Your Orders">
                        <Menu.Item
                            onClick={() => {
                                this.props.router.push("/orders/activeOrders")
                            }}
                            key="2"
                        >
                            Active Orders
                        </Menu.Item>
                        <Menu.Item
                            onClick={() => {
                                this.props.router.push("/orders/allOrders")
                            }}
                            key="3"
                        >
                            All Orders
                        </Menu.Item>
                    </Menu.ItemGroup>
                </Menu>
                <style jsx>{`
                    .sidebar {
                        width: 100%;
                        height: 100%;
                    }
                `}</style>
            </div>
        )
    }
}

export default withRouter(SideBar)

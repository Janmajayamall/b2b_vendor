import React from "react"
import { Button, Menu } from "antd"
import { withRouter } from "next/router"

const defaultKeyRouteMap = {
    "/exploreItemOrders": ["1"],
    "/exploreItemOrders/quotedQuotations": ["2"]
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
        console.log(pathname)
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
                    <Menu.ItemGroup key="group1" title="Quotations">
                        <Menu.Item
                            onClick={() => {
                                this.props.router.push("/exploreItemOrders")
                            }}
                            key="1"
                        >
                            Incoming Quotations
                        </Menu.Item>
                        <Menu.Item
                            onClick={() => {
                                this.props.router.push("/exploreItemOrders/quotedQuotations")
                            }}
                            key="2"
                        >
                            Quoted Quotations
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

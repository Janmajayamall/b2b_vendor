import React from "react"
import { Button, Menu } from "antd"
import { withRouter } from "next/router"

class SideBar extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            collapsed: false
        }
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
                    defaultSelectedKeys={["1"]}
                    defaultOpenKeys={["sub1"]}
                    mode="inline"
                    style={{
                        height: "100%"
                    }}
                    inlineCollapsed={false}
                >
                    <Menu.Item
                        onClick={() => {
                            this.props.router.push("/profile")
                        }}
                        key="1"
                    >
                        View Profile
                    </Menu.Item>
                    <Menu.Item
                        onClick={() => {
                            this.props.router.push("/buyers")
                        }}
                        key="2"
                    >
                        View Buyers
                    </Menu.Item>
                    <Menu.Item
                        onClick={() => {
                            this.props.router.push("/vendors")
                        }}
                        key="2"
                    >
                        View Sellers
                    </Menu.Item>
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
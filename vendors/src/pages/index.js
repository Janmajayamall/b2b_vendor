import React from "react"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import Router from "next/router"

class Initial extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.checkUserAuthentication()
    }

    checkUserAuthentication = () => {
        Router.push("/login")
    }

    render() {
        return (
            <div className="initial-page">
                <Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} tip="Loading" />
                <style jsx>{`
                    .initial-page {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100%;
                        width: 100%;
                    }
                `}</style>
            </div>
        )
    }
}

export default Initial

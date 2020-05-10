import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"

function LoadingSpinner(props) {
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

export default LoadingSpinner

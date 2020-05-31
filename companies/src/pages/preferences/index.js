import React from "react"
import { withRouter } from "next/router"
import { CREATE_COMPANY_PROFILE } from "../../graphql/apolloQueries/index"
import { withApollo } from "react-apollo"
import LoadingSpinner from "./../../components/loadingSpinner/index"
import { Card, Divider } from "antd"
import Link from "next/link"

class Preferences extends React.PureComponent {
    constructor(props) {
        super(props)

        this.state = {}
    }

    render() {
        return (
            <div className="initial-page">
                <Card
                    title="Admin Preferences"
                    style={{
                        height: "100%",
                        width: "100%"
                    }}
                    // extra={
                    //     <Link href="/buyerAccounts/addBuyerAccount">
                    //         <a>Add new buyer</a>
                    //     </Link>
                    // }
                >
                    <Card
                        title="Company Information"
                        style={{
                            height: "100%",
                            width: "100%"
                        }}
                        type="inner"
                    ></Card>
                    <Card
                        title="Other Preferences"
                        style={{
                            height: "100%",
                            width: "100%"
                        }}
                        type="inner"
                    >
                        <div>
                            <Link
                                href={{
                                    pathname: "/preferences/preferredVendors"
                                }}
                            >
                                <a target="_blank">Trusted Vendors</a>
                            </Link>
                        </div>
                    </Card>
                </Card>
                <style jsx>{`
                    .initial-page {
                        display: flex;
                        height: 100%;
                        width: 100%;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }
                `}</style>
            </div>
        )
    }
}

export default withRouter(withApollo(Preferences))

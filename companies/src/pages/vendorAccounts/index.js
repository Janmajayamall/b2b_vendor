import React from "react"
import { withRouter } from "next/router"
import { CREATE_COMPANY_PROFILE } from "../../graphql/apolloQueries/index"
import { withApollo } from "react-apollo"
import LoadingSpinner from "../../components/loadingSpinner/index"
import { Card } from "antd"
import Link from "next/link"

class VendorAccounts extends React.PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            loading: false
        }
    }

    render() {
        if (this.state.loading === true) {
            return <LoadingSpinner />
        }

        return (
            <div className="initial-page">
                <Card
                    title="Seller Accounts"
                    style={{
                        height: "100%",
                        width: "100%"
                    }}
                    extra={
                        <Link href="/vendorAccounts/addVendorAccount">
                            <a>Add new Seller</a>
                        </Link>
                    }
                ></Card>
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

export default withRouter(withApollo(VendorAccounts))

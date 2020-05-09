import apolloClient from "./../graphql/apolloClient"
import { ApolloProvider, withApollo } from "react-apollo"
import Head from "next/head"
import { useRouter } from "next/router"

// antd design imports
import "antd/dist/antd.css"

//importing custom components
import SideBar from "./../components/sidebar/sidebar"

function App({ Component, pageProps }) {
    const router = useRouter()
    return (
        <ApolloProvider client={apolloClient}>
            <Head>
                <title>Hello</title>
            </Head>

            <body>
                {router.pathname === "/" ? (
                    <div className="main-page">
                        <Component {...pageProps} />
                    </div>
                ) : (
                    <div className="main-page">
                        <div className="sidebar">
                            <SideBar />
                        </div>
                        <div className="rest-page">
                            <Component {...pageProps} />
                        </div>
                    </div>
                )}
            </body>

            <style jsx>
                {`
                    .sidebar {
                        width: 10%;
                        height: 100%;
                    }

                    .rest-page {
                        width: 90%;
                        height: 100%;
                    }

                    .main-page {
                        flex-direction: row;
                        width: 100%;
                        height: 100%;
                        display: flex;
                    }
                `}
            </style>
            <style global jsx>{`
                html,
                body {
                    padding: 0;
                    margin: 0;
                    width: 100%;
                    height: 100%;
                }

                * {
                    box-sizing: border-box;
                }

                #__next {
                    width: 100%;
                    height: 100%;
                }
            `}</style>
        </ApolloProvider>
    )
}

export default App

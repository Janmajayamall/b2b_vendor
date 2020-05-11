import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { HttpLink } from "apollo-link-http"
import { onError } from "apollo-link-error"
import { ApolloLink, Observable } from "apollo-link"
import { RetryLink } from "apollo-link-retry"
import fetch from "node-fetch"
import { GET_TEMP_RFQ } from "./apolloQueries/index"
import resolvers from "./resolvers"
import { getJwt } from "./../utils"
import { setContext } from "apollo-link-context"
global.fetch = fetch

// cached storage for the user token
let token = null

const withToken = setContext(async () => {
    // if you have a cached value, return it immediately
    if (!token) {
        token = getJwt()
    }

    return {
        headers: {
            authorization: token
        }
    }
})

//for resetting token to null after logout
// export const reset_token = () => {
//   token = null
// }

export const cache = new InMemoryCache()
//initializing the cache
cache.writeData({
    data: {
        tempRfq: [],
        tempRfqTags: []
    }
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path, extensions }) => {
            if (true) {
                console.log(
                    `[GraphQL error]: Message ${message}, Location: ${locations}, Path: ${path}, Extensions: code:${extensions.code}`
                )
            }
            if (extensions.code === "UNAUTHENTICATED" && path[0] !== "login_user") {
                if (!true) {
                    bugsnag.notify(new Error(JSON.stringify(extensions)))
                }
                logout_unauthenticated_err()
            }
        })
    }
    if (networkError) {
        if (true) {
            console.log(`[Network error]: ${networkError}`)
        }
    }
})

const retryLink = new RetryLink({
    delay: {
        initial: 200,
        max: 2000,
        jitter: true
    },
    attempts: {
        max: 10,
        retryIf: (error, _operation) => !!error
    }
})

const loggerLink = new ApolloLink((operation, forward) => {
    operation.setContext({ start: new Date() })
    return forward(operation).map((response) => {
        const responseTime = new Date() - operation.getContext().start
        console.log(`GraphQL Response took: ${responseTime}`)
        return response
    })
})

const client = new ApolloClient({
    link: ApolloLink.from([
        loggerLink,
        withToken,
        // retryLink,
        errorLink,
        new HttpLink({
            uri: "http://localhost:5000/graphql",
            credentials: "same-origin"
        })
    ]),
    cache: cache,
    resolvers: resolvers
})

export default client

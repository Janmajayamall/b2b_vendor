const resolvers = {
    Mutation: {
        addTempItem: (obj, args, { cache }) => {
            //reading tempRfq
            const { tempRfq } = cache.readQuery({
                query: GET_TEMP_RFQ
            })

            //creating newTemoRfq item list
            const rfqExists = false
            const newTempRfq = []
            tempRfq.forEach((element) => {
                if (element.id === args.id) {
                    //if item already exists -> edit it is; hence no push at the end
                    rfqExists = true
                    newTempRfq.push({
                        ...args.itemInput,
                        __typename: "TempItem"
                    })
                } else {
                    newTempRfq.push(element)
                }
            })
            //if it is a new item
            if (!rfqExists) {
                newTempRfq.push({
                    ...args.itemInput,
                    __typename: "TempItem"
                })
            }

            //write newTempRfq to cache
            cache.writeData({
                data: {
                    tempRfq: newTempRfq
                }
            })
        }
    }
}

export default resolvers

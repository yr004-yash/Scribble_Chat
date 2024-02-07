const typeDefs = `#graphql
    type Users {
        roomid:String,
        username:[String]
    }
    type rdata {
        token:String
    }
    input TotalUserInput {
        roomid:String
    }
    input AddUserInput {
        roomid:String,
        username:String
    }
    type Query {
        TotalUsers(input:TotalUserInput):Users
    },
    type Mutation {
        AddUser(input:AddUserInput):rdata
    }
`
export default typeDefs;
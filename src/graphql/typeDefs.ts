import { gql } from 'apollo-server-express'

const typeDefs = gql`
    type Language {
        languageName: String
        languageSize: Int
        languagePercentage: String
    }

    type Stats{
        languages: [Language]
    }

    type Query{
        stats(username: String!): Stats!
    }
`

export default typeDefs
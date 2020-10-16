import { GraphQLError } from 'graphql'
import { request } from '../utils/request'

const resolvers = {
    Query: {
        stats: async (_parent: any, _args: any, _context: any) => {
            const username = _args.username

            const query =`
            {
                user(login: "${username}"){
                    repositories(isFork: false, first: 100){
                        nodes{
                            name,
                            languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                                edges {
                                    size
                                    node {
                                        color
                                        name
                                    }
                                }
                            }
                        }
                    }
                }
            }
            `

            const response = await request(query)

            if(response){
                const results = response.data.data.user.repositories.nodes
                const langs: object[] = [];

                results.map((repo: any): any  => {
                    const usedLanguages = repo.languages.edges;

                    usedLanguages.map((usedLang: any): any => {
                        const langObject = {
                            languageName: usedLang.node.name,
                            languageSize: usedLang.size
                        }

                        langs.push(langObject)
                    })
                })

                const holder: any = {};

                interface HolderInterface {
                    languageName: any,
                    languageSize: number
                }

                langs.forEach((x: HolderInterface) => {
                    if(holder.hasOwnProperty(x.languageName)){
                        holder[x.languageName] = holder[x.languageName] + x.languageSize;
                    }else{
                        holder[x.languageName] = x.languageSize;
                    }
                })

                const calculatedLang: object[] = [];

                for (const prop in holder) {
                    if (holder.hasOwnProperty(prop)) {
                        calculatedLang.push({ languageName: prop, languageSize: holder[prop] });
                    }

                }

                return {
                    languages: calculatedLang
                }

            }else{
                return new GraphQLError("Cannot fetch statistics")
            }
        }
    }
};

export default resolvers;
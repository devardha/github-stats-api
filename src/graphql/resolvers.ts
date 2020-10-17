import { GraphQLError } from 'graphql'
import { request } from '../utils/request'
import { topLanguagesQuery } from './queries'

const resolvers = {
    Query: {
        stats: async (_parent: any, _args: any, _context: any) => {
            const username = _args.username

            const response = await request(topLanguagesQuery(username))

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

                interface LanguageInterface {
                    languageName: any,
                    languageSize: number
                }

                langs.forEach((x: LanguageInterface) => {
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

                function compare( a: any, b: any ) {
                    if ( a.languageSize < b.languageSize ){
                      return 1;
                    }
                    if ( a.languageSize > b.languageSize ){
                      return -1;
                    }
                    return 0;
                }

                const sortedAndFiltered = calculatedLang.sort(compare)

                // calculating total languages size
                const totalSum = sortedAndFiltered
                .map((lang: LanguageInterface) => lang.languageSize )
                .reduce((previousItem, currentItem) => previousItem + currentItem, 0)

                const arrayWithPercentage: object[] = []
                sortedAndFiltered.map((lang: LanguageInterface) => {
                    const newLangObject = {
                        languageName: lang.languageName,
                        languageSize: lang.languageSize,
                        languagePercentage: ((lang.languageSize / totalSum) * 100).toFixed(2),
                    }
                    arrayWithPercentage.push(newLangObject)
                })

                const finalArray = arrayWithPercentage.filter((x: any) => parseFloat(x.languagePercentage) > 0 )

                return {
                    languages: finalArray
                }

            }else{
                return new GraphQLError("Cannot fetch statistics")
            }
        }
    }
};

export default resolvers;
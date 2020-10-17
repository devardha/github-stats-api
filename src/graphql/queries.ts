export const topLanguagesQuery= (username: string) => {
    return`
    {
        user(login: "${username}"){
            repositories(ownerAffiliations: OWNER, isFork: false, first: 100){
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
}
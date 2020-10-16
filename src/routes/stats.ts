import { Router } from 'express'
import axios from 'axios'

const router = Router();

router.get('/:username', (req, res) => {
    res.send(req.params.username)
})

router.get('/:username/languages', (req, res) => {
    const username = req.params.username

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

    axios({
        url: 'https://api.github.com/graphql',
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'bearer 1018173dca8fe6bbbb3b7ee7358ca097b492fca1'
        },
        data: JSON.stringify({ query })
    }).then(response => {
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

        const calculatedLang = [];

        for (const prop in holder) {
            if (holder.hasOwnProperty(prop)) {
                calculatedLang.push({ languageName: prop, languageSize: holder[prop] });
            }

        }

        res.type('json').status(200).send(JSON.stringify(calculatedLang, null, 2) + '\n');
    }).catch(err => {
        res.type('json').status(200).send(JSON.stringify({msg: "Something went wrong", errors: err}, null, 2) + '\n');
    })

})

export default router;
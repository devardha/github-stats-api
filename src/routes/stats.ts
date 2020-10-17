import { Router } from 'express'
import { request } from '../utils/request'
import { topLanguagesQuery } from '../graphql/queries'
import { createSVG } from '../utils/card'

const router = Router();

router.get('/:username/languages/chart', (req, res) => {
    const username = req.params.username

    request(topLanguagesQuery(username)).then(response => {
        const results = response.data.data.user.repositories.nodes
        const langs: object[] = [];

        results.map((repo: any): any  => {
            const usedLanguages = repo.languages.edges;

            usedLanguages.map((usedLang: any): any => {
                const langObject = {
                    languageName: usedLang.node.name,
                    languageSize: usedLang.size,
                    languageColor: usedLang.node.color
                }

                langs.push(langObject)
            })
        })

        const holder: any = {};

        interface LanguageInterface {
            languageName: string,
            languageSize: number,
            languageColor: string,
        }

        // language color wrapper
        const langColor: any = {}

        langs.forEach((x: LanguageInterface) => {
            if(holder.hasOwnProperty(x.languageName)){
                holder[x.languageName] = holder[x.languageName] + x.languageSize;
                langColor[x.languageName] = x.languageColor
            }else{
                holder[x.languageName] = x.languageSize;
                langColor[x.languageName] = x.languageColor
            }
        })

        const calculatedLang: object[] = [];

        for (const prop in holder) {
            if (holder.hasOwnProperty(prop)) {
                calculatedLang.push({ languageName: prop, languageSize: holder[prop] });
            }

        }

        // tslint:disable-next-line:no-console
        console.log(holder)

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
                languageColor: lang.languageColor,
                languagePercentage: (lang.languageSize / totalSum * 100).toFixed(2),
            }
            arrayWithPercentage.push(newLangObject)
        })

        const finalArray = arrayWithPercentage.filter((x: any) => parseFloat(x.languagePercentage) > 0 )

        const svg = createSVG(finalArray, langColor)

        res.setHeader('content-type', 'image/svg+xml')
        res.status(200).send(svg)
    }).catch(err => {
        res.type('json').status(200).send(JSON.stringify({msg: "Something went wrong", errors: err}, null, 2) + '\n');
    })
})

router.get('/:username/languages', (req, res) => {
    const username = req.params.username

    request(topLanguagesQuery(username)).then(response => {
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
            languageName: string,
            languageSize: number,
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
                languagePercentage: (lang.languageSize / totalSum * 100).toFixed(2),
            }
            arrayWithPercentage.push(newLangObject)
        })

        const finalArray = arrayWithPercentage.filter((x: any) => parseFloat(x.languagePercentage) > 0 )

        res.type('json').status(200).send(JSON.stringify(finalArray, null, 2) + '\n');
    }).catch(err => {
        res.type('json').status(200).send(JSON.stringify({msg: "Something went wrong", errors: err}, null, 2) + '\n');
    })
})

export default router;
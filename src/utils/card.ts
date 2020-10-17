export const createSVG = (languages: object[], colors: any) => {
    const langs: any = languages.slice(0, 5)

    const svg =`<svg
    width="300"
    height="285"
    viewBox="0 0 300 285"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    >
    <style>
      .header {
        font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif;
        fill: #2f80ed;
        animation: fadeInAnimation 0.8s ease-in-out forwards;
      }

    .lang-name { font: 400 11px 'Segoe UI', Ubuntu, Sans-Serif; fill: #333 }
    </style>

    <rect
      data-testid="card-bg"
      x="0.5"
      y="0.5"
      rx="4.5"
      height="99%"
      stroke="#E4E2E2"
      width="299"
      fill="#fffefe"
      stroke-opacity="1"
    />

    <g data-testid="card-title" transform="translate(25, 35)">
        <g transform="translate(0, 0)">
            <text
            x="0"
            y="0"
            class="header"
            data-testid="header"
            >
                Most Used Languages
            </text>
        </g>
    </g>


    <g data-testid="main-card-body" transform="translate(0, 55)">
    <svg data-testid="lang-items" x="25">

    ${
        langs.map((lang: any, index: number) => {
            const translateY = [0, 40, 80, 120, 160]
            return(`
                <g transform="translate(0, ${translateY[index]})">
                    <text data-testid="lang-name" x="2" y="15" class="lang-name">${lang.languageName}</text>
                    <text x="215" y="34" class="lang-name">${lang.languagePercentage}%</text>

                    <svg width="205" x="0" y="25">
                        <rect rx="5" ry="5" x="0" y="0" width="205" height="8" fill="#ddd"></rect>
                        <rect
                        height="8"
                        fill="${colors[lang.languageName]}"
                        rx="5" ry="5" x="0" y="0"
                        data-testid="lang-progress"
                        width="${Math.round(lang.languagePercentage)}%"
                        >
                        </rect>
                    </svg>
                </g>
            `)
        })
    }

    </svg>

    </g>
    </svg>`

    return svg
}
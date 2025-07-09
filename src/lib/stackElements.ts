
export interface stackElement {
    slug: string;
    title: string;
    color: string;
}


const stackElements: stackElement[] = [
    {
        slug: "Agile Lab Experience",
        title: "Agile Lab Experience",
        color: "red"
    },
    {
        slug: "Lutech Experience",
        title: "Lutech Experience",
        color: "red"
    },
    {
        slug: "erasmus",
        title: "Erasmus all'IST di Lisbona",
        color: "yellow"
    },
    {
        slug: "master",
        title: "Laurea Magistrale in Informatica e I.A.",
        color: "black"
    },

    {
        slug: "IET Experience",
        title: "IET Experience",
        color: "red"
    },
    {
        slug: "bachelor",
        title: "Laurea Triennale in Informatica",
        color: "yellow"
    },
    {
        slug: "skills",
        title: "Skills",
        color: "white"
    },
    {
        slug: "private",
        title: "Privato",
        color: "black"
    },
];

export default stackElements;
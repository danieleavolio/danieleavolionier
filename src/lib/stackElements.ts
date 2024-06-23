
export interface stackElement {
    slug: string;
    title: string;
    color: string;
}

const stackElements: stackElement[] = [
    {
        slug: "erasmus",
        title: "Erasmus at Instituto Superior Técnico",
        color: "yellow"
    },

    {
        slug: "frontend",
        title: "Frontend Developer",
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
]

export default stackElements;
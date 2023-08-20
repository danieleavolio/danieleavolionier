
export interface stackElement {
    slug: string;
    title: string;
    color: string;
}

const stackElements: stackElement[] = [
    {
        slug: "bachelor",
        title: "Bachelor's Degree in Computer Science",
        color: "yellow"
    },
    {
        slug: "frontend",
        title: "Frontend Developer",
        color:"red"
    },
    {
        slug: "skills",
        title: "Skills",
        color: "white"
    },
    {
        slug: "private",
        title: "Private",
        color: "black"
    },
]

export default stackElements;
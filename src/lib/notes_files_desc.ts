export interface Note{
    title: string;
    description: string;
    downloadLink: string;
}

export const notes: Note[] = [
    {
        title: 'Theoretical Computer Science',
        description: 'Domande e risposte delle slides anno 2022/2023',
        downloadLink: 'files/tcs_questions.pdf'
    },
    {
        title: 'Deep Learning',
        description: 'Appunti del corso di Deep Learning anno 2022/2023',
        downloadLink: 'files/DeepLearning.pdf'
    },
    {
        title: 'Algorithmic Game Theory',
        description: 'Appunti di teoria e laboratorio di AGT anno 2022/2023 con incompletezza in alcuni argomenti esageratamente complessi',
        downloadLink: 'files/AlgorithmicGameTheory.pdf'
    },
    {
        title: 'Big Data and Reasoning - Domande e Risposte teoria',
        description: 'Domande e risposte che ho creato autonomamente per preparare l\'esame di Big Data and Reasoning, assolutamente non esaustive',
        downloadLink: 'files/bigdata_questions.pdf'
    },
    {
        title: 'Big Data and Reasoning - Domande e Risposte laboratorio',
        description: 'Domande e risposte sulla parte riguardante il laboratorio di Big Data, anche queste non esaustive e molto teoriche',
        downloadLink: 'files/bigdata_lab.pdf'
    }
]

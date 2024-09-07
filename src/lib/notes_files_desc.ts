export interface Note {
    title: string;
    description: string;
    downloadLink: string;
}

export const notes: Note[] = [
    {
        title: "Statistical Methods for Data Science",
        description: "Appunti scritti per il corso di SMFDS della Prof.ssa Sabrina Giordano. Potrebbero esserci degli errori e alcuni argomenti potrebbero essere non esaustivi!",
        downloadLink: "https://www.notion.so/danieleavolio/Links-PDF-Statistica-a06aafe5ff444dd3934cd8fb1c325168?pvs=4"
    },

    {
        title: "Optimization for Machine Learning",
        description: "Appunto scritti per il corso di Optimization for Machine Learning del Prof. Antonio Fuduli dell'anno 2023/2024. Alcuni passaggi potrebbero contenere dei piccoli errori, quindi attenzione con il ragionamento.",
        downloadLink: "https://drive.google.com/file/d/1DVSHWchtMysazzqjV-r_60r1a5QIpWvY/view?usp=sharing"
    },
    {
        title: 'Reti e Sicurezza Informatica',
        description: 'Appunti del corso di Reti di Calcolatori dell\'anno 2020/2021. Nota che potrebbero esserci errori e/o incompletezze poiché vecchi di qualche anno.',
        downloadLink: 'files/RETI-RIASSUNTO.pdf'
    },

    {
        title: 'Process Mining',
        description: 'Appunti del corso di Process Mining anno 2022/2023 della Prof.ssa Fionda',
        downloadLink: 'https://danieleavolio.notion.site/b5d4ff6c051145ccb93f2c26ec8c91d8?v=d300f029d15b4e40b6f6dd073e528ad3&pvs=4'
    },

    {
        title: 'Machine Learning',
        description: 'Appunti del corso di Machine Learning anno 2022/2023 del Prof. Rullo',
        downloadLink: 'https://danieleavolio.notion.site/64c8929bf3b24680be86ef03c21fa002?v=58b4348d527c45c1bd67621a2d149f83&pvs=4'
    },
    {
        title: 'Data Warehouse and Visualization',
        description: 'Appunti del corso di Data Warehouse and Visualization anno 2022/2023 del Prof. Terracina',
        downloadLink: 'https://danieleavolio.notion.site/6d70a5abdbdf40bc87b9750860ff1143?v=670c12862a95499f95b8f768a8b32c83&pvs=4'
    },

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

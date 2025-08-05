export default { 
    id: 'bugReportFlow',
    name: 'Bug Report Flow',
    description: 'Detailed process for handling errors and exceptions in the workflow',
    notes: [
        {
            title: 'Note 1',
            type: 'warn',
            list: [
                'This is a note 1',
                'This is a note 2',
                'This is a note 3',
            ]
        },
        {
            title: 'Note 1',
            type: 'solve',
            list: [
                'This is a note 1',
                'This is a note 2',
                'This is a note 3',
            ]
        }
    ],
    icon: 'fa-solid fa-bug',
    flow: `
        <div class="mermaid">
            graph TD
                A[Bug Reported] --> B[Support Rep Creates Ticket]
                B --> C{Ticket Submitted for Review}
                C -->|L3 Approves Ticket| D[L3 Submits Ticket]
                C -->|L3 Rejects Ticket| E[Ticket is sent back to support rep]
                E --> F[Support Rep Updates Ticket]
                F --> C
                D --> G[Ticket is submitted to Dev/Prod]
                G --> H{Ticket is Reviewed}
                H -->|Ticket is approved| I[Ticket is sent to Dev/Prod]
                H -->|Ticket is rejected| J[Ticket is sent back to support with explanation]
                I -->|Dev works on issue| K[Ticket is closed]
                
                style A fill:#e1f5fe
                style E fill:#ffcdd2
                style G fill:#c8e6c9
                style J fill:#e1f5fe
                style K fill:#e1f5fe
        </div>
    `
}
import mermaidColors from './mermaid-colors.js';
export default {
    id: 'bugReportFlow',
    name: 'Bug Report Flow',
    description: 'Detailed process for handling errors and exceptions in the workflow',
    icon: 'fa-solid fa-bug',
    notes: [
        {
            title: 'Things to keep in mind',
            type: 'warn',
            list: [
                'Screenshots should pinpoint the exact location of the issue (don\'t screenshot the entire walkthrough)',
                'Videos should include the entire walkthrough where possible',
                'Always try to reproduce the issue on a test site first'
            ]
        }
    ],
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

                style A fill:${mermaidColors.lightBlue}
                style E fill:${mermaidColors.lightRed}
                style G fill:${mermaidColors.lightGreen}
                style J fill:${mermaidColors.lightBlue}
                style K fill:${mermaidColors.lightBlue}
        </div>
    `
}
import mermaidColors from './mermaid-colors.js';
export default {
        id: 'qbTroubleShoot',
        name: 'QB Trouble Shoot',
        description: 'Trouble shoot issues with Quickbooks',
        icon: 'fa-solid fa-bug',
        notes: [
                {
                        title: 'Things to keep in mind',
                        type: 'warn',
                        list: [
                                'We are not accounting experts. We work with making sure the data is correct and sending to the correct place, the customer needs to work with their accountant for making decisions about reporting.',
                                'Customers will often have questions about a report not matching (sometimes this indicates information is incorrect). It\'s best to confirm the information being sent for the report is correct and have the customer work with Quickbooks support if they have questions about the report itself.',
                                'When reporting bugs about quickbooks, it\'s best to have a picture of the bad data we are sending if we can find it. (incorrect transactions, incorrect account balances, etc.)'
                        ]
                }
        ],
        flow: `
        <div class="mermaid">
            graph TD
                A{Where is the issue?} --> B[Transaction incorrect]
                A --> C[Account update incorrect]
                B --> D(Confirm transaction data between QB and Rain)
                C --> E(COGS/Inventory Assets incorrect)
                E --> |COGS| F[Compare change value in QB with Sales Value in Rain]
                E --> |Inventory Assets| G[Compare change value/created Bill in QB with RO Data in Rain]

                style A fill:${mermaidColors.lightBlue}
                style D fill:${mermaidColors.lightGreen}
                style F fill:${mermaidColors.lightGreen}
                style G fill:${mermaidColors.lightGreen}
        </div>`
}
export default {
        id: 'qbTroubleShoot',
        name: 'QB Trouble Shoot',
        description: 'Trouble shoot issues with Quickbooks',
        icon: 'fa-solid fa-bug',
        flow: `
        <div class="mermaid">
            graph TD
                A{Where is the issue?} --> B[Transaction incorrect]
                A --> C[Account update incorrect]
                C --> D(COGS incorrect)
                C --> E(Inventory Assets incorrect)
        </div>`
}
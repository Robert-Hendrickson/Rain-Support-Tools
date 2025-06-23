export default async function setDNSHelpData() {
    // Helper function to simulate user input
    const simulateUserInput = (elementId, value) => {
        const element = document.getElementById(elementId);
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    };
    simulateUserInput('domain', 'rainadmin.com');
    document.querySelectorAll('[choice-selector] div').forEach(el => el.click());
}
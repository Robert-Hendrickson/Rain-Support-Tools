export default async function setSiteWorkData() {
    // Helper function to simulate user input
    const simulateUserInput = (elementId, value) => {
        const element = document.getElementById(elementId);
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    };
    simulateUserInput('crm', '6085');
}
import { createApp } from '../src/common/vue/vue.esm-browser.prod.js';
import bugReportFlow from './mermaid-flows/bug-report-flow.js';

const flowApp = createApp({
    data() {
        return {
            mermaidFlow: '',
            flows: [
                { id: 'bugReportFlow', name: 'Bug Report Flow', description: 'Detailed process for handling errors and exceptions in the workflow', icon: 'fa-solid fa-bug', flow: bugReportFlow },
                { id: 'successPathFlow', name: 'Success Path Flow', description: 'Optimized workflow for successful process completion', icon: 'fa-solid fa-check', flow: 'successPathFlow' },
                { id: 'reviewProcessFlow', name: 'Review Process Flow', description: 'Comprehensive review and validation procedures', icon: 'fa-solid fa-check', flow: 'reviewProcessFlow' },
                { id: 'alternativePathFlow', name: 'Alternative Path Flow', description: 'Alternative path for handling errors and exceptions in the workflow', icon: 'fa-solid fa-code-branch', flow: 'alternativePathFlow' },
                { id: 'integrationFlow', name: 'Integration Flow', description: 'Integration with other systems', icon: 'fa-solid fa-code-branch', flow: 'integrationFlow' },
                { id: 'monitoringFlow', name: 'Monitoring Flow', description: 'Monitoring the workflow', icon: 'fa-solid fa-code-branch', flow: 'monitoringFlow' }
            ]
        }
    },
    methods: {
        async switchFlow(flowType) {
            try {
                this.mermaidFlow = this.flows.find(flow => flow.id === flowType).flow;
                await this.$nextTick();
                mermaid.init();
            } catch (error) {
                console.error('Error switching flow:', error);
            }
        }
    }
});
flowApp.mount('.flow-section');
/*
// Initialize Mermaid
mermaid.initialize({
    startOnLoad: true,
    theme: 'default',
    flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
    }
});

// Function to open flow in new tab
function openFlow(flowType) {
    const flowUrls = {
        'error-handling': 'error-handling-flow.html',
        'success-path': 'success-path-flow.html',
        'review-process': 'review-process-flow.html',
        'alternative-path': 'alternative-path-flow.html',
        'integration-flow': 'integration-flow.html',
        'monitoring-flow': 'monitoring-flow.html'
    };
    
    const url = flowUrls[flowType];
    if (url) {
        window.open(url, '_blank');
    }
}

// Add click animation to option cards
document.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'translateY(-5px)';
        }, 150);
    });
});*/
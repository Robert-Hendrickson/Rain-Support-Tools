import { createApp } from '../src/common/vue/vue.esm-browser.prod.js';
import bugReportFlow from './mermaid-flows/bug-report-flow.js';
import qbTroubleShoot from './mermaid-flows/qb-trouble-shoot.js';

const flowApp = createApp({
    data() {
        return {
            mermaidFlow: '',
            selectedFlow: '',
            flows: [
                bugReportFlow,
                qbTroubleShoot,
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
            if (!flowType) {
                this.mermaidFlow = '';
                return;
            }
            try {
                this.mermaidFlow = this.flows.find(flow => flow.id === flowType);
                await this.$nextTick();
                mermaid.init();
            } catch (error) {
                console.error('Error switching flow:', error);
            }
        }
    }
});
flowApp.mount('.flow-section');
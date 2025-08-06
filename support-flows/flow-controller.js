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
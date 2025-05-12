import { createApp } from '/Rain-Support-Tools/src/common/vue/vue.esm-browser.prod.js';
const feeDifferenceCalculator = createApp({
    data(){
        return {
            amexRates: false,
            showVideo: false,
            showImport: false,
            showWait: false,
            errorMessage: '',
            tableRows: [],
        }
    },
    methods: {
        importTransactions(){
            this.showWait = true;
            this.errorMessage = '';
            try{
                //get imported string
                let import_data = document.querySelector('.import textarea').value;
                //save value of each the number of lines divided by 9(should equal a whole number)
                let number_of_transactions = import_data.split('\n').length/9;
                if((/\./).test(number_of_transactions)){//if there is a decimal in the saved number then something is missing, generate an error response
                    throw new Error("The number of lines given doesn't match the number of expected lines for full data. Please make sure the copied data is the full set of data from rows selected and try again.");
                };
                //find all sets of data as an array
                let split_data = import_data.match(/(\d{2}:\d{2}:\d{2} [APMapm]{2})\n(\d+)\n(.*?)\n(.*?)\n([A-Za-z]{3} \d{1,2}, \d{4})\n(-{0,1}\$[\d.,]+)\n(-{0,1}\$[\d.,]+)\n(-{0,1}\$[\d.,]+)\n(-{0,1}\$[\d.,]+)/g);
                //check that total found data sets equals the number of expected lines
                if(number_of_transactions != split_data.length){
                    //if not generate an error response
                    throw new Error("The number of found rows doesn't match the number of estimated rows. This means there may be lines that are duplicated or missing. Please make sure the copied data is the full set of data from rows selected and try again.");
                }
                for(let i=0;i<split_data.length;i++){
                    let row = split_data[i].split('\n');
                    this.tableRows.push({
                        "dateNum": row[0],
                        "transaction": row[1],
                        "atTill": row[2],
                        "status": row[3],
                        "dateText": row[4],
                        "collected": row[5],
                        "fee": row[6],
                        "return": row[7],
                        "totalPayout": row[8],
                        "row": i+1
                    });
                }
                this.showWait = false;
            }catch(error){
                this.errorMessage = error.message;
            }
        },
        closeError(){
            this.showWait = false;
            this.errorMessage = '';
        },
        precentToDecimal(value){
            value = '0.0' + value.replace('.','');
            value = parseFloat(value);
            return value;
        },
        calculateDifference(){
            let rates = {};
            //collect and store card rates and fees
            rates['amexp'] = [this.precentToDecimal(document.querySelector('#amexcardPresentRate').value),parseFloat(document.querySelector('#amexcardPresentAmount').value)];
            rates['amexnp'] = [this.precentToDecimal(document.querySelector('#amexcardNotPresentRate').value),parseFloat(document.querySelector('#amexcardNotPresentAmount').value)];
            rates['cardp'] = [this.precentToDecimal(document.querySelector('#cardPresentRate').value),parseFloat(document.querySelector('#cardPresentAmount').value)];
            rates['cardnp'] = [this.precentToDecimal(document.querySelector('#cardNotPresentRate').value),parseFloat(document.querySelector('#cardNotPresentAmount').value)];
            let table_data = document.querySelectorAll('#transactions tbody tr');
            for(let i=0;i<table_data.length;i++){
                let temp_row = table_data[i];
                if(temp_row.querySelector('td:nth-child(3)').innerText === 'Card Not Present' && temp_row.querySelector('td:nth-child(6)').innerText !='$0.00'){
                    let temp_rates = rates.cardp;
                    let temp_collected = temp_row.querySelector('td:nth-child(6)').innerText.replace('$','');
                    if(this.amexRates){
                        //needs to check if rate used on row matches non-amex rates if it does do nothing. if it doesn't then we need to update temp_rates to use amex present rates instead.
                        let check_rate = rates.cardnp;
                        let check_fee = parseFloat(temp_collected);
                        check_fee *= check_rate[0];
                        check_fee += check_rate[1];
                        if(check_fee.toFixed(2) != temp_row.querySelector('td:nth-child(7)').innerText.replace('-$','')){
                            temp_rates = rates.amexp;
                        };
                    };
                    let temp_fee = parseFloat(temp_collected) * temp_rates[0];
                    temp_fee += temp_rates[1];
                    let difference = parseFloat(temp_row.querySelector('td:nth-child(7)').innerText.replace('$',''));
                    difference += temp_fee;
                    temp_row.querySelector('td:nth-child(10)').innerText = '$' + temp_fee.toFixed(2);
                    temp_row.querySelector('td:last-child').innerText = '$' + difference.toFixed(2);
                }else{
                    temp_row.querySelector('td:nth-child(10)').innerText = '$0.00';
                    temp_row.querySelector('td:last-child').innerText = '$0.00';
                };
            };
            this.calculateTotals(table_data);
        },
        calculateTotals(table){
            let total_fees = 0;
            let total_calculated_fees = 0;
            let total_difference = 0;
            for(let i=0;i<table.length;i++){
                if(table[i].querySelector('td:nth-child(10)').innerText != '$0.00'){
                    total_fees += parseFloat(table[i].querySelector('td:nth-child(7)').innerText.replace('$',''));
                    total_calculated_fees += parseFloat(table[i].querySelector('td:nth-child(10)').innerText.replace('$',''));
                    total_difference += parseFloat(table[i].querySelector('td:nth-child(11)').innerText.replace('$',''));
                };
            };
            let total_table = document.querySelector('#totals tbody tr');
            total_table.querySelector('td:nth-child(1)').innerText = `$${total_fees.toFixed(2)}`;
            total_table.querySelector('td:nth-child(2)').innerText = `$${total_calculated_fees.toFixed(2)}`;
            total_table.querySelector('td:nth-child(3)').innerText = `$${total_difference.toFixed(2)}`;
        }
    }
});
feeDifferenceCalculator.mount('#fee-difference-calculator');
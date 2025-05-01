/**
 * @description This is the app that runs the WA Tax Rates tool
 */
/*
6500 Linderson way

98501
*/
let waTaxRates = Vue.createApp({
    template: `<div class="addr_input" style="margin-left: 50px;">
    <table>
        <tbody>
            <tr>
                <td>Address:</td>
                <td><input type="text" id="address" /></td>
            </tr>
            <tr>
                <td>City:</td>
                <td><input type="text" id="city" /></td>
            </tr>
            <tr>
                <td>Zip:</td>
                <td><input type="text" id="zip" /></td>
            </tr>
        </tbody>
    </table>
    <input type="button" id="submit" value="Submit" @click="getTaxRates"/>
</div>
<div class="tax_output">
    <div v-if="appMessage">
        <div v-if="appMessage.type == 'error'">
            <p>{{ appMessage.message }}</p>
        </div>
        <div v-if="appMessage.type == 'success'">
            <p>{{ appMessage.message }}</p>
            <p>Total Rate: {{ appMessage.Total_rate }}%</p>
            <p>State Rate: {{ appMessage.State_rate }}%</p>
            <p>County Rate: {{ appMessage.County_rate }}%</p>
        </div>
        <div v-if="appMessage.type == 'waiting'">
            <span class="fa-solid fa-spinner fa-spin-pulse"></span>
            <p>{{ appMessage.message }}</p>
        </div>
    </div>
    <div v-else>
        <p>Enter an Address to get the tax rates</p>
    </div>
</div>`,
    data(){
        return {
            appMessage: null
        }   
    },
    methods: {
        getAddress(){
            return document.getElementById('address').value
        },
        getCity(){
            return document.getElementById('city').value
        },
        getZip(){
            return document.getElementById('zip').value
        },
        async getTaxRates(){
            const address = this.getAddress();
            const city = this.getCity();
            const zip = this.getZip();
            if(address == '' || zip == ''){
                this.appMessage = {
                    message: 'Please enter an address, and zip code',
                    type: 'error'
                }
                return;
            }
            this.appMessage = {
                message: 'Getting tax rates...',
                type: 'waiting'
            }
            try{
                const response = await axios.get(`https://webgis.dor.wa.gov/webapi/AddressRates.aspx?addr=${encodeURIComponent(address)}&city=${encodeURIComponent(city)}&zip=${encodeURIComponent(zip)}`);
                console.log(response , response.data);
                const data = response.data;
                this.appMessage = {
                    message: 'Tax rates retrieved successfully',
                    type: 'success',
                    Total_rate: Math.round(parseFloat(data.Rate) * 10000)/100,
                    State_rate: Math.round(parseFloat(data['State Rate']) * 10000)/100,
                    County_rate: Math.round(parseFloat(data.LocalRate) * 10000)/100

                }
            }catch(error){
                this.setMessage('Error getting tax rates', 'error');
            }
        },
        setMessage(object){
            this.appMessage = object;
        }
    }
})

window.waTaxRates = waTaxRates.mount('#wa-tax-rates');
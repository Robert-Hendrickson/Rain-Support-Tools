export const cssDefaults = {
    "page": {
		css: `/****base page styling****/
.pgBackground{
	width: 100%;
	background: linear-gradient(135deg, #ee7070, #2fd481);
	min-height: 800px;
}
h1,h2,h3,h4,h5{
	text-align: center;
	color: #ffffff;
}
.container.content{
	width: 65%;
	margin: 0px auto;
	background-color:#be45eebb;
}
.container{
	width: 65%;
	margin: 0px auto;
}`,
		html: {
			header: `Welcome to CSS!`,
		}
	},
	"summary": {
		css: `/****summary styling*****/
.summary p{
	background-color: #fefefe;
	margin: 0px auto;
	padding: 5px;
}`,
		html: {
			header: `Page Summary`,
			content: `<p>This page is for the purpose of being able to test targeting css. On the right side there is a button (<span class="fa-solid fa-pencil"></span>). Clicking this will open a side panel which will display the current css being used for the webpage. Editing this data will allow you to change, add, or remove css to see how it affects the page.</p>`
		}
	},
	"color": {
		css: `/*****Color Picker*****/
.userColor p{
	margin: 0px auto;
	background-color: #457eee;
}`,
		html: {
			header: `Try making your own color to use!`,
			content: `<p>You can either enter a hex color code into the text box to see what the color will look like before applying it to the page or you can use the color box to the left to use a color picker to find a color you like and then copy the hex code out of the text box.</p>
<input type="color" value="#457e96" />
<input type="text" value="#457e96" />`
		}
	},
	"list": {
		css: `/*****list styling*****/
ul{
	list-style-type: decimal;
}
ul li:nth-child(odd){
	color: green;
}
ul li:nth-child(even){
	color: red;
}
.item{
	font-weight: bold;
}
.odd{
	text-decoration: underline;
}
.even{
	text-decoration: line-through;
}`,
		html: {
			header: `Grocery List`,
			content: `<ul>
	<li class="odd item">Apples</li>
	<li class="even item">Oranges</li>
	<li class="odd item">Grapes</li>
</ul>`
		}
	},
	"table": {
		css: `/****table styling****/
th{
	border: #000 solid 1px;
	padding: 0px 5px;
}
th:first-child{
	border: none;
}
td{
	border: #000 solid 1px;
	text-align: right;
}`,
		html: {
			header: `Stores and Prices`,
			content: `<table>
<thead>
	<tr>
		<th></th>
		<th>Walmart</th>
		<th>Target</th>
		<th>Macey's</th>
	</tr>
</thead>
<tbody>
	<tr class="apple">
		<td>Apple Prices</td>
		<td>
			$3.95
		</td>
		<td>
			$3.60
		</td>
		<td>
			$2.86
		</td>
	</tr>
	<tr class="orange">
		<td>Orange Prices</td>
		<td>
			$4.88
		</td>
		<td>
			$5.16
		</td>
		<td>
			$4.65
		</td>
	</tr>
	<tr class="grape">
		<td>Grape Prices</td>
		<td>
			$1.45
		</td>
		<td>
			$1.35
		</td>
		<td>
			$3.99
		</td>
	</tr>
	</tbody>
</table>`
		}
	},
	"filler": {
		css: `/****filler styling****/
.filler{
	padding: 10px;
}
#image img{
	width: 40%;
	height: auto;
	margin: 0px auto;
	display: block;
}`,
		html: {
			header: `Filler Text and Image`,
			content: `<div class="filler">
<div id="text">
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eleifend quam adipiscing vitae proin sagittis nisl. Erat pellentesque adipiscing commodo elit at imperdiet dui accumsan sit. Fringilla ut morbi tincidunt augue. Leo duis ut diam quam nulla porttitor massa. Blandit volutpat maecenas volutpat blandit. Cum sociis natoque penatibus et magnis. Id porta nibh venenatis cras sed. Id venenatis a condimentum vitae. Urna id volutpat lacus laoreet non curabitur gravida arcu. Posuere lorem ipsum dolor sit amet consectetur adipiscing elit duis. Et malesuada fames ac turpis egestas sed tempus urna. Diam quam nulla porttitor massa id. Mi bibendum neque egestas congue quisque egestas diam in arcu. Mauris nunc congue nisi vitae suscipit. Auctor eu augue ut lectus arcu. Sapien faucibus et molestie ac. Bibendum ut tristique et egestas quis ipsum.
</div>
<div id="image">
<img src="/Rain-Support-Tools/src/media/imgs/This_is_fine.png" />
</div>
</div>`
		}
	}
}
export const cssDefaults = {
    "base-page": {
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
}`
	},
	"summary": {
		css: `/****summary styling*****/
.summary{
	background-color: #fefefe;
	margin: 0px auto;
	padding: 5px;
}`,
		html: `This page is for the purpose of being able to test targeting css. On the right side there is a button (<span class="fa-solid fa-pencil"></span>). Clicking this will open a side panel which will display the current css being used for the webpage. Editing this data will allow you to change, add, or remove css to see how it affects the page.`
	},//need to continue adding the html for the page elements
	"color-css": `/*****Color Picker*****/
.userColor p{
	margin: 0px auto;
	background-color: #457eee;
}`,
	"list-css": `/*****list styling*****/
ul{
	list-style-type: decimal;
}
.item{
	font-weight: bold;
}
.odd{
	text-decoration: underline;
}
.even{
	color: #FFA500;
}`,
	"table-css": `/****table styling****/
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
	"filler-css": `/****filler styling****/
.filler{
	padding: 5px;
}
#image img{
	width: 40%;
	height: auto;
	margin: 0px auto;
	display: block;
}`
}
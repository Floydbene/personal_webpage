import styled from 'styled-components';

const Wrapper = styled.div`
  @grid-padding: 10px;
@mobile-break: 600px;

@keyframes up-in {
    from {opacity: 0; bottom: 0%;}
    to {opacity: 1; bottom: 50%;}
}

.fill {
	background-repeat: no-repeat;
	background-position: center center;
	background-size: cover;
	background-attachment: fixed;
}

body,
html {
	height: 100%;
	min-width: 100%;
	min-height: 100%;
	margin: 0;
	padding: 0;
	overflow: hidden;
	
	font-family: 'Raleway', sans-serif;
}

.flex-row {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-around;
}

.container {
	.flex-row;
	width: 100%;
	min-height: 100%;
	height: 100%;
	overflow: auto;
	background-color: white;
	position: relative;
	
	&.no-scroll {
		overflow: hidden;
	}
}

.page {
	width: 80%;
	padding: @grid-padding;
	background-color: white;
}

@media (max-width: @mobile-break) 
{
	.page
	{
		width: 90%;
	}
}

.grid {
	.flex-row;
	.grid-item {
		width: 33%;
		position: relative;
		&:after {
			content: '';
			display: block;
			margin-top: 100%;
		}
	}
	
	@media (max-width: @mobile-break) 
	{
		.grid-item
		{
			width: 50%;
		}
	}
}

.box {
	position: absolute;
	top: @grid-padding;
	bottom: @grid-padding;
	left: @grid-padding;
	right: @grid-padding;
	background-color: white;
	background-size: cover;
	background-repeat: no-repeat;
	background-position: center top;
	overflow: hidden;
	
	cursor: pointer;
	
	img
	{
		width: 100%;
		transition: transform 0.6s ease;
	}
	
	&.selected {
		opacity: 0;
	}
	&.on-top {
		cursor: default;
		transition: all 0.4s ease;
		box-shadow: 2px 2px 19px -2px rgba(0, 0, 0, 0.44);
	}
	
	&.image-out
	{
		img
		{
			transform: translateY(-100%);
		}
	}
}

.content
{
	position: absolute;
	padding: 20px 40px;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	
	opacity: 0;
	transition: opacity 0.5s ease;
	
	.show &
	{
		opacity: 1;
	}
}

@media (max-width: @mobile-break) 
{
	.content
	{
		padding: 10px 20px;
	}
}

.scroller {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	overflow-y: auto;
	
	h1
	{
		color: white;
		width: 100%;
		margin-bottom: 30px;
		position: absolute;
		bottom: 50%;
		text-align: center;
		
		animation: up-in 1s ease;
	}
}

.top-up.ng-hide-add,
.top-up.ng-hide-remove {
	transition: 0s ease top;
}

.top-up.ng-hide-add-active,
.top-up.ng-hide-remove-active {
	transition: 0.6s ease top;
}

.top-up.ng-hide-add {
	top: 0;
}

.top-up.ng-hide-add.ng-hide-add-active {
	top: 100%;
}

.top-up.ng-hide-remove {
	top: 100%;
}

.top-up.ng-hide-remove.ng-hide-remove-active {
	top: 0
}

.fullscreen-background {
	overflow-y: auto;
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: #333;
	transition: top 0.5s ease;
	.fill;
	&.show {
		top: 0;
	}
}

.close-button {
	position: fixed;
	top: 20px;
	right: 20px;
	color: white;
	cursor: pointer;
	i {
		font-size: 35px;
	}
	&:hover {
		color: #ddd;
	}
}

`;

export default Wrapper;

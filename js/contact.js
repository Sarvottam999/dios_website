/* JS Document */

/******************************

[Table of Contents]

1. Vars and Inits
2. Set Header
3. Init Menu
4. Init Date Picker
5. Init Time Picker
6. Init Google Map


******************************/

$(document).ready(function()
{
	"use strict";

	/* 

	1. Vars and Inits

	*/

	var header = $('.header');
	var hamburgerBar = $('.hamburger_bar');
	var hamburger = $('.hamburger');
	var map;

	setHeader();

	$(window).on('resize', function()
	{
		setHeader();

		setTimeout(function()
		{
			$(window).trigger('resize.px.parallax');
		}, 375);
	});

	$(document).on('scroll', function()
	{
		setHeader();
	});

	initDatePicker();
	// initTimePicker();
	initMenu();
	initGoogleMap();

	/* 

	2. Set Header

	*/

	function setHeader()
	{
		if($(window).scrollTop() > 91)
		{
			header.addClass('scrolled');
			hamburgerBar.addClass('scrolled');
		}
		else
		{
			header.removeClass('scrolled');
			hamburgerBar.removeClass('scrolled');
		}
	}

	/* 

	3. Init Menu

	*/

	function initMenu()
	{
		if($('.menu').length)
		{
			var menu = $('.menu');
			hamburger.on('click', function()
			{
				hamburger.toggleClass('active');
				menu.toggleClass('active');
			});
		}
	}

	/* 

	4. Init Date Picker

	*/

	function initDatePicker()
	{
		var dp = $('#datepicker');
		var date = new Date();
		var dateM = date.getMonth() + 1;
		var dateD = date.getDate();
		var dateY = date.getFullYear();
		var dateFinal = dateM + '/' + dateD + '/' + dateY;
		dp.val(dateFinal);
		dp.datepicker();
	}

	/* 

	5. Init Time Picker

	*/

	// function initTimePicker()
	// {
	// 	$('.timepicker').timepicker(
	// 	{
	// 	    interval: 60,
	// 	    minTime: '10',
	// 	    maxTime: '6:00pm',
	// 	    defaultTime: '11',
	// 	    startTime: '10:00',
	// 	    dynamic:  true,
	// 	    dropdown: true,
	// 	    scrollbar: true
	// 	});
	// }

	/* 

6. Init OpenStreetMap

*/

function initGoogleMap()
{
	// Initialize the map
	var map = L.map('map').setView([29.3914682, 76.958392], 18);

	// Add OpenStreetMap tiles
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		maxZoom: 19
	}).addTo(map);

	// Add marker for DIOS location
	var marker = L.marker([29.3914682, 76.958392]).addTo(map);

	// Add popup to marker
	marker.bindPopup('<div style="padding:10px;"><h4 style="margin:0 0 5px 0;color:#232323;">DIOS Panipat</h4><p style="margin:0;color:#636363;font-size:14px;">2nd & 3rd Floor, Lal Tanki Market<br>Model Town, Panipat<br><strong>+91 74970 01110</strong></p></div>');

	// Open popup by default
	marker.openPopup();

	// Handle map resize
	window.addEventListener('resize', function() {
		setTimeout(function() {
			map.invalidateSize();
		}, 400);
	});
}
});
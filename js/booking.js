/* Booking Component */

var BookingComponent = (function() {
    'use strict';

    var API_URL = 'https://api.birlallf.org/api'; // Replace with your actual API URL
    var timeSlots = [];

    function init(containerId) {
        loadTimeSlots();
        setupEventListeners(containerId);
    }

    function loadTimeSlots() {
        // Fetch available time slots from API
        fetch(API_URL + '/timeslots/')
            .then(response => response.json())
            .then(data => {
                timeSlots = data;
                // populateTimeSlots();
            })
            .catch(error => console.error('Error loading time slots:', error));
    }

    function populateTimeSlots() {
        var timepicker = $('.timepicker');
        timepicker.empty();
        
        // Add default option
        timepicker.append('<option value="" disabled selected>Select Time</option>');
        
        timeSlots.forEach(function(slot) {
            if (slot.is_active && slot.remaining_capacity > 0) {
                var option = '<option value="' + slot.id + '">' + 
                            slot.start_time + ' - ' + slot.end_time + 
                            ' (' + slot.remaining_capacity + ' spots left)</option>';
                timepicker.append(option);
            }
        });
    }
    function setupEventListeners(containerId) {
        var form = $('#' + containerId);
        
        console.log('Form found:', form.length); // Should print 1
        
        form.on('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted!'); // Check if this prints
            submitBooking(this);
        });
    }

    function submitBooking(form) {
        var guestsValue = $(form).find('.res_select').val();
        
        if (!guestsValue) {
            showError({number_of_guests: ['Please select number of guests']});
            return;
        }
        
        // Convert date from MM/DD/YYYY to YYYY-MM-DD
        var dateValue = $(form).find('#datepicker').val();
        var dateParts = dateValue.split('/');
        var formattedDate = dateParts[2] + '-' + dateParts[0].padStart(2, '0') + '-' + dateParts[1].padStart(2, '0');
        
        var formData = {
            full_name: $(form).find('[name="full_name"]').val(),
            phone: $(form).find('[name="phone"]').val(),
            email: $(form).find('[name="email"]').val(),
            date: formattedDate, // Changed
            time_slot: 1, // Hardcoded for now - we'll fix this next
            number_of_guests: parseInt(guestsValue),
            occasion: $(form).find('[name="occasion"]').val() || '',
            special_request: $(form).find('[name="special_request"]').val() || ''
        };
    
        console.log('Form Data:', formData);
    
        fetch(API_URL + '/bookings/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => Promise.reject(err));
            }
            return response.json();
        })
        .then(data => {
            showSuccess('Booking created successfully! Booking ID: ' + data.id);
            $(form)[0].reset();
            initDatePicker();
        })
        .catch(error => {
            console.log('Full error object:', error); // Add this
            console.log('Error type:', typeof error); // Add this
            showError(error);
        });
    }

    function showSuccess(message) {
        alert(message); // Replace with better UI notification
    }

    function showError(errors) {
        var errorMsg = 'Booking failed:\n';
        for (var key in errors) {
            errorMsg += errors[key].join('\n') + '\n';
        }
        alert(errorMsg); // Replace with better UI notification
    }

    function initDatePicker() {
        var dp = $('#datepicker');
        var today = new Date();
        dp.datepicker({
            minDate: today
        });
    }

    return {
        init: init
    };
})();
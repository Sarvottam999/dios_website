/* Booking Component */

var BookingComponent = (function() {
    'use strict';

    var API_URL = 'http://127.0.0.1:8000/api'; // Replace with your actual API URL
    var timeSlots = [];

    function init(containerId) {
        loadTimeSlots();
        setupEventListeners(containerId);
    }



function loadTimeSlots(selectedDate) {
    if (!selectedDate) return;
    
    // Format date as YYYY-MM-DD
    var dateParts = selectedDate.split('/');
    var formattedDate = dateParts[2] + '-' + dateParts[0].padStart(2, '0') + '-' + dateParts[1].padStart(2, '0');
    
    fetch(API_URL + '/slots/?date=' + formattedDate, {
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Token 606d2e0f9af4b0feb0d9d055bdd80ae916efe6a6'
        }
    })
    .then(response => response.json())
    .then(data => {
        timeSlots = data.results;
        populateTimeSlots();
    })
    .catch(error => console.error('Error loading time slots:', error));
}

function populateTimeSlots() {
    var timeslotSelect = $('#timeslot');
    timeslotSelect.empty();
    timeslotSelect.append('<option value="" disabled selected>Select Time</option>');
    
    timeSlots.forEach(function(slot) {
        if (slot.is_active && slot.remaining_capacity > 0) {
            var option = '<option value="' + slot.id + '">' + 
                        slot.start_time.substring(0,5) + ' - ' + slot.end_time.substring(0,5) + 
                        ' (' + slot.remaining_capacity + ' spots)</option>';
            timeslotSelect.append(option);
        }
    });
}
    // function loadTimeSlots() {
    //     // Fetch available time slots from API
    //     fetch(API_URL + '/timeslots/')
    //         .then(response => response.json())
    //         .then(data => {
    //             timeSlots = data;
    //             // populateTimeSlots();
    //         })
    //         .catch(error => console.error('Error loading time slots:', error));
    // }

    // function populateTimeSlots() {
    //     var timepicker = $('.timepicker');
    //     timepicker.empty();
        
    //     // Add default option
    //     timepicker.append('<option value="" disabled selected>Select Time</option>');
        
    //     timeSlots.forEach(function(slot) {
    //         if (slot.is_active && slot.remaining_capacity > 0) {
    //             var option = '<option value="' + slot.id + '">' + 
    //                         slot.start_time + ' - ' + slot.end_time + 
    //                         ' (' + slot.remaining_capacity + ' spots left)</option>';
    //             timepicker.append(option);
    //         }
    //     });
    // }
    function setupEventListeners(containerId) {
        var form = $('#' + containerId);
        
        // Load slots when date changes
        $('#datepicker').on('change', function() {
            loadTimeSlots($(this).val());
        });
        
        form.on('submit', function(e) {
            e.preventDefault();
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
            time_slot: parseInt($('#timeslot').val()), 
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
            showSuccess('Booking created successfully!');
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




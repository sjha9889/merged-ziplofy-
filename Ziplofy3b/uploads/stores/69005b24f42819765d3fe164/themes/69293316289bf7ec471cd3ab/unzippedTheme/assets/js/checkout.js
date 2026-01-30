/* Checkout Page JavaScript */

$(document).ready(function() {
    // Initialize checkout functionality
    initBillingForm();
    initShippingForm();
    initPaymentMethods();
    initOrderSummary();
    initFormValidation();
    initPlaceOrder();
});

// Billing Form
function initBillingForm() {
    // Auto-fill shipping if checkbox is checked
    $('#sameAsBilling').on('change', function() {
        if ($(this).is(':checked')) {
            copyBillingToShipping();
        } else {
            clearShippingForm();
        }
    });
}

// Shipping Form
function initShippingForm() {
    // Shipping method change
    $('input[name="shippingMethod"]').on('change', function() {
        updateShippingCost($(this).val());
    });
}

// Payment Methods
function initPaymentMethods() {
    // Payment method change
    $('input[name="paymentMethod"]').on('change', function() {
        const method = $(this).val();
        togglePaymentForm(method);
    });
}

// Order Summary
function initOrderSummary() {
    updateOrderSummary();
}

// Form Validation
function initFormValidation() {
    // Real-time validation
    $('.form-control, .form-select').on('blur', function() {
        validateField($(this));
    });
    
    // Form submission validation
    $('#checkoutForm').on('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            processOrder();
        }
    });
}

// Place Order
function initPlaceOrder() {
    $('#placeOrder').on('click', function(e) {
        e.preventDefault();
        if (validateForm()) {
            processOrder();
        }
    });
}

// Helper Functions
function copyBillingToShipping() {
    const billingFields = [
        'firstName', 'lastName', 'email', 'phone', 
        'address', 'city', 'state', 'zipCode'
    ];
    
    billingFields.forEach(field => {
        const billingValue = $(`#${field}`).val();
        $(`#shipping${field.charAt(0).toUpperCase() + field.slice(1)}`).val(billingValue);
    });
}

function clearShippingForm() {
    const shippingFields = [
        'shippingFirstName', 'shippingLastName', 'shippingEmail', 'shippingPhone',
        'shippingAddress', 'shippingCity', 'shippingState', 'shippingZipCode'
    ];
    
    shippingFields.forEach(field => {
        $(`#${field}`).val('');
    });
}

function updateShippingCost(method) {
    let cost = 0;
    
    switch(method) {
        case 'standard':
            cost = 9.99;
            break;
        case 'express':
            cost = 19.99;
            break;
        case 'free':
            cost = 0;
            break;
    }
    
    $('#shippingCost').text('$' + cost.toFixed(2));
    updateOrderTotal();
}

function togglePaymentForm(method) {
    // Hide all payment forms
    $('.credit-card-form').hide();
    
    // Show relevant form
    if (method === 'credit') {
        $('.credit-card-form').show();
    }
}

function updateOrderSummary() {
    // This would typically fetch from cart data
    // For demo purposes, we'll use static values
    const subtotal = 459.96;
    const shipping = parseFloat($('#shippingCost').text().replace('$', ''));
    const tax = subtotal * 0.08;
    const discount = 20.00;
    const total = subtotal + shipping + tax - discount;
    
    $('.subtotal').text('$' + subtotal.toFixed(2));
    $('.shipping').text('$' + shipping.toFixed(2));
    $('.tax').text('$' + tax.toFixed(2));
    $('.discount').text('-$' + discount.toFixed(2));
    $('.total').text('$' + total.toFixed(2));
}

function updateOrderTotal() {
    const subtotal = 459.96;
    const shipping = parseFloat($('#shippingCost').text().replace('$', ''));
    const tax = subtotal * 0.08;
    const discount = 20.00;
    const total = subtotal + shipping + tax - discount;
    
    $('#orderTotal').text('$' + total.toFixed(2));
}

function validateField($field) {
    const value = $field.val().trim();
    const fieldName = $field.attr('name');
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if ($field.prop('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // ZIP code validation
    if (fieldName === 'zipCode' && value) {
        const zipRegex = /^\d{5}(-\d{4})?$/;
        if (!zipRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid ZIP code';
        }
    }
    
    // Card number validation
    if (fieldName === 'cardNumber' && value) {
        const cardRegex = /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/;
        if (!cardRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid card number';
        }
    }
    
    // CVV validation
    if (fieldName === 'cvv' && value) {
        const cvvRegex = /^\d{3,4}$/;
        if (!cvvRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid CVV';
        }
    }
    
    // Update field appearance
    if (isValid) {
        $field.removeClass('is-invalid').addClass('is-valid');
        $field.siblings('.invalid-feedback').remove();
    } else {
        $field.removeClass('is-valid').addClass('is-invalid');
        $field.siblings('.invalid-feedback').remove();
        $field.after(`<div class="invalid-feedback">${errorMessage}</div>`);
    }
    
    return isValid;
}

function validateForm() {
    let isValid = true;
    
    // Validate all required fields
    $('.form-control[required], .form-select[required]').each(function() {
        if (!validateField($(this))) {
            isValid = false;
        }
    });
    
    // Validate payment method specific fields
    const paymentMethod = $('input[name="paymentMethod"]:checked').val();
    if (paymentMethod === 'credit') {
        const creditFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
        creditFields.forEach(field => {
            if (!validateField($(`#${field}`))) {
                isValid = false;
            }
        });
    }
    
    return isValid;
}

function processOrder() {
    // Show loading state
    const $btn = $('#placeOrder');
    const originalHtml = $btn.html();
    $btn.html('<i class="fas fa-spinner fa-spin me-2"></i>Processing...');
    $btn.prop('disabled', true);
    
    // Simulate order processing
    setTimeout(() => {
        // Show success message
        showOrderSuccess();
        
        // Reset button
        $btn.html(originalHtml);
        $btn.prop('disabled', false);
    }, 3000);
}

function showOrderSuccess() {
    const successHtml = `
        <div class="modal fade" id="orderSuccessModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-check-circle me-2"></i>Order Placed Successfully!
                        </h5>
                    </div>
                    <div class="modal-body text-center">
                        <div class="success-icon mb-4">
                            <i class="fas fa-check-circle fa-5x text-success"></i>
                        </div>
                        <h4>Thank you for your order!</h4>
                        <p class="text-muted mb-4">Your order has been placed successfully. You will receive a confirmation email shortly.</p>
                        <div class="order-details">
                            <div class="row">
                                <div class="col-md-6">
                                    <strong>Order Number:</strong> #12345
                                </div>
                                <div class="col-md-6">
                                    <strong>Total Amount:</strong> $486.75
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <a href="index.html" class="btn btn-primary">Continue Shopping</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal
    $('#orderSuccessModal').remove();
    
    // Add new modal
    $('body').append(successHtml);
    
    // Show modal
    $('#orderSuccessModal').modal('show');
    
    // Redirect after modal is closed
    $('#orderSuccessModal').on('hidden.bs.modal', function() {
        window.location.href = 'index.html';
    });
}

// Auto-format card number
$('#cardNumber').on('input', function() {
    let value = $(this).val().replace(/\s/g, '');
    let formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    $(this).val(formattedValue);
});

// Auto-format expiry date
$('#expiryDate').on('input', function() {
    let value = $(this).val().replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    $(this).val(value);
});

// Auto-format phone number
$('#phone, #shippingPhone').on('input', function() {
    let value = $(this).val().replace(/\D/g, '');
    if (value.length >= 6) {
        value = '(' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6, 10);
    } else if (value.length >= 3) {
        value = '(' + value.substring(0, 3) + ') ' + value.substring(3);
    }
    $(this).val(value);
});

// Auto-format ZIP code
$('#zipCode, #shippingZipCode').on('input', function() {
    let value = $(this).val().replace(/\D/g, '');
    if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5, 9);
    }
    $(this).val(value);
});

// CSS for checkout page
const checkoutCSS = `
    .form-control.is-valid,
    .form-select.is-valid {
        border-color: #28a745;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='m2.3 6.73.94-.94 1.44-1.44L6.73 2.3l.94.94L4.68 6.27l-1.44 1.44-.94-.94z'/%3e%3c/svg%3e");
    }
    
    .form-control.is-invalid,
    .form-select.is-invalid {
        border-color: #dc3545;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath d='m5.8 4.6 1.4 1.4 1.4-1.4'/%3e%3c/svg%3e");
    }
    
    .invalid-feedback {
        display: block;
        width: 100%;
        margin-top: 0.25rem;
        font-size: 0.875em;
        color: #dc3545;
    }
    
    .success-icon {
        animation: bounceIn 0.6s ease-out;
    }
    
    @keyframes bounceIn {
        0% {
            transform: scale(0.3);
            opacity: 0;
        }
        50% {
            transform: scale(1.05);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    .order-details {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        margin-top: 20px;
    }
    
    .order-details .row {
        margin: 0;
    }
    
    .order-details .col-md-6 {
        padding: 10px 0;
        border-bottom: 1px solid #dee2e6;
    }
    
    .order-details .col-md-6:last-child {
        border-bottom: none;
    }
`;

// Add checkout CSS
$('<style>').text(checkoutCSS).appendTo('head');

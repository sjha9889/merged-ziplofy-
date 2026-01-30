/* Authentication Pages JavaScript */

$(document).ready(function() {
    // Initialize authentication functionality
    initPasswordToggle();
    initPasswordStrength();
    initFormValidation();
    initSocialLogin();
    initFormSubmission();
});

// Password Toggle
function initPasswordToggle() {
    $('#togglePassword').on('click', function() {
        const $passwordField = $('#password');
        const $icon = $(this).find('i');
        
        if ($passwordField.attr('type') === 'password') {
            $passwordField.attr('type', 'text');
            $icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            $passwordField.attr('type', 'password');
            $icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });
}

// Password Strength
function initPasswordStrength() {
    $('#password').on('input', function() {
        const password = $(this).val();
        const strength = calculatePasswordStrength(password);
        updatePasswordStrengthUI(strength);
    });
}

// Form Validation
function initFormValidation() {
    // Real-time validation
    $('.form-control').on('blur', function() {
        validateField($(this));
    });
    
    // Email validation
    $('#email').on('input', function() {
        const email = $(this).val();
        if (email) {
            validateEmail(email);
        }
    });
    
    // Password confirmation
    $('#confirmPassword').on('input', function() {
        const password = $('#password').val();
        const confirmPassword = $(this).val();
        validatePasswordMatch(password, confirmPassword);
    });
}

// Social Login
function initSocialLogin() {
    $('.social-login .btn').on('click', function(e) {
        e.preventDefault();
        const platform = $(this).find('i').attr('class').split(' ')[1].replace('fa-', '');
        handleSocialLogin(platform);
    });
}

// Form Submission
function initFormSubmission() {
    // Login form
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        if (validateLoginForm()) {
            processLogin();
        }
    });
    
    // Register form
    $('#registerForm').on('submit', function(e) {
        e.preventDefault();
        if (validateRegisterForm()) {
            processRegistration();
        }
    });
}

// Helper Functions
function calculatePasswordStrength(password) {
    let strength = 0;
    let feedback = [];
    
    // Length check
    if (password.length >= 8) {
        strength += 25;
    } else {
        feedback.push('At least 8 characters');
    }
    
    // Lowercase check
    if (/[a-z]/.test(password)) {
        strength += 25;
    } else {
        feedback.push('Lowercase letter');
    }
    
    // Uppercase check
    if (/[A-Z]/.test(password)) {
        strength += 25;
    } else {
        feedback.push('Uppercase letter');
    }
    
    // Number check
    if (/\d/.test(password)) {
        strength += 25;
    } else {
        feedback.push('Number');
    }
    
    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        strength += 10;
    }
    
    return { strength, feedback };
}

function updatePasswordStrengthUI(strengthData) {
    const { strength, feedback } = strengthData;
    const $progressBar = $('.password-strength .progress-bar');
    const $strengthText = $('#passwordStrength');
    
    // Update progress bar
    $progressBar.css('width', strength + '%');
    
    // Update strength text
    let strengthText = '';
    let strengthClass = '';
    
    if (strength < 25) {
        strengthText = 'Very Weak';
        strengthClass = 'text-danger';
    } else if (strength < 50) {
        strengthText = 'Weak';
        strengthClass = 'text-danger';
    } else if (strength < 75) {
        strengthText = 'Fair';
        strengthClass = 'text-warning';
    } else if (strength < 90) {
        strengthText = 'Good';
        strengthClass = 'text-info';
    } else {
        strengthText = 'Strong';
        strengthClass = 'text-success';
    }
    
    $strengthText.text(strengthText).removeClass('text-danger text-warning text-info text-success').addClass(strengthClass);
    
    // Update progress bar color
    $progressBar.removeClass('bg-danger bg-warning bg-info bg-success');
    if (strength < 25) {
        $progressBar.addClass('bg-danger');
    } else if (strength < 50) {
        $progressBar.addClass('bg-danger');
    } else if (strength < 75) {
        $progressBar.addClass('bg-warning');
    } else if (strength < 90) {
        $progressBar.addClass('bg-info');
    } else {
        $progressBar.addClass('bg-success');
    }
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
    
    // Password validation
    if (fieldName === 'password' && value) {
        if (value.length < 8) {
            isValid = false;
            errorMessage = 'Password must be at least 8 characters long';
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

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const $emailField = $('#email');
    
    if (emailRegex.test(email)) {
        $emailField.removeClass('is-invalid').addClass('is-valid');
        $emailField.siblings('.invalid-feedback').remove();
        return true;
    } else {
        $emailField.removeClass('is-valid').addClass('is-invalid');
        $emailField.siblings('.invalid-feedback').remove();
        $emailField.after('<div class="invalid-feedback">Please enter a valid email address</div>');
        return false;
    }
}

function validatePasswordMatch(password, confirmPassword) {
    const $confirmField = $('#confirmPassword');
    
    if (password === confirmPassword && confirmPassword.length > 0) {
        $confirmField.removeClass('is-invalid').addClass('is-valid');
        $confirmField.siblings('.invalid-feedback').remove();
        return true;
    } else if (confirmPassword.length > 0) {
        $confirmField.removeClass('is-valid').addClass('is-invalid');
        $confirmField.siblings('.invalid-feedback').remove();
        $confirmField.after('<div class="invalid-feedback">Passwords do not match</div>');
        return false;
    }
    
    return true;
}

function validateLoginForm() {
    let isValid = true;
    
    // Validate email
    if (!validateEmail($('#email').val())) {
        isValid = false;
    }
    
    // Validate password
    if (!validateField($('#password'))) {
        isValid = false;
    }
    
    return isValid;
}

function validateRegisterForm() {
    let isValid = true;
    
    // Validate all required fields
    $('.form-control[required]').each(function() {
        if (!validateField($(this))) {
            isValid = false;
        }
    });
    
    // Validate email
    if (!validateEmail($('#email').val())) {
        isValid = false;
    }
    
    // Validate password strength
    const password = $('#password').val();
    const strength = calculatePasswordStrength(password);
    if (strength.strength < 50) {
        showNotification('Password is too weak. Please choose a stronger password.', 'error');
        isValid = false;
    }
    
    // Validate password match
    if (!validatePasswordMatch(password, $('#confirmPassword').val())) {
        isValid = false;
    }
    
    // Validate terms agreement
    if (!$('#agreeTerms').is(':checked')) {
        showNotification('Please agree to the Terms of Service and Privacy Policy', 'error');
        isValid = false;
    }
    
    return isValid;
}

function processLogin() {
    // Show loading state
    const $btn = $('#loginForm button[type="submit"]');
    const originalHtml = $btn.html();
    $btn.html('<i class="fas fa-spinner fa-spin me-2"></i>Signing in...');
    $btn.prop('disabled', true);
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showNotification('Login successful! Redirecting...', 'success');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
        // Reset button
        $btn.html(originalHtml);
        $btn.prop('disabled', false);
    }, 2000);
}

function processRegistration() {
    // Show loading state
    const $btn = $('#registerForm button[type="submit"]');
    const originalHtml = $btn.html();
    $btn.html('<i class="fas fa-spinner fa-spin me-2"></i>Creating account...');
    $btn.prop('disabled', true);
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showNotification('Account created successfully! Please check your email for verification.', 'success');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        
        // Reset button
        $btn.html(originalHtml);
        $btn.prop('disabled', false);
    }, 2000);
}

function handleSocialLogin(platform) {
    // Show loading state
    const $btn = $(`.social-login .btn:has(.fa-${platform})`);
    const originalHtml = $btn.html();
    $btn.html('<i class="fas fa-spinner fa-spin me-2"></i>Connecting...');
    $btn.prop('disabled', true);
    
    // Simulate social login
    setTimeout(() => {
        // Show success message
        showNotification(`Connected with ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`, 'success');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
        // Reset button
        $btn.html(originalHtml);
        $btn.prop('disabled', false);
    }, 1500);
}

// Notification System
function showNotification(message, type = 'info') {
    const notificationHtml = `
        <div class="notification notification-${type}">
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        </div>
    `;
    
    // Remove existing notifications
    $('.notification').remove();
    
    // Add new notification
    $('body').append(notificationHtml);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        $('.notification').fadeOut(() => {
            $(this).remove();
        });
    }, 3000);
}

// Auto-format phone number
$('#phone').on('input', function() {
    let value = $(this).val().replace(/\D/g, '');
    if (value.length >= 6) {
        value = '(' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6, 10);
    } else if (value.length >= 3) {
        value = '(' + value.substring(0, 3) + ') ' + value.substring(3);
    }
    $(this).val(value);
});

// Auto-format date of birth
$('#dateOfBirth').on('change', function() {
    const selectedDate = new Date($(this).val());
    const today = new Date();
    const age = today.getFullYear() - selectedDate.getFullYear();
    
    if (age < 13) {
        showNotification('You must be at least 13 years old to register', 'error');
        $(this).val('');
    }
});

// CSS for authentication pages
const authCSS = `
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
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        padding: 15px 20px;
        border-left: 4px solid #007bff;
        animation: slideInRight 0.3s ease-out;
    }
    
    .notification-success {
        border-left-color: #28a745;
    }
    
    .notification-error {
        border-left-color: #dc3545;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-content i {
        font-size: 18px;
    }
    
    .notification-success .notification-content i {
        color: #28a745;
    }
    
    .notification-error .notification-content i {
        color: #dc3545;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

// Add auth CSS
$('<style>').text(authCSS).appendTo('head');

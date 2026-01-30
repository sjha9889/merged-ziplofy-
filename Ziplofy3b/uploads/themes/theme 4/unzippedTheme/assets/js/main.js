(function ($) {
    "use strict";
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    
    
    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 90) {
            $('.nav-bar').addClass('nav-sticky');
            $('.carousel, .page-header').css("margin-top", "73px");
        } else {
            $('.nav-bar').removeClass('nav-sticky');
            $('.carousel, .page-header').css("margin-top", "0");
        }
    });
    
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });


    // Testimonials carousel
    $(".testimonials-carousel").owlCarousel({
        autoplay: true,
        dots: true,
        loop: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
    
    
    // Blogs carousel
    $(".blog-carousel").owlCarousel({
        autoplay: true,
        dots: true,
        loop: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
    
    
    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });

    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('filter-active');
        $(this).addClass('filter-active');

        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });

    // Prevent FAQ accordion links from jumping the page
    $(document).on('click', '.faqs .card-header a', function(e){
        var targetSelector = $(this).attr('href');
        if (targetSelector && targetSelector.startsWith('#')) {
            e.preventDefault();
            try {
                $(targetSelector).collapse('toggle');
                // update aria-expanded
                var isExpanded = $(this).attr('aria-expanded') === 'true';
                $(this).attr('aria-expanded', (!isExpanded).toString());
                $(this).toggleClass('collapsed', isExpanded);
            } catch (err) {
                // no-op if collapse plugin not available
            }
        }
    });

    // Prevent product detail tabs from scrolling to top; show tab via JS
    $(document).on('click', '.nav.nav-tabs a[data-toggle="tab"]', function(e){
        e.preventDefault();
        try { $(this).tab('show'); } catch (err) {}
    });
    
    // Global Mobile Drawer (delegated to support all pages reliably)
    (function(){
        function open(){
            var drawer = document.getElementById('mobileDrawer');
            var backdrop = document.getElementById('mobileBackdrop');
            if(drawer && backdrop){
                drawer.classList.add('open');
                backdrop.classList.add('show');
            }
        }
        function close(){
            var drawer = document.getElementById('mobileDrawer');
            var backdrop = document.getElementById('mobileBackdrop');
            if(drawer){ drawer.classList.remove('open'); }
            if(backdrop){ backdrop.classList.remove('show'); }
        }
        $(document).on('click touchstart', '#mobileMenuBtn, .mh-btn', function(e){ e.preventDefault(); e.stopPropagation(); open(); });
        $(document).on('click', '#mobileBackdrop', function(){ close(); });
        document.addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });
        // Close when clicking any link inside the drawer
        $(document).on('click', '#mobileDrawer a', function(){ close(); });

        // Redundant safe bind in case delegated handler is blocked by other scripts
        function bindDirectHandlers(){
            var btn = document.getElementById('mobileMenuBtn');
            var drawer = document.getElementById('mobileDrawer');
            var backdrop = document.getElementById('mobileBackdrop');
            if(btn && drawer && backdrop && !btn.__drawerBound){
                btn.addEventListener('click', function(ev){ ev.preventDefault(); open(); });
                backdrop.addEventListener('click', close);
                btn.__drawerBound = true;
            }
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', bindDirectHandlers);
        } else {
            bindDirectHandlers();
        }
    })();
    
})(jQuery);


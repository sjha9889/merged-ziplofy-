// Shop-only interactions
(function($){
  function clamp(val, min, max){ return Math.max(min, Math.min(max, val)); }

  $(document).on('click', '.filter-toggle', function(){
    $('body').addClass('drawer-open');
  });
  $(document).on('click', '.close-drawer, .drawer-overlay', function(){
    $('body').removeClass('drawer-open');
  });

  // Sync price slider and inputs (simple)
  $(document).on('input change', '.price-min, .price-max', function(){
    var min = parseInt($('.price-min').val(),10);
    var max = parseInt($('.price-max').val(),10);
    if(min>max){ var t=min; min=max; max=t; }
    $('.min-input').val(min); $('.max-input').val(max);
  });
  $(document).on('change', '.min-input, .max-input', function(){
    var min = clamp(parseInt($('.min-input').val(),10)||0,0,1000);
    var max = clamp(parseInt($('.max-input').val(),10)||1000,0,1000);
    if(min>max){ var t=min; min=max; max=t; }
    $('.price-min').val(min); $('.price-max').val(max);
  });
})(jQuery);


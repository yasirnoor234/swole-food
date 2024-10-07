
$(document).ready(function(){
//    $('.sidebar-remove').on('click',function(e){
//      e.preventDefault();
//     var quantity=$(this).parents('.quantity').find('.add-quantity').text();
//      console.log(quantity,'ha321312321321');
//      if(quantity=='1'){
//      	location.reload();
//      }
                       
//   });
  $('.site-header__cart').on('click',function(){
    if($(this).hasClass('open')){
      $(this).removeClass('open');
      $('.popup-cart').removeClass('open');
    }else{
      $(this).addClass('open');
      $('.popup-cart').addClass('open');
    }
  });
  $('.product-page .bottom').addClass('po-left');
  $(document).on('click','.popup-cart .fa-times',function(){
    console.log(1);
      $('.site-header__cart').removeClass('open');
      $('.popup-cart').removeClass('open');
  });

  $('.cart-sidebar__price').each(function(){
    var total = parseInt($(this).text().replace('$',''));
//     if(total < 79){
//       $('.popup-cart .popup-cart__buttons').addClass('no-checkout');
//       $('.main-collection .collection__sidebar-footer').addClass('no-checkout');
//     }else{
//       $('.popup-cart .popup-cart__buttons').removeClass('no-checkout');
//       $('.main-collection .collection__sidebar-footer').removeClass('no-checkout');
//     }                     
  });
  let category_scroll = 250;
  $('.categories-bar .category a').click(function(){
  	var id = $(this).attr('href');
    $('html,body').animate({scrollTop:$(id).offset().top - category_scroll}, 100);
  });
  $('#viewSelection').on('click',function(){
    $('.collection-page .collection__sidebar').addClass('cart-sidebar');
    $('.view-selection').css('display','none');
  });
  $('.sidebar-hide').on('click',function(){
     $('.collection-page .collection__sidebar').removeClass('cart-sidebar');
    $('.view-selection').css('display','block');
  });
  $('.category-wrap').on('click',function(){
  	$('.main-collection.collection-page .category ul').stop().slideToggle(400);
  });
  window.onscroll = function() {myFunction()};
  if($('body').width() <= 640){
  	 $('.categories-bar .category a').click(function(){
          var id = $(this).attr('href');
          $('html,body').animate({scrollTop:$(id).offset().top - 200},100);
        });
  }
  if($('body').width() <= 768){
      function myFunction() {
      if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        $('.categories-bar').addClass('fixed-bar');
        category_scroll = 190;
      }else{
        category_scroll = 250;
        $('.categories-bar').removeClass('fixed-bar');
      }
    }
  }else{
  	function myFunction() {
      if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        $('.categories-bar').addClass('fixed-bar');
        category_scroll = 200;
        $('.collection_item').addClass('top-item');
      }else{
        $('.categories-bar').removeClass('fixed-bar');
        $('.collection_item').removeClass('top-item');
        category_scroll = 260;
      }
      var header_height = $('header').outerHeight();
      var header_categorybar = $('.main-collection.collection-page .category ul').outerHeight();
      var footer_height = $('footer').outerHeight();
      var top_height = header_height+header_categorybar;
      var total = header_height+header_categorybar+footer_height;
      //console.log(total,'total');
      if($(window).scrollTop() + $(window).height() > $(document).height() - top_height && $(window).width() > 768 ){
      	$('.template-list-collections .collection__sidebar').addClass('cartFooter');
        console.log(1);
        $('.collection__sidebar-inner').attr('style','height:calc(100vh - '+total+'px);');
      }else{
      	$('.template-list-collections .collection__sidebar').removeClass('cartFooter');
        console.log(2);
        $('.collection__sidebar-inner').attr('style','height:calc(100vh - '+top_height+'px);');
      }
      
    }
    
  }
  
  $('.cart__products .sidebar-item .quantity a').on('click',function(){
    setTimeout(function(){ 
      
      var total = parseInt($('.cart-sidebar__price').text().replace('$',''));
      if(total < 79){
        $('.popup-cart .popup-cart__buttons').addClass('no-checkout');
      }else{
        $('.popup-cart .popup-cart__buttons').removeClass('no-checkout');
      }
    }, 1000);
  });
   $('.main-collection .collection__sidebar .sidebar-item .quantity a').on('click',function(){
    setTimeout(function(){ 
      
//       var total = parseInt($('.cart-sidebar__price').text().replace('$',''));
//       if(total < 79){
//         $('.main-collection .collection__sidebar-footer').addClass('no-checkout');
//       }else{
//         $('.main-collection .collection__sidebar-footer').removeClass('no-checkout');
//       }
    }, 1000);
  });
  
$('.popup-cart .cart__products .sidebar-item').each(function(){
    var product_id = $(this).data('product');
  	var number_qty = $(this).find('.number_qty').text();
  	
  	$('.pro_list .grid__item').each(function(){
    	var p_id = $(this).find('.cart-btn').data('product');
        if(p_id == product_id){
          	$(this).find('.bottom').addClass('hidecart');
          	$(this).find('input[name="quantity"]').val(number_qty);
        }
    });
});


  
  
   
  jQuery('.main-collection .collection_item .qtybox .qtyplus').on('click',function(){
    var dataproduct = jQuery(this).parents('form.cart-btn').attr('data-product');
    //console.log(dataproduct);
    jQuery('.popup-cart .cart__products .sidebar-item').each(function(){
      var dataproduct2 = jQuery(this).attr('data-product');
      console.log(dataproduct2);
      if(dataproduct == dataproduct2){
        jQuery(this).find('.minuss').trigger('click'); 
      }
    });
    
  });
  jQuery('.main-collection .collection_item .qtybox .qtyminus').on('click',function(){
    var dataproduct = jQuery(this).parents('form.cart-btn').attr('data-product');
    //console.log(dataproduct);
    jQuery('.popup-cart .cart__products .sidebar-item').each(function(){
      var dataproduct2 = jQuery(this).attr('data-product');
      console.log(dataproduct2,3211);
      if(dataproduct == dataproduct2){
        jQuery(this).find('.plussss').trigger('click'); 
      }
    });
    
  });
  jQuery(window).on('load',function(){
  var count = jQuery('.lastest-news .blogitem').length;
    console.log(count);
    if(count > 1){
      jQuery('.lastest-news .list').slick({
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1
      });
    }
    
    
    
  });

  
  $('.product_item .image-container--overlay').on('click',function(){
    $(this).parents('.product_item').find('.popup_product').addClass('open');
  });
  $('.main-collection .collection_item .pro_item h4').on('click',function(){
    $(this).parents('.product_item').find('.popup_product').addClass('open');
  });
  $('.product_item .popup_product .close').on('click',function(){
    $(this).parents('.product_item').find('.popup_product').removeClass('open');
  });
  
  $('.recipes-ar-listblog-category .listpost h2').html('Other Recipes You Might Like');

  
  jQuery(window).on('load',function(){
      jQuery('.notifications').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay:true
      });
  });
  
  $('.main-collection .left-sidebar h4 .icon-down').on('click',function(){
    if($(this).hasClass('open')){
      $(this).removeClass('open');
      $(this).parents('.category').removeClass('show');
    }else{
      $(this).addClass('open');
      $(this).parents('.category').addClass('show');
    }
    
  });
  $(document).on('click','.meta .product_more',function(){
    $('body').addClass('modal-open');
    $(this).parents('.product_item').find('.popup_product ').addClass('open');
  })
  
  if ($(".notification_wrap")[0]){
    $(".site-header").removeClass("mt-header");
    $(".page-container").removeClass("mt-banner");
  } else {
      $(".site-header").addClass("mt-header");
      $(".page-container").addClass("mt-banner");
  }
  
  $(document).on('click','.remove-popup-success',function(){
    $('.ajaxified-cart-feedback.success.custom-bottom-success').addClass('d-none');

  })
  $(document).on('click','.product-form__cart-submit',function(){
    $('.ajaxified-cart-feedback.success.custom-bottom-success').removeClass('d-none');
  })
});
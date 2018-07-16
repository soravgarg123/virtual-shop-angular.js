
    var animsition_pages;

      function myFunction() {
        animsition_pages = setTimeout(showPage, 00);
      }

      function showPage() {
        $("#messageShow").show();
        $("#loader").css("display", "none");
        $("#loderBG").removeClass("loderBG");
        $("body").css("overflow", "auto");
        $(".animsition").addClass("active");
      }
 


    $(".tmnl_slider").slick({
          dots: true,
          infinite: true,
          // centerMode: true,
          slidesToShow: 5,
          slidesToScroll: 5,
          autoplay: false,
          arrows: true,
       
        });



      // header



$(document).ready(function() {
$(function () {
  $('[data-toggle="tooltip"]').tooltip();
})
$('.like_btn').click(function(e){


    e.preventDefault();

    $(this).find('i').toggleClass('fa-heart fa-heart-o');
    $(this).toggleClass('liked');

});


$('body').on('mouseenter mouseleave', '.dropdown', function (e) {
    var dropdown = $(e.target).closest('.dropdown');
    var menu = $('.dropdown-menu', dropdown);
    dropdown.addClass('show');
    menu.addClass('show');
    setTimeout(function () {
        dropdown[dropdown.is(':hover') ? 'addClass' : 'removeClass']('show');
        menu[dropdown.is(':hover') ? 'addClass' : 'removeClass']('show');
    }, 300);
});



  $(document).ready(function () {
   var changText = $('#lessBtn').text();
   var toggleDiv = $('.banner_row1 .addr li ul');
     $('#lessBtn').click(function () {
       toggleDiv.slideToggle();

        if($(this).text() == 'Show less'){
           $(this).text('Show more');
       } else {
           $(this).text('Show less');
       }

     })
  })


  $(document).ready(function () {
    $('#time_list_btn').click(function () {
      $(this).toggleClass('active');
      $('#time_list').slideToggle();
    })
  })

  // modal start
$('#createdNewList').on('click', function (e) {
 $('#addList').modal('hide');
 $('#addListViwe').modal('show');
})

  // modal end

  //back-top"
  $("#back-top").hide();
  
  // fade in #back-top
  $(function () {
    $(window).scroll(function () {
      if ($(this).scrollTop() > 100) {
        $('#back-top').fadeIn();
      } else {
        $('#back-top').fadeOut();
      }
    });

    // scroll body to 0px on click
    $('#back-top a').click(function () {
      $('body,html').animate({
        scrollTop: 0
      }, 800);
      return false;
    });


        // scroll body to 0px on click

        // $('.follow .nav.nav-pills li a[href="#menu2"]').click(function () {
        //   $('.report').css("display","inline-block");
        // });
  
});







// exams

    $('#areYouSubmit').click('shown.bs.modal', function() { 
          $('body').css('padding-right','0');
          $('#testModal').hide();
          $('.modal-backdrop').hide();
        $('#successful').modal('show');

    });


      function setModalMaxHeight(element) {
        this.$element     = $(element);  
        this.$content     = this.$element.find('.modal-content');
        var borderWidth   = this.$content.outerHeight() - this.$content.innerHeight();
        var dialogMargin  = $(window).width() < 768 ? 20 : 60;
        var contentHeight = $(window).height() - (dialogMargin + borderWidth);
        var headerHeight  = this.$element.find('.modal-header').outerHeight() || 0;
        var footerHeight  = this.$element.find('.modal-footer').outerHeight() || 0;
        var maxHeight     = contentHeight - (headerHeight + footerHeight);

        this.$content.css({
            'overflow': 'hidden'
        });
        
        this.$element
          .find('.modal-body').css({
            'max-height': maxHeight,
            'overflow-y': 'auto',
        });
      }

      $('.modal').on('show.bs.modal', function() {
        $(this).show();
        setModalMaxHeight(this);
      });

      $(window).resize(function() {
        if ($('.modal.in').length != 0) {
          setModalMaxHeight($('.modal.in'));
        }
      });




});


 
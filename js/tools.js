$(document).ready(function() {

    $('body').on('click', '.tabs-menu ul li a', function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            var curTabs = curLi.parents().filter('.tabs');
            var curIndex = curTabs.find('.tabs-menu ul li').index(curLi);
            curTabs.find('.tabs-menu ul li.active').removeClass('active');
            curLi.addClass('active');
            curTabs.find('.tabs-item.active').removeClass('active');
            curTabs.find('.tabs-item').eq(curIndex).addClass('active');
        }
        e.preventDefault();
    });

    $.validator.addMethod('maskPhone',
        function(value, element) {
            if (value == '') {
                return true;
            }
            return /^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/.test(value);
        },
        'Не соответствует формату'
    );

    $('form').each(function() {
        initForm($(this));
    });

    $('.slider-list').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        prevArrow: '<button type="button" class="slick-prev"></button>',
        nextArrow: '<button type="button" class="slick-next"></button>',
        dots: true
    });

    $('body').on('click', '.attest-item a', function(e) {
        var curItem = $($(this).attr('href'));
        if (curItem.length > 0) {
            $.scrollTo(curItem, {offset: {top: -($('.attest-wrap').height() + 40)}, duration: 500});
        }
        e.preventDefault();
    });

    $('.sert a').fancybox({
        buttons : [
            'close'
        ],
        lang : 'ru',
        i18n : {
            'ru' : {
                CLOSE   : 'Закрыть',
                NEXT    : 'Вперед',
                PREV    : 'Назад'
            }
        }
    });

    var myChart = null;
    $('.results-tabs-filter select option:selected').each(function() {
        var curValue = $(this).val();
        var curItem = null;
        for (var i = 0; i < myCharts.length; i++) {
            if (myCharts[i].id == curValue) {
                curItem = myCharts[i];
            }
        }
        if (curItem != null) {
            var ctx = $('#canvas');
            myChart = new Chart(ctx, curItem.chart);
        }
    });

    $('.results-tabs-filter select').on('change', function() {
        var curValue = $(this).val();
        var curItem = null;
        for (var i = 0; i < myCharts.length; i++) {
            if (myCharts[i].id == curValue) {
                curItem = myCharts[i];
            }
        }
        if (curItem != null) {
            myChart.destroy();
            var ctx = $('#canvas');
            myChart = new Chart(ctx, curItem.chart);
        }
    });

    $('body').on('click', '.results-file-upload-link', function(e) {
        var curTR = $(this).parents().filter('tr').next();
        curTR.toggle();
        e.preventDefault();
    });

    $('body').on('click', 'tbody tr[data-link]', function() {
        window.location.href = $(this).data('link');
    });

    $('.calendar-month-weeks').each(function() {
        var curWeeks = $(this);
        if (curWeeks.find('.calendar-month-week').length < 5) {
            curWeeks.addClass('calendar-month-weeks-little');
        }
        if (curWeeks.find('.calendar-month-week').length > 5) {
            curWeeks.addClass('calendar-month-weeks-big');
        }
    });

});

function initForm(curForm) {
    curForm.find('input.maskPhone').mask('+7 (999) 999-99-99');

    curForm.find('.form-input input, .form-input textarea').each(function() {
        if ($(this).val() != '') {
            $(this).parent().addClass('focus');
        }
    });

    curForm.find('.form-input input, .form-input textarea').focus(function() {
        $(this).parent().addClass('focus');
    });

    curForm.find('.form-input input, .form-input textarea').blur(function() {
        if ($(this).val() == '') {
            $(this).parent().removeClass('focus');
        }
    });

    curForm.find('.form-select select').chosen({disable_search: true, no_results_text: 'Нет результатов'});
    curForm.find('.form-select select').each(function() {
        var curSelect = $(this);
        if (curSelect.data('placeholder') != '') {
            curSelect.parent().find('.chosen-single').prepend('<strong>' + curSelect.data('placeholder') + '</strong>');
        }
    });


    curForm.find('.form-file input').change(function() {
        var curInput = $(this);
        var curField = curInput.parent().parent().parent().parent();
        curField.find('.form-file-name').html(curInput.val().replace(/.*(\/|\\)/, ''));
        curField.find('label.error').remove();
        curField.removeClass('error');
    });

    var dateFormat = 'dd.mm.yy';
    curForm.find('.form-input-date input').datepicker({
        dateFormat: dateFormat
    });
    window.setInterval(function() {
        $('.form-input-date input').each(function() {
            if ($(this).val() != '') {
                $(this).parent().addClass('focus');
            }
        });
    }, 100);

    curForm.find('.form-reset a').click(function(e) {
        curForm.trigger('reset');

        curForm.find('.form-input input, .form-input textarea').each(function() {
            $(this).parent().removeClass('focus');
        });

        curForm.find('label.error').remove();
        curForm.find('.error').removeClass('error');
        curForm.find('.valid').removeClass('valid');

        window.setTimeout(function() {
            curForm.find('.form-select select').chosen('destroy');
            curForm.find('.form-select select').chosen({disable_search: true, hide_results_on_select: false, placeholder_text_multiple: ' ', no_results_text: 'Нет результатов'});
        }, 100);

        e.preventDefault();
    });

    curForm.validate({
        ignore: '',
        invalidHandler: function(form, validatorcalc) {
            validatorcalc.showErrors();
            checkErrors();
        }
    });
}

function checkErrors() {
    $('.form-checkbox, .form-file, .form-input').each(function() {
        var curField = $(this);
        if (curField.find('input.error').length > 0) {
            curField.addClass('error');
        } else {
            curField.removeClass('error');
        }
        if (curField.find('input.valid').length > 0) {
            curField.addClass('valid');
        } else {
            curField.removeClass('valid');
        }
    });

    $('.form-select').each(function() {
        var curField = $(this).parent().parent();
        if (curField.find('select.error').length > 0) {
            curField.addClass('error');
        } else {
            curField.removeClass('error');
        }
        if (curField.find('select.valid').length > 0) {
            curField.addClass('valid');
        } else {
            curField.removeClass('valid');
        }
    });
}

$(window).on('load resize scroll', function() {
    var curScroll = $(window).scrollTop();
    if ($('.attest-wrap').length > 0) {
        if (curScroll >= $('.attest-wrap').offset().top) {
            $('.attest-wrap').css({'height': $('.attest-wrap-fixed').height()});
            $('.attest-wrap').addClass('fixed');
        } else {
            $('.attest-wrap').removeClass('fixed');
        }
    }
});

$(window).on('load resize', function() {
    $('.attest-list').each(function() {
        var curList = $(this);

        curList.find('.attest-item a').css({'min-height': '0px'});

        curList.find('.attest-item a').each(function() {
            var curBlock = $(this);
            var curHeight = curBlock.height();
            var curTop = curBlock.offset().top;

            curList.find('.attest-item a').each(function() {
                var otherBlock = $(this);
                if (otherBlock.offset().top == curTop) {
                    var newHeight = otherBlock.height();
                    if (newHeight > curHeight) {
                        curBlock.css({'min-height': newHeight + 'px'});
                    } else {
                        otherBlock.css({'min-height': curHeight + 'px'});
                    }
                }
            });
        });
    });
});
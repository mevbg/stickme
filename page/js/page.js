//
// Page scripts
// --------------------------------------------------


//== DOM Ready
// -------------------------

jQuery(document).ready(function() {
    
    $.ajax({
        url: '../README.md',
        context: document.body,
        success: function(mdText) {
            var converter = new showdown.Converter();
            var htmlText = $('<div class="markdown" />').append(converter.makeHtml(mdText));

            // Define DOM elements
            var dom = $.extend({}, {
                title: htmlText.find('h1'),
                slogan: htmlText.find('h1').next('p'),
                description: (function() {
                    var descriptionTitle = htmlText.find('#description'),
                        descriptionText  = htmlText.find('#description').next('p'),
                        description = $('<div class="description" />')
                            .append(descriptionTitle)
                            .append(descriptionText);

                    return description;
                }()),
                license: (function() {
                    var license = htmlText.find('#license').next('p');
                    license.find('a').attr('target', '_blank');
                    htmlText.find('#license').remove();
                    return license;
                }()),
                content: htmlText
            });

            // Remove #demo
            htmlText.find('#demo').next('p').remove();
            htmlText.find('#demo').remove();

            // Reorder DOM structure
            dom.slogan.addClass('description').appendTo('.page-header .wrp-main');
            dom.title.prependTo('.page-header .ttl');
            dom.license.addClass('license').appendTo('.page-footer .wrp-main');
            dom.description.appendTo('.col-description');
            dom.content.appendTo('.page-section article .col-docs');

            Prism.highlightAll();
        }
    });
    
});
//
// Demo scripts
// --------------------------------------------------


//== DOM Ready
// -------------------------

jQuery(document).ready(function() {

    var basicSticker;

    function returnMethod() {
        $('#method-note').stickme().destroy();
        $('#btn-method-init')
            .removeClass('unstick')
            .val('Assign StickMe and scroll to check the result');
    }

    function returnBasic() {
        basicSticker.destroy();
        $('.basic-destroy').slideUp();
        $('.basic-init').slideDown();
    }

    $('#btn-basic-init').click(function() {
        if ($('#btn-method-init').is('.unstick')) {
            returnMethod();
        }

        basicSticker = $.stickme();
        $('.basic-init').slideUp();
        $('.basic-destroy').slideDown();
    });

    $('#btn-basic-destroy').click(returnBasic);

    $('#btn-method-init').click(function() {
        if ($(this).val() === 'Assign StickMe and scroll to check the result') {

            if ($('.basic-destroy').is(':visible')) {
                $('.stickme').stickme().destroy();
                $('.basic-destroy').slideUp();
                $('.basic-init').slideDown();
            }

            $('#method-note').stickme({
                top: 10
            }).bind('onStick', function() {
                $(this).addClass('orange').text('I am a fixed note.');
            }).bind('onUnstick', function() {
                $(this).removeClass('orange').text('I am a static note.');
            });
            $(this)
                .addClass('unstick')
                .val('Destroy StickMe and scroll to check the result');
        }
        else {
            returnMethod();
        }
    });
    
});
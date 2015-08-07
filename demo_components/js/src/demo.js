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
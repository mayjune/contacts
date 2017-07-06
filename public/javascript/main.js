/**
 * Created by luffy.kim on 04/07/2017.
 */
$(document)
    .ready(function() {
        $('.ui.dropdown')
            .dropdown({
                on: 'click'
            })
        ;
    })
;

$('input:text, .ui.button', '.ui.action.input')
    .on('click', function(e) {
        $('input:file', $(e.target).parents()).click();
    })
;

$('input:file', '.ui.action.input')
    .on('change', function(e) {
        var name = e.target.files[0].name;
        $('input:text', $(e.target).parent()).val(name);
    })
;

/*$('.ui.radio.checkbox')
    .checkbox()
;*/

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
        $('.ui.accordion')
            .accordion()
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

$('.ui.toggle.checkbox')
    .checkbox()
    .first().checkbox({
    onChecked: function() {        $("label[for='"+$(this).attr("id")+"']").removeClass('dn').addClass('up').attr('data-content','ON');
    },
    onUnchecked: function() {
        $("label[for='"+$(this).attr("id")+"']").removeClass('up').addClass('dn').attr('data-content','OFF');
    }
});
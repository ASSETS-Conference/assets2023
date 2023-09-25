function set_sticky(query, sticky_class, offset = 0) {
    let elements = $(`${query}:not(.${sticky_class})`);
    let scroll = $(window).scrollTop();
    let el_height = $(elements[0]).outerHeight();

    let locations = elements.map(function () {
        return $(this).offset().top;
    });

    var sticky_index = null;

    for (let index = locations.length - 1; index >= 0; index--) {
        if (scroll >= locations[index] - offset) {
            sticky_index = index;     
            break;
        }
    };

    $(`.${sticky_class}`).remove();

    if (sticky_index != null) {

        let el = $(elements[sticky_index]);

        let sticky = el.clone().addClass(sticky_class);
        el.parent().prepend(sticky);
        
        
        let left_offset = $(`${query}:not(.${sticky_class})`).offset().left;
        sticky.css("paddingLeft", left_offset);

        sticky.css("top", offset);
        if (sticky_index != locations.length - 1) {
            let next_index = sticky_index + 1;
            let next_el = $(elements[next_index])
            let next_location = locations[next_index];
            
            var add_offset = 0;

            console.log(sticky.parent().parent(), next_el.parent().parent())

            if (sticky.parent().parent().get(0) != next_el.parent().parent().get(0)) {
                console.log("not the same grandpa");
                var add_offset = offset;
            }

            if (scroll + add_offset + offset + el_height > next_location) {
                sticky.css("top", -(el_height + add_offset + scroll - next_location));
            } 
        }
    }

    return el_height;
}

$(window).scroll(function () {
    date_offset = set_sticky(".program-date", "sticky-date");
    set_sticky(".session h3", "sticky-heading", date_offset);
});


function set_sticky(query, sticky_class, offset = 0) {
    let elements = $(`${query}:not(.${sticky_class})`);
    let scroll = $(window).scrollTop();
    let el_height = $(elements[0]).outerHeight();

    let locations = getStartingLocations(elements);

    let sticky_index = findCurrent(locations, scroll, offset);

    let sticky = toggleSticky(elements, sticky_index, sticky_class);
    if (sticky != null) {
        setOffsets(elements, locations, sticky, sticky_index, scroll, offset);
    }
    
    return sticky.outerHeight();
}

function getStartingLocations(elements) {
    return elements.map(function () {
        return $(this).offset().top;
    });
}

function findCurrent(locations, curr, offset) {
    for (let index = locations.length - 1; index >= 0; index--) {
        if (curr >= locations[index] - offset) {
            return index;
        }
    };

    return null;
}

function toggleSticky(elements, sticky_index, sticky_class) {
    let sticky = $(`.${sticky_class}`);

    if (sticky_index != null) {
        let el = $(elements[sticky_index]);
        let new_sticky_id = `${sticky_class}-${sticky_index}`;

        if (sticky != null) {
            var curr_sticky_id = $(sticky).attr("id");
        }

        if (curr_sticky_id != new_sticky_id) {
            sticky.remove();

            sticky = el.clone();
            sticky.addClass(sticky_class);
            sticky.attr("id", new_sticky_id);
            el.parent().prepend(sticky);
        }
    } else {
        sticky.remove();
    }
    
    return sticky;
}

function setOffsets(elements, locations, sticky, sticky_index, scroll, x_offset) {
    let left_offset = elements.offset().left;
    let sticky_height = sticky.outerHeight();
    sticky.css("paddingLeft", left_offset);

    sticky.css("top", x_offset);
    if (sticky_index != locations.length - 1) {
        let next_index = sticky_index + 1;
        let next_el = $(elements[next_index])
        let next_location = locations[next_index];

        var add_x_offset = 0;

        if (sticky.parent().parent().get(0) != next_el.parent().parent().get(0)) {
            var add_x_offset = x_offset;
        }

        if (scroll + add_x_offset + x_offset + sticky_height > next_location) {
            x_offset = Math.floor(-(sticky_height + add_x_offset + scroll - next_location));
            sticky.css("top", x_offset);
        }
    }
}

$(window).scroll(function () {
    date_offset = set_sticky(".program-date", "sticky-date");
    set_sticky("h3", "sticky-heading", date_offset);
});


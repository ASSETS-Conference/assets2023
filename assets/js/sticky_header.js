function set_sticky(scroll, query, sticky_class, offset = 0) {
    let elements = $(`${query}:not(.${sticky_class})`);
    // let el_height = $(elements[0]).outerHeight();

    let locations = getStartingLocations(elements);

    let sticky_index = findCurrent(locations, scroll, offset);

    let sticky = toggleSticky(elements, sticky_index, sticky_class);
    if (sticky != null) {
        setOffsets(elements, locations, sticky_class, sticky_index, scroll, offset);
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
        let new_sticky = $(elements[sticky_index]);
        if (sticky != new_sticky) { 
            sticky.remove();

            sticky = new_sticky.clone();
            sticky.addClass(sticky_class);
            // sticky.attr("id", new_sticky_id);
            new_sticky.parent().prepend(sticky);
            // console.log(el.parent());
        };
        // let new_sticky_id = `${sticky_class}-${sticky_index}`;

        // if (sticky != null) {
        //     var curr_sticky_id = $(sticky).attr("id");
        // }

        // if (curr_sticky_id != new_sticky_id) {
            
        // }
    } else {
        sticky.remove();
    }
    
    return sticky;
}

function setOffsets(elements, locations, sticky_class, sticky_index, scroll, x_offset) {
    let left_offset = elements.offset().left;
    var sticky = $(`.${sticky_class}`);
    sticky.css("paddingLeft", left_offset);
    sticky.css("paddingRight", left_offset);
    let sticky_height = sticky.outerHeight();

    sticky.css("top", x_offset);
    if (sticky_index != locations.length - 1) {
        let next_index = sticky_index + 1;
        let next_el = $(elements[next_index])
        let next_location = locations[next_index];

        var add_x_offset = 0;

        if (sticky.parent().parent().get(0) != next_el.parent().parent().get(0)) {
            var add_x_offset = x_offset * 2;
        }

        if (scroll + add_x_offset + x_offset + sticky_height >= next_location) {
            x_offset = Math.floor(-(sticky_height + add_x_offset + scroll - next_location));
            sticky.css("top", x_offset);
        }
    }
}


// from https://stackoverflow.com/questions/20791374/jquery-check-if-element-is-visible-in-viewport
$.fn.isInViewport = function () {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();

    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
};

function setBackToTop(scroll) {
    var stickyBackToTop = $(".sticky-back-to-top");
    if (scroll > $('.program-overview').offset().top + $('.program-overview').height()) {
        let backToTop = $(".program-back-to-top-wrapper");
        stickyBackToTop.css("opacity", "1");
    } else {
        stickyBackToTop.css("opacity", "0");
    }

    let footer = $("#footer");
    if (footer.isInViewport()) {
        let offset = scroll + $(window).height() - footer.offset().top;
        stickyBackToTop.css("bottom", `${offset}px`);
    } else {
        stickyBackToTop.css("bottom", "0");
    }
}

function adjustHeaders() {
    let scroll = $(window).scrollTop();
    date_offset = set_sticky(scroll, ".program-date", "sticky-date");
    set_sticky(scroll, ".detailed-program h3", "sticky-heading", date_offset);
}

function addScroll(e) {
    // let offset = $(".detailed-program h3").
    e.preventDefault();
    target_el = $($(this).attr("href"));
    let offset = target_el.siblings(".program-date").outerHeight();
    console.log(offset);
    target_location = target_el.children(":first").offset().top;
    $(window).scrollTop(target_location - offset);
}

$(document).ready(function () {
    $(window).on("scroll", adjustHeaders);
    $(window).on("resize", adjustHeaders);
    $(".program-overview a").on("click", addScroll);
});
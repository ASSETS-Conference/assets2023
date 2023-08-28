$( document ).ready(function() {

    let jumbotron_height = 277

    /* SIDEBAR */
    function place_sidebar(offset=275) {
        var target = $(".col-lg-8").first().offset().left - offset;
        if (target < 0) {
            $(".toc-div").css({
                "display": "none"
            });
        }
        else {
            $(".toc-div").css({
                "display": "block"
            });
        }
        $(".toc-div").css({
            "left": target + "px",
            "top": jumbotron_height + "px"
        });
    }

    $(function () {
        place_sidebar();

        $(window).scroll(function () {
            if ($(window).scrollTop() > jumbotron_height) {
                $(".toc-div").css({
                    "position": "fixed",
                    "top": "0px"
                });
            } else {
                $(".toc-div").css({
                    "position": "absolute",
                    "top": jumbotron_height + "px"
                });
            }
        });
        $(window).on('resize', function () {
            place_sidebar();
        });
    });

});

var $ = window.jQuery || require('jquery');

var slider = function(Vue, options)
{
  Vue.transition('slider', {
        css: false,
        enter: function (el, done) {
          const $el = $(el),
                $children = $el.children(),
                speed = $el.data('speed') ? parseInt($el.data('speed')) : 500

          let height = 0

          $children.each(function() {
            height += $(this).outerHeight(true)
          })

          $(el)
            .css({'height': 0, 'opacity': 1, 'overflow': 'hidden'})
            .animate({
              'height': height,
              'opacity': 1
          }, speed, () => {
              $(el).css({'height': 'auto'})
              done()
          })
        },
        enterCancelled: function (el) {
          $(el).stop()
        },
        leave: function (el, done) {
          const $el = $(el),
                speed = $el.data('speed') ? parseInt($el.data('speed')) / 2 : 650
          $(el).animate({ height: 0,'opacity': 0, 'overflow': 'hidden' }, speed, done)
        },
        leaveCancelled: function (el) {
          $(el).stop()
        }
      });

}


module.exports = {
    install: function (Vue, options) {
      slider(Vue, options);
    }
}

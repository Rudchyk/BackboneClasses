// function hasClass(elem, className) {
//   return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
// }

var paths = {
      source: '',
      html5Js: 'http://html5shiv.googlecode.com/svn/trunk/html5.js',
      jqueryJS: 'https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js'
    };

if (head.browser.ie && head.browser.version < 8) {
  location.replace(paths.source + 'ie-old/index.html');
}

if (head.browser.ie && head.browser.version < 9) {
  head.js(paths.html5Js);
}

head.js(
  paths.jqueryJS,
  paths.source + 'js/full/parse.js',
  function() {

    var $content = $('.section-content-js'),
        $cod = $('.section-cod-js'),
        $area = $('.area-js'),
        $btnPanel = $('.btn-panel'),
        $btnParse = 'btn-parse-js',
        $btnClear = 'btn-clear-js',
        disabledClass = 'disabled';

    $btnPanel
      .on('click', '.' + $btnParse, function() {
        var $this = $(this),
            $value = $area.val();

        if ($value != '') {

          if (!$this.hasClass(disabledClass)) {
            $this
              .addClass(disabledClass);

            $btnPanel
              .append('<span class="btn btn-fake ' + $btnClear + '">Clear</span>');

            $cod
              .html($value);

            var $info = $cod.find('*');

            parseHTML($info, $content);
          }

        } else {
          alert('area is empty!');
        }
      });

    $area
      .on('change', function() {
        var $this = $(this),
            $thisVal = $this.val();

        if ($thisVal == '') {
          $('.' + $btnParse)
            .removeClass(disabledClass);
          $cod
            .html('');
          $content
            .html('');
          $('.' + $btnClear)
            .remove();
        }
      });

    $('.btn-panel')
      .on('click', '.' + $btnClear, function() {
        $(this)
          .remove();
        $('.' + $btnParse)
          .removeClass(disabledClass);
        $area
          .val('');
        $cod
          .html('');
        $content
          .html('');
      });
  }
);

if (head.browser.ie && head.browser.version < 10 || head.browser.opera) {
  head.js(
    paths.source + 'js/min/ph.min.js'
  );
}

// if (hasClass(document.documentElement, 'body_class')) {
//   head.js(
//     scriptsMinPath + '',
//     function() {}
//   );
// }

$(document).ready(function() {
    var $content = $('.section-content-js'),
      $cod = $('.section-cod-js'),
      $area = $('.area-js'),
      $btnPanel = $('.btn-panel'),
      $btnParse = 'btn-parse-js',
      $btnClear = 'btn-clear-js',
      disabledClass = 'disabled';

  $('.filters-js')
    .on('change', '.stylesheet_language-radio-js', function() {
      $(this)
        .parent()
        .parent()
        .addClass('active')
        .siblings()
        .removeClass('active');
    });


  $('.section-form-js')
    .on('submit', function(event) {
      event.preventDefault();
      var $this = $(this),
          $data = $this.serializeArray(),
          $buttonSubmit = $this.find('.' + $btnParse),
          $buttonReset = $this.find('.' + $btnClear),
          $buttonRadio = $this.find('.stylesheet_language-radio-js'),
          $stylesheet_language = $data[0].value,
          $html = $data[1].value;

      if ($html) {
        $buttonSubmit
          .attr('disabled', 'disabled');
        $buttonRadio
          .attr('disabled', 'disabled');
        $buttonReset
          .show();
        $cod
          .html($html);

        var $info = $cod.find('*');

        parseHTML($info, $content, $stylesheet_language);

      } else {
        $area
          .addClass('has-error');
        alert('Area is empty!');
      }

    });

  $area
    .on('change', function() {
      var $this = $(this),
          $thisVal = $this.val();

      if ($thisVal == '') {
        $('.' + $btnParse)
          .removeAttr('disabled');
        $('.stylesheet_language-radio-js')
          .removeAttr('disabled');
        $cod
          .html('');
        $content
          .html('');
        $('.' + $btnClear)
          .hide();
      } else {
        $this
          .removeClass('has-error');
      }
    });

  $('.' + $btnClear)
    .on('click', function() {
      $(this)
        .hide();
      $('.' + $btnParse)
        .removeAttr('disabled');
      $('.stylesheet_language-radio-js')
        .removeAttr('disabled');
      $area
        .val('');
      $cod
        .html('');
      $content
        .html('');
    });
});

function parseHTML(blocs, blocShow, stylesheet_language) {

  var $element = blocs,
      $arr = [],
      target = ' ';

  $element.each(function() {

    var $this = $(this),
        $thisClass = $this.attr('class');
        
    if ($thisClass) { // Перевіряємо на наявнісь класу

      // Перевіряємо на наявнісь декількох класів у елемента
      if($thisClass.indexOf(target) + 1) { // Якщо їх декілька виконуємо дію
        var b = $thisClass.split(' '); // Створюємо з них массив по пробілу
        $arr.push.apply($arr, b); // Добавляємо в наш глобальний массив
      } else {
        $arr.push($thisClass); // Якщо один то відразу добавляємо в масив
      }
    }

  });

  var $uniqueArr = unique($arr), // Видаляємо всі дублюючі класи
      $noJsArr = nojsClass($uniqueArr),
      // $sortArr = BubbleSort($noJsArr),
      $mainArr = $noJsArr,
      $mainArrLength = $mainArr.length;

  // console.log($nnn);

  blocShow
      .append('<h2 class="title">The backbone of classes from HTML tags:</h2>');

  for (var i = 0, iLength = $mainArrLength; i < iLength; i++) {
    var styleClass = $mainArr[i],
        styleClassItem = '';

    if (stylesheet_language == 'SASS') {
      styleClassItem = '.' + styleClass + '<br>';
    } else {
      styleClassItem = '.' + styleClass + '{}<br>';
    }



    blocShow
      .append(styleClassItem);
  }

}

function unique(arr) {
  var result = [];

  nextInput:
    for (var i = 0; i < arr.length; i++) {
      var str = arr[i]; // для каждого элемента
      for (var j = 0; j < result.length; j++) { // ищем, был ли он уже?
        if (result[j] == str) continue nextInput; // если да, то следующий
      }
      result.push(str);
    }

  return result;
}


function nojsClass(arr) {
  var result = [],
      myRe = /-js/;

  for (var i = 0; i < arr.length; i++) {
    var str = arr[i];

    if (!myRe.test(str)) {
      result.push(str);
    }
  }

  return result;
}

function BubbleSort(A) {
    var n = A.length;
    for (var i = 0; i < n-1; i++) {
      for (var j = 0; j < n-1-i; j++) { 
        if (A[j+1] < A[j]) { 
          var t = A[j+1]; A[j+1] = A[j]; A[j] = t;
        }
      }
    }
    return A;
}
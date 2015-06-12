$(document).ready(function() {
  var $content = $('.section-content-js'),
      $form = $('.section-form-js'),
      $cod = $('.section-cod-js'),
      $area = $('.area-js'),
      $filters = $('.filters-js'),
      $filtersRadio = '.stylesheet_language-radio-js',
      $sort = $('.sort-checked-js'),
      $btnPanel = $('.btn-panel'),
      $btnParse = $('.btn-parse-js'),
      $btnClear = $('.btn-clear-js'),
      disabledClass = 'disabled',
      $standartclasses = $('.standartclasses-js'),
      $standartclassesValue = $standartclasses.val(),
      $formEl = $('.form-el-js');

  $filters
    .on('change', $filtersRadio, function() {
      $(this)
        .parent()
        .parent()
        .addClass('active')
        .siblings()
        .removeClass('active');
    });

  $sort
    .on('change', function() {
      var $this = $(this);
      if ($this.is(':checked')) {
        $this
          .parent()
          .parent()
          .addClass('active');
        } else {
          $this
            .parent()
            .parent()
            .removeClass('active');
        }
    });

  $standartclasses
    .after($standartclassesValue);


  $form
    .on('submit', function(event) {
      event.preventDefault();
      var $this = $(this),
          $data = $this.serializeObject(),
          $stylesheet_language = $data["stylesheet_language"],
          $alphabetic = $data["alphabetic"],
          $jsclass = $data["jsclass"],
          $standartclass = $data["standartclass"],
          $standartclasses = $data["standartclasses"],
          $fontawesomeclasses = $data["fontawesomeclasses"],
          $html = $data["area"];

      if ($html) {
        $formEl
          .attr('disabled', 'disabled')
          .parent()
          .addClass('has-disabled');
        $btnParse
          .attr('disabled', 'disabled');
        $btnClear
          .show();
        $cod
          .html($html);

        var $infoArr = parseHTML($cod),
            $uniqueArr = unique($infoArr); // Видаляємо всі дублюючі класи

        if ($alphabetic) {
          $uniqueArr = BubbleSort($uniqueArr);
        }
        if ($jsclass) {
          $uniqueArr = nojsClass($uniqueArr);
        }
        if ($standartclass) {
          $uniqueArr = standartclassFn($uniqueArr, $standartclasses);
        }
        if ($fontawesomeclasses) {
          $uniqueArr = fontawesomeclassesFn($uniqueArr);
        }

        showBackboneClasses($uniqueArr, $content, $stylesheet_language);

      } else {
        $area
          .addClass('has-error');
        alert('Area is empty!');
      }

    });

  $area
    .on('keyup', function() {
      var $this = $(this),
          $thisVal = $this.val();

      $formEl
        .removeAttr('disabled', 'disabled')
        .parent()
        .removeClass('has-disabled');
      $btnParse
        .removeAttr('disabled', 'disabled');
      $cod
        .html('');
      $content
        .html('');
      $btnClear
        .hide();
    })
    .on('focus', function() {
      $(this)
        .removeClass('has-error');
    });

  $btnClear
    .on('click', function() {
      $(this)
        .hide();
      $formEl
        .removeAttr('disabled', 'disabled')
        .parent()
        .removeClass('has-disabled');
      $btnParse
        .removeAttr('disabled', 'disabled');
      $area
        .val('');
      $cod
        .html('');
      $content
        .html('');
    });
});

function parseHTML(bloc) {

  var $element = bloc.find('*'),
      arr = [],
      myRe = /\s/g,
      myReTags = /<.*?>.*?<\/.*?/g;

  $element.each(function() {
    var $this = $(this),
        $thisClass = $this.attr('class'),
        $thisClassTag = myReTags.test($thisClass);

    if ($thisClassTag) {
      alert('Some class error: ' + $thisClass);
    }
        
    if ($thisClass && !$thisClassTag) { // Перевіряємо на наявнісь класу
      // Перевіряємо на наявнісь декількох класів у елемента
      if(myRe.test($thisClass)) { // Якщо їх декілька виконуємо дію
        var b = $thisClass.split(' '); // Створюємо з них массив по пробілу

        arr.push.apply(arr, b); // Добавляємо в наш глобальний массив
      } else {
        arr.push($thisClass); // Якщо один то відразу добавляємо в масив
      }
    }
  });
  return arr;
}

function showBackboneClasses(arr, blocShow, stylesheet_language) {

  blocShow
      .append('<h2 class="title">The backbone of classes from HTML tags:</h2>');

  for (var i = 0, iLength = arr.length; i < iLength; i++) {
    var styleClass = arr[i],
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

function standartclassFn(arr, sortArr) {

  var result = [],
      str = arr.join(' '),
      sortData = sortArr.split(', ');

  // console.log(str);
  for (var i = 0; i < sortData.length; i++) {
    var $item = sortData[i];
    str = str.replace($item, '');
  }

  var rArr = str.split(' ');

  for (var j = 0; j < rArr.length; j++) {
    var ritem = rArr[j];
    if (ritem) {
      result.push(ritem);
    }
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

function fontawesomeclassesFn(arr) {
  var result = [],
      myRe = /fa/;

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

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
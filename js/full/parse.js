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
      $formEl = $('.filter-el-js'),
      $modal = '#modal',
      errorTgs = [/(\$?\{.*?\}\}?)/gmi, /(<\/?is(?:if|else|elseif|loop).*?\/?>)/gmi, /(<\?php.*?\?>)/gmi];

      // /(<\/?is(?:if|else|elseif)\s?(?:[a-z\d\s]+?)?\/?>)/gmi

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
          $html = $data["area"],
          $htmlNoErrorTags = fixString($html, errorTgs);

      if ($html) {

        showErrors($html, errorTgs, $modal);

        $formEl
          .attr('disabled', 'disabled')
          .parent()
          .addClass('has-disabled');

        $btnParse
          .attr('disabled', 'disabled');

        $btnClear
          .show();

        $cod
          .html($htmlNoErrorTags);

        var $mainData = parseHTML($cod),
            $uniqueArr = sortByNested($mainData);

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
      $($modal)
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
      $($modal)
        .html('');
    });
});

function parseHTML(bloc) {

  var $element = bloc.find('*'),
      arr = [],
      myRe = /\s/;
      
  $element.each(function() {
    var $this = $(this),
        $thisClass = $this.attr('class'),
        $thisClassHasSpace = myRe.test($thisClass);

      // Перевіряємо на наявнісь декількох класів у елемента
      if($thisClassHasSpace) { // Якщо їх декілька виконуємо дію
        var $thisClassArr = $thisClass.split(' '); // Створюємо з них массив по пробілу

        arr.push.apply(arr, $thisClassArr); // Добавляємо в наш глобальний массив
      } else {
        arr.push($thisClass); // Якщо один то відразу добавляємо в масив
      }
  });

  arr = deleteEmptyEl(arr);

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
      arrData = arr,
      arrDataLength = arrData.length;

  for (var i = 0, iLength = arrDataLength; i < iLength; i++) {
    var arrDataItem = arrData[i],
        arrDataItemRE = new RegExp(arrDataItem + '(?=,)', 'g');

    if (!arrDataItemRE.test(sortArr)) {
      result.push(arrDataItem);
    }
  }
  return result;
}


function nojsClass(arr) {
  var result = [],
      myRe = /-js$/;

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
      myRe = /^fa/;

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

function deleteEmptyEl(A) {
    var n = A.length,
        result = [];
    for (var i = 0, istr = n; i < istr; i++) {
      var item = A[i];
      if (item) {
        result.push(item);
      }
    }
    return result;
}

function sortByNested(arr) {
  var result = [],
      tempResult = [],
      arrSort = unique(arr),
      str = arrSort.join(' '),
      myRe = /-/;

  for (var i = 0; i < arrSort.length; i++) {
    var $item = arrSort[i];

    if (str != '') {
      if (myRe.test($item)) {

        var $itemArr = $item.split('-'),
            $itemArrHead = $itemArr.shift();
            re = new RegExp('(' + $itemArrHead + ')\-?([a-z0-9+-]+)?', 'g'),
            resulrRe = str.match(re);

        if (resulrRe) {
          resulrRe = BubbleSort(resulrRe);
          result.push.apply(result, resulrRe);
        };

        str = str.replace(re, '');

      } else {
        var reItem = new RegExp('^' + $item, 'g')

        str = str.replace(reItem, '');
        result.push($item);
      }
    }
  }

  return result;
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

function fixString(arr, errorTags) {
  var str = arr,
      bug = errorTags,
      bugLength = bug.length;

  // console.log(str);

  for (var i = 0, iLength = bugLength; i < iLength; i++) {
    var item = bug[i];

    str = str.replace(item, '');
  };

  // console.log(str);

  return str;
}

function showErrors(arr, errorTags, modal) {
  var str = arr,
      bug = errorTags,
      bugVarRe = bug[0],
      bugVarArr = str.search(bugVarRe);
      bugLength = bug.length,
      bags = [],
      fixBugsArr = [];

  
  console.log(bugVarArr);

  // for (var i = 0, iLength = bugLength; i < iLength; i++) {
  //   var item = bug[i],
  //       reResult = str.match(item);

  //   bags.push.apply(bags, reResult);
  // };

  // if (bags.length != 0) {
  //   bags = unique(bags);
  //   // str = str.replace(/</g, '&lt;'),
  //   // str = str.replace(/>/g, '&gt;');

  //   console.log(str);

  //   // for (var j = 0, jLength = bags.length; j < jLength; j++) {
  //   //   var jItem = bags[j];

  //   //   jItem = jItem.replace(/</g, '&lt;');
  //   //   jItem = jItem.replace(/>/g, '&gt;');

  //   //   var reIn = '<span class="message">' + jItem + '</span>',
  //   //       reJitem = jItem.replace(/(\.|\^|\$|\*|\+|\?|\||\\|\(|\)|\[|\]|\{|\})/g, '\\$1'),
  //   //       regJitem = new RegExp(reJitem, 'gmi');

  //   //   str = str.replace(regJitem, reIn);
  //   // }

  //   $(modal)
  //     .html('<pre>' + str + '</pre>');

  //   // Initialization fancyBox
  //   $.fancybox.open({
  //     href: modal,
  //     padding: false
  //   });
  // }
}
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
      $modal = '#modal';

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
          errorTgs = [/(\$?\{.*?\}\}?)/gmi, /(<\/?is.*?\/?>)/gmi, /(<\?php.*?\?>)/gmi],
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
      arrSort = unique(arr),
      str = arrSort.join(' '),
      myRe = /-/;

  str = ' ' + str + ' ';

  for (var i = 0; i < arrSort.length; i++) {
    var $item = arrSort[i];

    if (str != '') {
      if (myRe.test($item)) {
        var $itemArr = $item.split('-'),
            $itemArrHead = $itemArr[0],
            re = new RegExp('\\s(?=((' + $itemArrHead + ')\\-?([a-z0-9+-]+)?)(?=\\s))', 'g'),
            str = str.replace(re, ' UNIK-'),
            re2 = new RegExp('(UNIK)-([a-z0-9+_+-]+)', 'g'),
            resulrRe = str.match(re2),
            resulrReFix = [];

        if (resulrRe) {
          for (var j = 0, jLength = resulrRe.length; j < jLength; j++) {
            var jItem = resulrRe[j];
            jItem = jItem.replace(/UNIK-/, '');
            resulrReFix.push(jItem);
          }

          resulrReFix = BubbleSort(resulrReFix);
          result.push.apply(result, resulrReFix);
        };

        str = str.replace(re2, ' ');
      } else {
        result.push($item);
      }
    }
  }
  result = unique(result);

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
      bugLength = bug.length,
      reScript = /<script.*?>([\s\S]*?)<\/script>/gmi;

  for (var i = 0, iLength = bugLength; i < iLength; i++) {
    var item = bug[i];

    str = str.replace(item, '');
  };

  str = str.replace(reScript, '');

  return str;
}

function showErrors(str, errorTags, modal) {
  var error = false;

  for (var err = 0, errLength = errorTags.length; err < errLength; err++) {
    var errItem = errorTags[err];

    if (errItem.test(str)) {
      error = true;
      break;
    }
  }

  if (error) {
    var bugVarRe = errorTags.shift();
        bugVarArr = str.match(bugVarRe),
        tagsArr = [],
        flagVAr = 'sh_',
        flagTag = 'tag_';

    if (bugVarArr) {
      str = reFlag(bugVarArr, str, flagVAr);
    }

    for (var j = 0, jLength = errorTags.length; j < jLength; j++) {
      var tagsItems = str.match(errorTags[j]);

      if (tagsItems) {
        tagsArr.push.apply(tagsArr, tagsItems)
      }
    }

    if (tagsArr.length) {
      str = reFlag(tagsArr, str, flagTag);
    }
    
    str = reTagShow(str);

    if (tagsArr.length) {
      str = replaceShowStr(str, tagsArr, flagTag);
    }

    if (bugVarArr) {
      str = replaceShowStr(str, bugVarArr, flagVAr);
    }

    $(modal)
      .html('<pre>' + str + '</pre>');

    $.fancybox.open({
      href: modal,
      padding: false
    });
  }
}

function fixRe(str) {
  var strFix = str;
      result = strFix.replace(/(\.|\^|\$|\*|\+|\?|\||\\|\(|\)|\[|\]|\{|\})/g, '\\$1');
  return result;
}

function reFlag(arr, str, flag) {
  for (var i = 0, iLength = arr.length; i < iLength; i++) {
    var iItem = arr[i],
        iItemFix = fixRe(iItem),
        re = new RegExp(iItemFix, 'g'),
        reText = flag + i;

    str = str.replace(re, reText);
  }

  return str;
}

function reTagShow(str) {
  str = str.replace(/</g, '&lt;'),
  str = str.replace(/>/g, '&gt;');
  return str;
}

function replaceShowStr(str, arr, flag) {
  for (var i = 0, iLength = arr.length; i < iLength; i++) {
    var iItem = arr[i],
        iItem = reTagShow(iItem),
        iItemStr = '<span class="message">' + iItem + '</span>',
        iReStr = flag + i + '\\b',
        iRe = new RegExp(iReStr, 'g');

    str = str.replace(iRe, iItemStr);
  };
  return str;
}
function parseHTML(blocs, blocShow) {

  var $element = blocs,
      $arr = [];

  $element.each(function() {

    var $this = $(this),
        $thisClass = $this.attr('class'),
        target = ' ';

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
      $uniqueArrLength = $uniqueArr.length;
  

  blocShow
      .append('<h2 class="title">The backbone of classes from HTML tags:</h2>');

  for (var i = 0, iLength = $uniqueArrLength; i < iLength; i++) {
    blocShow
      .append('.' + $uniqueArr[i] + '{}<br>');
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
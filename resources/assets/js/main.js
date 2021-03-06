$(function () {
  var timeReserv;
  var calendar;
  var medObect = {};
  var med_object = '';
  var dayWeek = new Date().getDay();

  $.get("/branch", function (data, status) {
    var obj = $.parseJSON(data);
    select = document.getElementById('med_object');
    for (var i = 0; i < obj.length; i++) {
      var opt = document.createElement('option');
      if (obj[i].code.length > 0) {
        opt.value = obj[i].id;
        opt.innerHTML = obj[i].description.name;
        select.appendChild(opt);
      }
    }
  });

  $.get("/specialties", function (data, status) {
    var obj = $.parseJSON(data);
    console.log(obj);
    select = document.getElementById('speciality');
    jQuery.each(obj, function (k, val) {
      var opt = document.createElement('option');
      opt.value = val.id;
      opt.innerHTML = val.name;
      select.appendChild(opt);
    });

    calendar = $('#calendar').fullCalendar({
      header: {
        left: 'prev,next',
        center: 'title',
        right: 'basicWeek'
      },
      columnHeader: true,
      columnHeaderFormat: 'D ddd',
      defaultView: 'basicWeek',
      firstDay: dayWeek,
      // contentHeight: 400,
      // navLinks: true, // can click day/week names to navigate views
      // editable: true,
      locale: 'ru',
      viewRender: function (view, element) {
        speciality = document.getElementById('speciality').value;
        branch = document.getElementById('med_object').value;

        if (speciality.length > 0 && branch.length > 0) {
          getDataTime(speciality, view.intervalStart._d, view.intervalEnd._d, branch);
        }
      },
      eventClick: function (calEvent, jsEvent, view) {
        worker = $('#worker option:selected').val();
        med_object = $('#med_object option:selected').val();
        // console.log("----------");
        console.log(calEvent);
        console.log(jsEvent);
        console.log(view);
        if (med_object.length != 0) {
          $('.step1').hide();
          $('.step2 .address').text($('#med_object option:selected').text());
          $('.step2 .spec').text($('#speciality option:selected').text());
          $('.step2 .date-time').text(calEvent.start._i);
          $('.step2').show();
          medObect.timetableId = calEvent.id;
          medObect.timestart = calEvent.start._i;
          timeReserv = calEvent.start._i;
          $('input[name=timetableId]').val(calEvent.id);
        } else {
          alert("Необходимо выбрать медицинский центр!");
        }
      },
    });

    $("#speciality").change(function () {
      let speciality = document.getElementById('speciality').value;
      let branch = document.getElementById('med_object').value;

      medObect.branch = document.getElementById("med_object").options[document.getElementById('med_object').selectedIndex].text;
      medObect.speciality = document.getElementById("speciality").options[document.getElementById('speciality').selectedIndex].text;
      if (branch.length > 0) {
        let dateStart = new Date();
        let dateEnd = (new Date()).addDays(6);

        getDataTime(speciality, dateStart, dateEnd, branch, 0);
      } else {
        alert('Необходимо выбрать специальность врача');
      }
    });

    $("#worker").change(function () {
      let branch = document.getElementById('med_object').value;
      let worker = document.getElementById('worker').value;
      let speciality = document.getElementById('speciality').value;
      medObect.worker = document.getElementById("worker").options[document.getElementById('worker').selectedIndex].text;
      let moment = calendar.fullCalendar('getDate');
      let dateStart = moment._d;
      let dateEnd = (new Date(dateStart)).addDays(6);
      $.get("/datatm?speciality=" + speciality + "&worker=" + worker + "&start=" + dateStart.toMysqlString() + "&end=" + dateEnd.toMysqlString() + "&branches=" + branch, function (data, status) {
        let obj = $.parseJSON(data);
        calendar.fullCalendar('removeEvents');
        calendar.fullCalendar('addEventSource', obj);
        console.log(obj);
      });
    });
  });

  Date.prototype.toMysqlString = function () {
    let date = new Date(this.valueOf());
    return date.toISOString().slice(0, 10);
  }

  Date.prototype.addDays = function (days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  }

  function getDataTime(speciality, start, end, branch) {
    $.get("datatm?speciality=" + speciality + "&start=" + start.toMysqlString() + "&end=" + end.toMysqlString() + '&branches=' + branch, function (data, status) {
      obj = $.parseJSON(data);

      var obj = $.parseJSON(data);
      calendar.fullCalendar('removeEvents');
      calendar.fullCalendar('addEventSource', obj);

      var select = document.getElementById('worker');
      $('#worker').empty();
      opt = document.createElement('option');
      opt.innerHTML = "-- Выберите из списка  --";
      select.appendChild(opt);

      $.get("worker?speciality=" + speciality + '&branches=' + branch, function (data, status) {
        obj = $.parseJSON(data);
        document.getElementById('worker').style.display = 'block';

        for (var i = 0; i < obj.length; i++) {
          opt = document.createElement('option');
          opt.value = obj[i].id;
          opt.innerHTML = obj[i].surname + " " + obj[i].name + " " + obj[i].patronymic;
          select.appendChild(opt);
        }
      });
    });
  }

  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  $('#send_form').bind('click', function (e) {
    console.log(medObect);
    var surname = $('#surname').val();
    var name = $('#name').val();
    var patronymic = $('#patronymic').val();
    var email = $('#email').val();
    var phone = $('#phone').val();
    var token = $('#token').val();
    var timetableId = $('#timetableId').val();
    var years = document.getElementById('datepicker').value;

    medObect.phone = phone.id;

    $chek = true;
    if (surname.length == 0) {
      $('#surname').css({'border': '1px solid red'});
      $chek = false;
    } else {
      $('#surname').css({'border': '1px solid #ccd0d2'});
    }

    if (name.length == 0) {
      $('#name').css({'border': '1px solid red'});
      $chek = false;
    } else {
      $('#name').css({'border': '1px solid #ccd0d2'});
    }

    if (patronymic.length == 0) {
      $('#patronymic').css({'border': '1px solid red'});
      $chek = false;
    } else {
      $('#patronymic').css({'border': '1px solid #ccd0d2'});
    }

    if (!validateEmail(email)) {
      $('#email').css({'border': '1px solid red'});
      $chek = false;
    } else {
      $('#email').css({'border': '1px solid #ccd0d2'});
    }

    if (phone.length == 0) {
      $('#phone').css({'border': '1px solid red'});
      $chek = false;
    } else {
      $('#phone').css({'border': '1px solid #ccd0d2'});
    }
    medObect.phone = phone;
    /*
    $.ajaxSetup({
      header:$('meta[name="_token"]').attr('content')
    })
    */
    $.ajaxSetup({
      headers: {
        'X-XSRF-Token': $('meta[name="_token"]').attr('content')
      }
    });

    if ($chek) {
      $.ajax({
        type: "POST",
        url: '/client',
        dataType: 'json',
        success: function (data) {
          $('.step2').hide();
          $('.step3').show();
          $('#order').text(data);
          urlTalon = "/pdf?email=" + email + "&order=" + data + "&spec=" + $('#speciality option:selected').text() + "&filial=" + $('#med_object option:selected').text() + "&time=" + timeReserv;
          urlDownload = "/pdfdownload?order=" + data + "&spec=" + $('#speciality option:selected').text() + "&filial=" + $('#med_object option:selected').text() + "&time=" + timeReserv;
          $('.step3 .succes').html("<embed src='" + urlTalon + "' width='300' height='300' type='application/pdf'><p style='text-align: center;'><a href='" + urlDownload + "'>Скачать талон</a><br><a href='/cancel'>Cancel Order </a></p>");

        },
        error: function (data) {
        }
      })
    } else {
      alert('Проверьте форму');
    }
    return false;
  });

});
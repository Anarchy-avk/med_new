/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ }),
/* 4 */
/***/ (function(module, exports) {

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
            data: "surname=" + surname + '&name=' + name + '&patronymic=' + patronymic + '&email=' + email + '&phone=' + phone + '&_token=' + token + '&timetableId=' + timetableId + '&years=' + years + "&spec=" + $('#speciality option:selected').text() + "&filial=" + $('#med_object option:selected').text() + "&time=" + timeReserv,
            dataType: 'json',
            success: function (data) {
              $('.step2').hide();
              $('.step3').show();
              $('#order').text(data);
              urlTalon = "/pdf?order=" + data + "&spec=" + $('#speciality option:selected').text() + "&filial=" + $('#med_object option:selected').text() + "&time=" + timeReserv;
              urlDownload = "/pdfdownload?order=" + data + "&spec=" + $('#speciality option:selected').text() + "&filial=" + $('#med_object option:selected').text() + "&time=" + timeReserv;
              $('.step3 .success').html("<embed src='" + urlTalon + "' width='300' height='300' type='application/pdf'><p style='text-align: center;'><a href='" + urlDownload + "'>Скачать талон</a><br><a href='/cancel'>Отменить заказ</a></p>");

            },
            error: function (data) {
            }
          })
        } else {
          alert('Проверьте форму');
        }
        return false;
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

    });

/***/ })
/******/ ]);
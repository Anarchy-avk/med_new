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
      let timeReserve;
      let calendar;
      let medObject = {};
      let med_object = '';
      let dayWeek = new Date().getDay();
      $("#med_object").LoadingOverlay("show");
      $.get("/branch", function (data, status) {
        let obj = $.parseJSON(data);
        let select = document.getElementById('med_object');
        for (let i = 0; i < obj.length; i++) {
          let opt = document.createElement('option');
          if (obj[i].code.length > 0) {
            opt.value = obj[i].id;
            opt.innerHTML = obj[i].description.name;
            select.appendChild(opt);
          }
        }
      })
      .done(function() {
        $("#med_object").LoadingOverlay("hide");
      })
      .fail(function() {
        $("#med_object").LoadingOverlay("hide"); 
      });
      $("#speciality").LoadingOverlay("show");
      $("#calendar").css('margin-top','250px').LoadingOverlay("show");
      $.get("/specialties", function (data, status) {
        let obj = $.parseJSON(data);
        console.log(obj);
        let select = document.getElementById('speciality');
        jQuery.each(obj, function (k, val) {
          let option = document.createElement('option');
          option.value = val.id;
          option.innerHTML = val.name;
          select.appendChild(option);
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
            let speciality = document.getElementById('speciality').value;
            let branch = document.getElementById('med_object').value;

            if (speciality.length > 0 && branch.length > 0) {
              getDataTime(speciality, view.intervalStart._d, view.intervalEnd._d, branch);
            }
            $("#calendar").css('margin-top','20px').LoadingOverlay("hide");
          },
          eventClick: function (calEvent, jsEvent, view) {
            let worker = $('#worker option:selected').val();
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
              medObject.timetableId = calEvent.id;
              medObject.timestart = calEvent.start._i;
              timeReserve = calEvent.start._i;
              $('input[name=timetableId]').val(calEvent.id);
            } else {
              alert("Необходимо выбрать медицинский центр!");
            }
          },
        });

        $("#speciality").change(function () {
          let speciality = document.getElementById('speciality').value;
          let branch = document.getElementById('med_object').value;

          medObject.branch = document.getElementById("med_object").options[document.getElementById('med_object').selectedIndex].text;
          medObject.speciality = document.getElementById("speciality").options[document.getElementById('speciality').selectedIndex].text;
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
          medObject.worker = document.getElementById("worker").options[document.getElementById('worker').selectedIndex].text;
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
      })
      .done(function() {
        $("#speciality").LoadingOverlay("hide");
      })
      .fail(function() {
        $("#speciality").LoadingOverlay("hide"); 
      });

      function getDataTime(speciality, start, end, branch) {
        $("#calendar").LoadingOverlay("show");
        $.get("datatm?speciality=" + speciality + "&start=" + start.toMysqlString() + "&end=" + end.toMysqlString() + '&branches=' + branch, function (data, status) {
          let obj = $.parseJSON(data);
          calendar.fullCalendar('removeEvents');
          calendar.fullCalendar('addEventSource', obj);

          let select = document.getElementById('worker');
          $('#worker').empty();
          let option = document.createElement('option');
          option.innerHTML = "-- Выберите из списка  --";
          select.appendChild(option);
          $("#worker").LoadingOverlay("show");
          $.get("worker?speciality=" + speciality + '&branches=' + branch, function (data, status) {
            let obj = $.parseJSON(data);
            document.getElementById('worker').style.display = 'block';

            for (let i = 0; i < obj.length; i++) {
              let option = document.createElement('option');
              option.value = obj[i].id;
              option.innerHTML = obj[i].surname + " " + obj[i].name + " " + obj[i].patronymic;
              select.appendChild(option);
            }
          })
          .done(function() {
            $("#worker").LoadingOverlay("hide");
          })
          .fail(function() {
            $("#worker").LoadingOverlay("hide"); 
          });
        })
        .done(function() {
          $("#calendar").LoadingOverlay("hide");
        })
        .fail(function() {
          $("#calendar").LoadingOverlay("hide"); 
        });
      }

      function validateEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      }

      $('#send_form').bind('click', function (e) {
        console.log(medObject);
        let surname = $('#surname').val();
        let name = $('#name').val();
        let patronymic = $('#patronymic').val();
        let email = $('#email').val();
        let phone = $('#phone').val();
        let token = $('#token').val();
        let timetableId = $('#timetableId').val();
        let day = $('#days').children("option:selected").val();
        let month = $('#month').children("option:selected").val();
        let year = $('#year').children("option:selected").val();
        let years = year+'-' + month+'-' + day;

        medObject.phone = phone.id;

        let $validated = true;
        if (surname.length == 0) {
          $('#surname').css({'border': '1px solid red'});
          $validated = false;
        } else {
          $('#surname').css({'border': '1px solid #ccd0d2'});
        }

        if (name.length == 0) {
          $('#name').css({'border': '1px solid red'});
          $validated = false;
        } else {
          $('#name').css({'border': '1px solid #ccd0d2'});
        }

        if (patronymic.length == 0) {
          $('#patronymic').css({'border': '1px solid red'});
          $validated = false;
        } else {
          $('#patronymic').css({'border': '1px solid #ccd0d2'});
        }

        if (!validateEmail(email)) {
          $('#email').css({'border': '1px solid red'});
          $validated = false;
        } else {
          $('#email').css({'border': '1px solid #ccd0d2'});
        }

        if (phone.length == 0) {
          $('#phone').css({'border': '1px solid red'});
          $validated = false;
        } else {
          $('#phone').css({'border': '1px solid #ccd0d2'});
        }
        medObject.phone = phone;
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

        if ($validated) {
          $.LoadingOverlay("show");
          $.ajax({
            type: "POST",
            url: '/client',
            data: "surname=" + surname + '&name=' + name + '&patronymic=' + patronymic + '&email=' + email + '&phone=' + phone + '&_token=' + token + '&timetableId=' + timetableId + '&years=' + years + "&spec=" + $('#speciality option:selected').text() + "&filial=" + $('#med_object option:selected').text() + "&time=" + timeReserve,
            dataType: 'json',
            /**
             * @param {{result:string}} data
             * @param {{order_id:int}} data
             * @param {{ticket_html:string}} data
             */
            success: function (data) {
              $.LoadingOverlay("hide");
              $('.step2').hide();
              $('.step3').show();
              $('#order').text(data.order_id);
              let urlDownload = "/pdfdownload?order=" + data.order_id + "&spec=" + $('#speciality option:selected').text() + "&filial=" + $('#med_object option:selected').text() + "&time=" + timeReserve;
              $('.step3 .success').html(data.ticket_html + "<p style='text-align: center; margin-top: 15px;'><a class='btn btn-success' style='margin-right: 30px;' href='" + urlDownload + "'>Скачать талон</a><a class='btn btn-danger' href='/cancel'>Отменить заказ</a></p>");
            },
            error: function () {
              $.LoadingOverlay("hide");
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
      };

      Date.prototype.addDays = function (days) {
        let date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };

    });

/***/ })
/******/ ]);
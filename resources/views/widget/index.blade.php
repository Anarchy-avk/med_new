<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>widget</title>
    <link href="https://fonts.googleapis.com/css?family=Raleway:100,600" rel="stylesheet" type="text/css">
    <link rel="stylesheet" type="text/css" href="/css/jquery-ui.min.css">
    <link rel="stylesheet" type="text/css" href="/css/jquery-ui.theme.min.css">
    <link rel="stylesheet" type="text/css" href="/css/jquery.datetimepicker.min.css">
    <link rel="stylesheet" type="text/css" href="/css/app.css">
    <link rel="stylesheet" href="/css/fullcalendar.css">
    <link rel="stylesheet" type="text/css" href="/css/style.css">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="/js/bootstrap.js"></script>
    <script src="/js/jquery-ui.min.js"></script>
    <script src="/js/fullcalendar/moment.min.js"></script>
    <script src="/js/fullcalendar/fullcalendar.js"></script>
    <script src="/js/fullcalendar/locale-all.js"></script>
    <script src="/js/main.js"></script>
</head>
<body>
<div class="container-fluid" id="app">
    <div class="row">
        @if(Session::has('success'))
            <div class="alert alert-success">
                {{ Session::get('success') }}
            </div>
        @endif
        @if(Session::has('error'))
            <div class="alert alert-danger">
                {{ Session::get('error') }}
            </div>
        @endif
        <div class="col-md-12 block-center">
            <h1>Онлайн-запись</h1>
            <div class="step1">
                <p class="sub-h1">2 простых шага</p>
                <div class="line-obect">
                    <div class="row">
                        <div class="col-md-2">
                            <span class="step_title">Шаг - 1</span>
                        </div>
                        <div class="col-md-10">
                            <select id="med_object" style="display: block;">
                                <option disabled selected value> -- Выберите медицинский центр --</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2">
                        <span class="step_title">Шаг - 2</span>
                    </div>
                    <div class="col-md-5">
                        <select id="speciality" style="display: block;">
                            <option disabled selected value> -- Выберите специальность --</option>
                        </select>
                    </div>
                    <div class="col-md-5">
                        <select id="worker" style="display: block;">
                            <option disabled selected value> -- Выберите врача --</option>
                        </select>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12 box-calendar">
                        <h3>Свободные талоны</h3>
                        <div id="calendar"></div>
                    </div>
                </div>
            </div>

            <div class="step2">
                <div class="row">
                    <div class="col-md-12">
                        <h3>Подтверждения записи</h3>
                        <div class="info_block">
                            <div class="row">
                                <div class="col-md-6">
                                    <label class="info_title">Адрес:</label>
                                </div>
                                <div class="col-md-6">
                                    <div class="address item_result"></div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <label class="info_title">Специальность:</label>
                                </div>
                                <div class="col-md-6">
                                    <div id="specialityText" class="spec item_result"></div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <label class="info_title">Дата и время:</label>
                                </div>
                                <div class="col-md-6">
                                    <div class="date-time item_result"></div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-12">
                                <div class="block-pacient">
                                    <div class="title-header">
                                        <div id="dateTimeText"></div>
                                        <h3>Введите данные пациента </h3>
                                        <div id="patientText"></div>
                                    </div>

                                    <div id="patient" style="display: none;">
                                        <div id="time"></div>
                                    </div>
                                    <meta name="_token" content="{{ csrf_token() }}"/>
                                    <form id="customer" id="sign-up" action="/client" method="post">
                                        <div class="row ">
                                            <div class="col-md-12">
                                                <div class="form-group">
                                                    <label for="surname" class="label_client">Фамилия</label>
                                                    <input placeholder=" " name="surname" id="surname" type="text"
                                                           class="form-control" value="{{ $last_name }}">
                                                </div>
                                                <div class="form-group">
                                                    <label for="name" class="label_client">Имя</label>
                                                    <input placeholder="" name="name" id="name" type="text"
                                                           class="form-control" value="{{ $first_name }}">
                                                </div>
                                                <div class="form-group">
                                                    <label for="patronymic" class="label_client">Отчество</label>
                                                    <input placeholder="" name="patronymic" id="patronymic" type="text"
                                                           class="form-control" value="{{ $patronymic }}">
                                                </div>
                                                <div class="form-group">
                                                    <label for="email" class="label_client">Почта</label>
                                                    <input placeholder="" name="email" id="email" type="text"
                                                           class="form-control" value="{{ $email }}">
                                                </div>
                                                <div class="form-group">
                                                    <label for="phone" class="label_client">Телефон</label>
                                                    <input placeholder="" name="phone" id="phone" type="text"
                                                           class="form-control" value="{{ $phone }}">
                                                </div>
                                                <div class="form-group">
                                                    <label for="years" class="label_client">Ваш день рождения</label>
                                                    <input type="text" name="years" id="datepicker"
                                                           class="form-control" value="{{ $date_of_birth }}">
                                                </div>
                                                <input type="hidden" name="timetableId" id="timetableId" value=""/>
                                                <input type="hidden" name="_token" id="token"
                                                       value="{{ csrf_token() }}">
                                            </div>
                                            <div id="confirm">
                                                <div style="width: 100%; text-align: center;"><br>
                                                    <div class="btn btn-success" style="width: 100%;" id="send_form">
                                                        Получить талон
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="step3">
            <h3>Вы успешно записаны</h3>
            <div class="success">
                <h2>Заказ №<span id="order"></span></h2>
                <div class="success-details">

                </div>
            </div>
        </div>
    </div>
</div>
</body>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.10/jquery.mask.js"></script>
<script src="/js/jquery.datetimepicker.js"></script>
<script>
  $(document).ready(function () {
    if ($('input[name=phone]').length > 0) {
      $('input[name=phone]').mask('+375(00)000-00-00');
    }
    $('#datepicker').datetimepicker({
      format: 'Y-m-d',
      lang: 'ru',
      i18n: {
        ru: {
          months: [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август',
            'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',],
          dayOfWeek: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб',],
        }
      },
      timepicker: false,
    });
  });
</script>
</html>

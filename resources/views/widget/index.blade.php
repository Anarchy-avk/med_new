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
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.0/css/all.css"
          integrity="sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ" crossorigin="anonymous">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="/js/bootstrap.js"></script>
    <script src="/js/jquery-ui.min.js"></script>
    <script src="/js/fullcalendar/moment.min.js"></script>
    <script src="/js/fullcalendar/fullcalendar.js"></script>
    <script src="/js/fullcalendar/locale-all.js"></script>
    <script src="/js/main.js"></script>
    <script src="//cdn.jsdelivr.net/npm/gasparesganga-jquery-loading-overlay@2.1.6/dist/loadingoverlay.min.js"></script>

</head>
<style>

    #reload {
        float: right;
        font-size: 22px;
        color: black;
        margin-right: 29px;
        position: absolute;
        top: 27px;
        left: 14px;
    }

</style>
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
                        <div><i class="fas fa-arrow-left" id="back"
                                style="float:left; font-size: 20px;position: absolute;top: -50px;"></i></div>
                        <h3>Подтверждения записи</h3>
                        <div class="info_block">
                            <div class="row">
                                <div class="col-md-6" id="cust-left">
                                    <label class="info_title">Адрес:</label>
                                </div>
                                <div class="col-md-6" id="cust-left">
                                    <div class="address item_result"></div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6" id="cust-left">
                                    <label class="info_title">Специальность:</label>
                                </div>
                                <div class="col-md-6" id="cust-left">
                                    <div id="specialityText" class="spec item_result"></div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6" id="cust-left">
                                    <label class="info_title">Дата и время:</label>
                                </div>
                                <div class="col-md-6" id="cust-left">
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
                                        <div class="row" id="cust-row">
                                            <div class="col-sm-6">
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
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label for="phone" class="label_client">Телефон</label>
                                                    <input placeholder="" name="phone" id="phone" type="text"
                                                           class="form-control" value="{{ $phone }}"
                                                           style="margin-bottom: 21px;">
                                                </div>
                                                <div class="form-group">
                                                    <label for="email" class="label_client">Почта</label>
                                                    <input placeholder="" name="email" id="email" type="text"
                                                           class="form-control" value="{{ $email }}">
                                                </div>
                                                <div class="form-group" id="cust-form">
                                                    <label for="years" class="label_client">Ваш день рождения (год,
                                                        месяц, дней)</label> <!-- <br> -->
                                                    <div class="cust-lable">
                                                        <label></label>
                                                        <select name="year" id="year"
                                                                style="width: 65px; padding: 4px;text-align: center;"
                                                                required>
                                                            <?php
                                                            $year = date("Y");
                                                            for ($i = $year; $i >= ($year - 120) ; $i--) {
                                                            ?>
                                                            <option value={{ $i }}>{{ $i }}</option>
                                                            <?php } ?>
                                                        </select>
                                                        <label></label>
                                                        <select name="month" id="month"
                                                                style="width: 65px; padding: 4px;text-align: center;"
                                                                required>
                                                            <option value=01>01</option>
                                                            <option value=02>02</option>
                                                            <option value=03>03</option>
                                                            <option value=04>04</option>
                                                            <option value=05>05</option>
                                                            <option value=06>06</option>
                                                            <option value=07>07</option>
                                                            <option value=08>08</option>
                                                            <option value=09>09</option>
                                                            <option value=10>10</option>
                                                            <option value=11>11</option>
                                                            <option value=12>12</option>
                                                        </select>
                                                        <label></label>
                                                        <select name="days" id="days"
                                                                style="width: 65px; padding: 4px;text-align: center;"
                                                                required>
                                                            <option value=01>01</option>
                                                            <option value=02>02</option>
                                                            <option value=03>03</option>
                                                            <option value=04>04</option>
                                                            <option value=05>05</option>
                                                            <option value=06>06</option>
                                                            <option value=07>07</option>
                                                            <option value=08>08</option>
                                                            <option value=09>09</option>
                                                            <option value=10>10</option>
                                                            <option value=11>11</option>
                                                            <option value=12>12</option>
                                                            <option value=13>13</option>
                                                            <option value=14>14</option>
                                                            <option value=15>15</option>
                                                            <option value=16>16</option>
                                                            <option value=17>17</option>
                                                            <option value=18>18</option>
                                                            <option value=19>19</option>
                                                            <option value=20>20</option>
                                                            <option value=21>21</option>
                                                            <option value=22>22</option>
                                                            <option value=23>23</option>
                                                            <option value=24>24</option>
                                                            <option value=25>25</option>
                                                            <option value=26>26</option>
                                                            <option value=27>27</option>
                                                            <option value=28>28</option>
                                                            <option value=29>29</option>
                                                            <option value=30>30</option>
                                                            <option value=31>31</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <input type="hidden" name="timetableId" id="timetableId" value=""/>
                                                <input type="hidden" name="_token" id="token"
                                                       value="{{ csrf_token() }}">
                                            </div>
                                            <div id="confirm">
                                                <div style="width: 100%; text-align: center;float: left;"><br>
                                                    <div class="btn btn-success" id="send_form">
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
            <h3>Вы успешно записаны <i id="reload" class="fas fa-redo-alt"></i></h3>
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

    if ($('input[name=years]').length > 0) {
      $('input[name=years]').mask('0000');
    }

    if ($('input[name=month]').length > 0) {
      $('input[name=month]').mask('00');
    }

    if ($('input[name=days]').length > 0) {
      $('input[name=days]').mask('00');
    }

    // $('#days').datetimepicker({
    //   // changeMonth: true,
    //   //   changeYear: true,
    //   //   showButtonPanel: true,
    //     dateFormat: 'dd',
    //   lang: 'ru',
    //   i18n: {
    //     ru: {
    //       months: [
    //         'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август',
    //         'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',],
    //       dayOfWeek: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб',],
    //     }
    //   },
    //   timepicker: false,
    // });

    // $('#month').datetimepicker({
    //     changeMonth: true,
    //     showButtonPanel: true,
    //   format: 'm',
    //   lang: 'ru',
    //   i18n: {
    //     ru: {
    //       months: [
    //         'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август',
    //         'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',],
    //       dayOfWeek: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб',],
    //     }
    //   },
    //   timepicker: false,
    // });

    // $('#year').datetimepicker({
    //     changeYear: true,  
    //     showButtonPanel: true,      
    //   format: 'Y',
    //   lang: 'ru',
    //   i18n: {
    //     ru: {
    //       months: [
    //         'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август',
    //         'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',],
    //       dayOfWeek: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб',],
    //     }
    //   },
    //   timepicker: false,
    // });

    $('#reload').click(function () {
      location.reload();
    });

    $('#back').click(function () {
      $('.step2').hide();
      $('.step1').show();
    });


  });
</script>
</html>

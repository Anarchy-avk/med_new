<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Widget</title>
    <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Raleway:100,600">
    <link rel="stylesheet" type="text/css" href="{{ asset('css/jquery-ui.min.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('css/jquery-ui.theme.min.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('css/jquery.datetimepicker.min.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('css/bootstrap.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('css/fullcalendar.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('css/style.css') }}">
    <link rel="stylesheet" type="text/css" href="https://use.fontawesome.com/releases/v5.7.0/css/all.css"
          integrity="sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ" crossorigin="anonymous">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="{{ asset('js/bootstrap.js') }}"></script>
    <script src="{{ asset('js/jquery-ui.min.js') }}"></script>
    <script src="{{ asset('js/fullcalendar/moment.min.js') }}"></script>
    <script src="{{ asset('js/fullcalendar/fullcalendar.js') }}"></script>
    <script src="{{ asset('js/fullcalendar/locale-all.js') }}"></script>
    <script src="{{ asset('js/main.js')  }}"></script>
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
        <div class="col">
            <div class="row">
                <h1>Онлайн-запись</h1>
            </div>
            <div class="step4 row justify-content-center">
                <div class="col-11 col-md-4">
                    <div class="row">
                        <h3>Вы успешно записаны <i id="reload" class="fas fa-redo-alt"></i></h3>
                    </div>
                    <div id="ticket-data" class="row">
                        <div class="col">
                            <div class="row">
                                <img class="img-fluid" src="{{ asset('img/talon-logo-top.png') }}" alt="">
                            </div>
                            <div class="row">
                                <h2>Заказ №<span id="order">1234567</span></h2>
                                <h3>Талон на прием к врачу</h3>
                                <table>
                                    <tr>
                                        <td><label class="info_title">Адрес:</label></td>
                                        <td>
                                            <div class="address item_result">Филиал 12</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><label class="info_title">Специальность:</label></td>
                                        <td>
                                            <div id="specialityText" class="spec item_result">Хирург</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><label class="info_title">Дата и время:</label></td>
                                        <td>
                                            <div class="date-time item_result">2019-08-08 10:40</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>

                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div class="row">
                                <img class="img-fluid" src="{{ asset('img/talon-logo-bottom.png') }}" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <p style='text-align: center; margin-top: 15px;'><a class='btn btn-success' style='margin-right: 30px;' href='" + urlDownload + "'>Скачать талон</a><a class='btn btn-danger' href='/cancel'>Отменить заказ</a></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>

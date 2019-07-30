<style>
    h3 {
        text-transform: uppercase;
        font-size: 14px !important;
        text-align: center;
        line-height: 1 !important;
        margin: 10px 0px;
        color: #2ab7a9;
    }

    h2 {
        text-align: center;
    }

    table {
        width: 100%;
    }

    table td {
        width: 50%;
        font-size: 14px;
    }

    .info_title {
        font-weight: bold;
        text-align: right
    }

    .item_result {
        font-weight: bold;
        text-align: left;
    }
</style>

<div class="step3" style="display: block;">
    <img class="alignnone size-full" src="{{ asset('img/talon-logo-top.png') }}" alt="">
    <br/>
    <h2>Заказ №<span id="order">{{ $order }}</span></h2>
    <h3>Талон на прием к врачу</h3>
    <table>
        <tr>
            <td><label class="info_title">Адрес:</label></td>
            <td>
                <div class="address item_result">{{ $filial }}</div>
            </td>
        </tr>
        <tr>
            <td><label class="info_title">Специальность:</label></td>
            <td>
                <div id="specialityText" class="spec item_result">{{ $spec }}</div>
            </td>
        </tr>
        <tr>
            <td><label class="info_title">Дата и время:</label></td>
            <td>
                <div class="date-time item_result">{{ $time }}</div>
            </td>
        </tr>
        <tr>
            <td>
                <img src="{{ $qRcode }}" />
            </td>
        </tr>>
    </table>
    <br/>
    <img class="alignnone size-full" src="{{ asset('img/talon-logo-bottom.png') }}" alt="">
</div>
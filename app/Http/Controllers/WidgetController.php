<?php

namespace App\Http\Controllers;

use PDF;
use Nathanmac\Utilities\QRCode\Generator;
use Config;
use Timetable;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Timetable\Api\Error\ResponseContainsErrors;
use Illuminate\Support\Facades\Log;
use Timetable\Api\Type\Order;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Response;

class WidgetController extends Controller
{

    private $client;

    public function __construct()
    {
        $this->client = new Timetable\Api\Client(Config::get('medicina.url'), Config::get('medicina.accessToken'));
    }

    public function index()
    {
        return view('widget.index');
    }

    public function generate(Request $request, $size = 100, $color = '000000', $background = false)
    {
        header('Content-Type: image/png');

        $response = response()->stream(function () {
            echo Generator::generate($request->get('text'), $size, $color, $background);
        }, 200, ["Content-Type" => 'image/png']);
        return Generator::generate($request->get('text'), $size, $color, $background);
    }

    public function generatePdf(Request $request)
    {
        $data = [
            'order' => $request->get('order'),
            'filial' => $request->get('filial'),
            'spec' => $request->get('spec'),
            'time' => $request->get('time'),
            'qRcode' => Config::get('app.url') . '/qrcode?text=' . $request->get('order'),
        ];

        $pdf = PDF::loadView('widget.talon', $data);
        return $pdf->stream('document.pdf');
    }

    public function generatePdfdownload(Request $request)
    {

        $data = [
            'order' => $request->get('order'),
            'filial' => $request->get('filial'),
            'spec' => $request->get('spec'),
            'time' => $request->get('time'),
            'qRcode' => Config::get('app.url') . '/qrcode?text=' . $request->get('order'),
        ];

        $pdf = PDF::loadView('widget.talon', $data);
        echo $pdf->download('talon.pdf');
    }

    public function getBranch()
    {

        $query = (new Timetable\Api\Query\BranchesQuery())->wantFields('id', 'code', ['description' => ['name']]);
        $timetables = $this->client->query($query);
        $myJSON = json_encode($timetables);

        echo $myJSON;
    }

    public function getSpecialties()
    {

        $query = (new Timetable\Api\Query\SpecialtiesQuery())->wantFields('id', 'code', 'name');
        $timetables = $this->client->query($query);
        $arraySpec = [];
        foreach ($timetables AS $index => $value) {
            $arraySpec[$value->name] = array(
                'id' => $value->id,
                'code' => $value->code,
                'name' => $value->name,
            );
        }
        ksort($arraySpec);
        $myJSON = json_encode($arraySpec);

        echo $myJSON;
    }

    public function getDataTime(Request $request)
    {

        $input = $request->all();
        $speciality[0] = (int)$request->input('speciality');
        $worker[0] = (int)$request->input('worker');
        $branches[0] = (int)$request->input('branches');
        $start = $request->input('start');
        $end = $request->input('end');
        $newformatMin = Carbon::createFromFormat('Y-m-d', $start);
        $newformatMax = Carbon::createFromFormat('Y-m-d', $end);

        if ($worker[0] === 0) {
            $query1 = (new Timetable\Api\Query\TimetablesQuery())
                ->dateMin($newformatMin)
                ->dateMax($newformatMax)
                ->specialties($speciality)
                ->branches($branches);
        } else {
            $query1 = (new Timetable\Api\Query\TimetablesQuery())
                ->dateMin($newformatMin)
                ->dateMax($newformatMax)
                ->workers($worker)
                ->specialties($speciality)
                ->branches($branches);
        }
        try {
            $timetables = $this->client->query($query1);
        } catch (ResponseContainsErrors $e) {
            Log::warning(print_r($e->getErrors(), true));
            return;
        }
        $Calendar = array();
        foreach ($timetables as $val) {
            $start = (array)$val->start_time;
            $end = (array)$val->end_time;
            $Calendar[] = [
                "id" => $val->id,
                "title" => date('H:i', strtotime($start['date'])),
                "time" => date('H:i', strtotime($start['date'])),
                "start" => date('Y-m-d H:i', strtotime($start['date'])),
                "allDay" => true,
            ];
        }

        $myJSON = json_encode($Calendar);
        echo $myJSON;
    }

    public function getWorker(Request $request)
    {
        $branches[] = (int)$request->input('branches');
        $speciality[] = (int)$request->input('speciality');

        $query = (new Timetable\Api\Query\WorkersQuery())
            ->branches($branches)
            ->specialties($speciality);

        $response = $this->client->query($query);

        echo json_encode($response);
    }

    public function addClient(Request $request)
    {

        $input = $request->all();
        $birthDate = Carbon::createFromFormat('Y-m-d', $input['years']);
        $phone = str_replace(' ', '', preg_replace("/[^a-zA-ZА-Яа-я0-9\s]/", "", $input['phone']));
        $mutation = (new Timetable\Api\Mutation\CreateOrderWithCustomerMutation())
            ->timetableId((int)$input['timetableId'])
            ->customer((new Timetable\Api\Type\Input\OrderCustomerInput())
                ->surname($input['surname'])
                ->name($input['name'])
                ->patronymic($input['patronymic'])
                ->email($input['email'])
                ->phone($phone)
                ->birthDate($birthDate)
                ->sex('male')
            );

        try {
            /* @var $order Order */
            $order = $this->client->mutation($mutation);
        } catch (ResponseContainsErrors $e) {
            Log::warning(print_r($e->getErrors(), true));
            return;
        }
        echo $order->id;
    }
}

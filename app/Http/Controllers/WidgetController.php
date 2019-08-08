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
use Illuminate\Support\Facades\Input;
use App\Mail\OrderShipped;
use Mail;
use Session;

class WidgetController extends Controller
{

    private $client;

    public function __construct()
    {
        $this->client = new Timetable\Api\Client(Config::get('medicina.url'), Config::get('medicina.accessToken'));
    }

    public function index(Request $request)
    {
        $data = [
            'last_name' => '',
            'first_name' => '',
            'patronymic' => '',
            'email' => '',
            'phone' => '',
            'date_of_birth' => '',
        ];

        $lastName = Input::get('last_name');
        if ($lastName !== null) {
            $data['last_name'] = $lastName;
        }
        $firstName = Input::get('first_name');
        if ($firstName !== null) {
            $data['first_name'] = $firstName;
        }
        $patronymic = Input::get('patronymic');
        if ($patronymic !== null) {
            $data['patronymic'] = $patronymic;
        }
        $email = Input::get('email');
        if ($email !== null) {
            $data['email'] = $email;
        }
        $phone = Input::get('phone');
        if ($phone !== null) {
            $data['phone'] = $phone;
        }
        $dateOfBirth = Input::get('date_of_birth');
        if ($dateOfBirth !== null) {
            $data['date_of_birth'] = $dateOfBirth;
        }

        return view('widget.index', $data);
    }

    public function generate(Request $request, $size = 100, $color = '000000', $background = false)
    {
        header('Content-Type: image/png');

        $response = response()->stream(function () use (&$request, &$size, &$color, &$background) {
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

    public function sendMail($to, $attachment, $cancel_order_link)
    {
        $content = array(
            'name' => "",
            'message' => "Thank you for your booking. You can cancel your booking by clicking the link given below.",
            'link' => $cancel_order_link,
            'path' => $attachment
        );
        Mail::to($to)->send(new OrderShipped($content));
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
        $newFormatMin = Carbon::createFromFormat('Y-m-d', $start);
        $newFormatMax = Carbon::createFromFormat('Y-m-d', $end);

        $query = (new Timetable\Api\Query\TimetablesQuery())
            ->dateMin($newFormatMin)
            ->dateMax($newFormatMax)
            ->specialties($speciality)
            ->branches($branches);

        if ($worker[0] !== 0) {
            $query = $query->workers($worker);
        }

        try {
            $timetables = $this->client->query($query);
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
            ->specialties($speciality)
        ;
        try {
            $response = $this->client->query($query);
        } catch (ResponseContainsErrors $e) {
            Log::warning(print_r($e->getErrors(), true));
            return null;
        }

        echo json_encode($response);
    }

    public function addClient(Request $request)
    {

        $input = $request->all();
        $birthDate = Carbon::createFromFormat('Y-m-d', $input['years']);
        $phone = $this->preparePhone($input['phone']);
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
            $data = [
                'order' => $order->id,
                'filial' => $input['filial'],
                'spec' => $input['spec'],
                'time' => $input['time'],
                'qRcode' => Config::get('app.url') . '/qrcode?text=' . $order->id,
            ];

            $pdf = PDF::loadView('widget.talon', $data);
            $path = public_path() . '/' . time() . ".pdf";
            $pdf->save($path);
            $cancel_order_link = url('cancel/' . $order->id);
            $this->sendMail($input['email'], $path, $cancel_order_link);
            session(['order' => $order->id]);

            $result['result'] = 'success';
            $result['order_id'] = $order->id;
            $result['ticket_html'] = view('widget.talon', $data)->render();

            return json_encode($result);

        } catch (ResponseContainsErrors $e) {
            Log::warning(print_r($e->getErrors(), true));
            return null;
        }

    }

    private function preparePhone($phone)
    {
        return str_replace(' ', '', preg_replace("/[^a-zA-ZА-Яа-я0-9\s]/", "", $phone));
    }

    public function cancel(Request $request)
    {
        try {
            $order_id = $request->session()->get('order');
            $id = (int)$request->id;
            if ($id)
                $order_id = $id;
            $mutation = (new Timetable\Api\Mutation\CancelReservedOrderMutation())
                ->orderId($order_id);
            /* @var $order Order */
            $order = $this->client->mutation($mutation);
            Session::flash('success', "Заказ №$order_id успешно отменен");
        } catch (ResponseContainsErrors $e) {
            $error = $e->getMessage();
            Session::flash('error', "$error");
            Log::warning(print_r($e->getErrors(), true));
        }
        return redirect('widget');

    }

    public function test(Request $request)
    {
        return view('widget.test');
    }
}

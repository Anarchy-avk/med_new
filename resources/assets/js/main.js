$( function() {
 var timeReserv;
 var calendar;
 var medObect = {};
 var med_obeject='';
 var dayWeek=new Date().getDay();

 
 $.get("/branch", function (data, status) {
       var obj = $.parseJSON(data);
       select = document.getElementById('med_obeject');
       for (var i = 0; i < obj.length; i++) {
         var opt = document.createElement('option');
         if(obj[i].code.length>0){
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
                jQuery.each(obj, function(k, val) {
                    var opt = document.createElement('option');
                    opt.value = val.id;
                    opt.innerHTML = val.name;
                    select.appendChild(opt);

                });
               
                                 calendar=$('#calendar').fullCalendar({
                                      header: {
                                        left: 'prev,next',
                                        center: 'title',
                                        right: 'basicWeek'
                                      },
                                       columnHeader:true,
                                       columnHeaderFormat:'D ddd',
                                       defaultView: 'basicWeek',
                                       firstDay:dayWeek,
                                      //    contentHeight: 400,
                                      // navLinks: true, // can click day/week names to navigate views
                                      // editable: true,
                                       locale: 'ru',
                                       viewRender: function(view, element) {
                                  
                                          
                                          //  console.log(view.intervalStart.format());
                                         //   console.log(view.intervalEnd.format());
                                            speciality=document.getElementById('speciality').value;
                                            branch=document.getElementById('med_obeject').value;
 
                                         if(speciality.length>0 && branch.length>0){   
                                            getDataTime(speciality,view.intervalStart.format(),view.intervalEnd.format(),branch);                   
                                         }
                                       },
                                        eventClick: function(calEvent, jsEvent, view) {
                                           
                                             worker=$('#worker option:selected').val();
                                             med_obeject=$('#med_obeject option:selected').val();
                                            // console.log("----------");
                                             console.log(calEvent);console.log(jsEvent);console.log(view);
                                             if(med_obeject.length!=0){
                                                       
                                                 $('.step1').hide();
                                                 $('.step2 .address').text($('#med_obeject option:selected').text());
                                                 $('.step2 .spec').text($('#speciality option:selected').text());
                                                 $('.step2 .date-time').text(calEvent.start._i);
                                                 $('.step2').show();
                                                   medObect.timetableId=calEvent.id;
                                                   medObect.timestart=calEvent.start._i;
                                                   timeReserv=calEvent.start._i;                                                        
                                                  $('input[name=timetableId]').val(calEvent.id);
                                              }else{
                                                alert("Выберите мед. центр!");
                                              }  
                                          },
                                          
                                    });
              
     
                                    
               $("#speciality").change(function () {
                     speciality=document.getElementById('speciality').value;
                     branch=document.getElementById('med_obeject').value;
                     
                     medObect.branch=document.getElementById("med_obeject").options[document.getElementById('med_obeject').selectedIndex].text;
                     medObect.speciality=document.getElementById("speciality").options[document.getElementById('speciality').selectedIndex].text;
                     if(branch.length>0){
                         var date = new Date();
                         mm_start=StartDate(date);
                         mm_end=EndDate(date);
                         console.log(mm_start);   console.log(mm_end);
                         getDataTime(speciality,mm_start,mm_end,branch,0);     
                     }else{
                        alert('Выберите филиал...');
                     }               
                 });
                   
                 $("#worker").change(function () {
                        branch=document.getElementById('med_obeject').value; 
                        worker=document.getElementById('worker').value;
                        speciality=document.getElementById('speciality').value;
                        medObect.worker=document.getElementById("worker").options[document.getElementById('worker').selectedIndex].text;              
                        moment=calendar.fullCalendar('getDate');
                        var date = new Date(moment._d);
                        mm_start=StartDate(date);
                        mm_end=EndDate(date);
                        $.get("/datatm?speciality="+speciality+"&worker="+worker+"&start="+mm_start+"&end="+mm_end+"&branches="+branch, function (data, status) {
                            obj = $.parseJSON(data);
                            var obj = $.parseJSON(data);
                            calendar.fullCalendar( 'removeEvents');
                            calendar.fullCalendar('addEventSource', obj);
                            console.log(obj);
                       });
                  }); 

             });  
             
           
 
                 function getMonday(d) {
                      d = new Date(d);
                      var day = d.getDay(),
                          diff = d.getDate() - day + (day == 0 ? -6:1);
                      return new Date(d.setDate(diff));
                  }      
                  
                  function StartDate(date){
                        var d = date.getDate();
                        var m = date.getMonth();
                        var y = new Date(date.getFullYear());
                        start=new Date(); 
                        end=new Date(date.setDate(start.getDate()+6));
                        mm=start.getMonth()+1;
                        return start.getFullYear()+"-"+('0' + mm).slice(-2) +"-"+('0' + start.getDate()).slice(-2);
                  }
                  function EndDate(date){
                        var d = date.getDate();
                        var m = date.getMonth();
                        var y = new Date(date.getFullYear());
                        start=new Date(); 
                        end=new Date(date.setDate(start.getDate()+6));
                        mm=start.getMonth()+1;
                        return end.getFullYear()+"-"+('0' + (mm) ).slice(-2)+"-"+('0' + end.getDate()).slice(-2);
                  }
                function getDataTime(speciality,start,end,branch){
                    $.get("datatm?speciality=" + speciality + "&start="+start+"&end=" + end+'&branches='+branch, function (data, status) {
                        obj = $.parseJSON(data);
                       
                        var obj = $.parseJSON(data);
                        calendar.fullCalendar( 'removeEvents');
                        calendar.fullCalendar('addEventSource', obj);
                        
                        var select = document.getElementById('worker');
                        $('#worker').empty();
                        opt = document.createElement('option');
                        opt.innerHTML = "-- Выберите из списка  --";
                        select.appendChild(opt);
                    
                         $.get("worker?speciality=" + speciality+'&branches='+branch, function (data, status) {
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
   $('#send_form').bind('click',function(e){
    console.log(medObect); 
       var surname = $('#surname').val();
       var name = $('#name').val();
       var patronymic = $('#patronymic').val();
       var email = $('#email').val();
       var phone = $('#phone').val();
       var token = $('#token').val();
       var timetableId = $('#timetableId').val();
       var years=document.getElementById('datepicker').value;
      
       medObect.phone=phone.id;
       
       $chek=true;
       if(surname.length==0){
         $('#surname').css({'border':'1px solid red'});
         $chek=false;
       }else{
         $('#surname').css({'border':'1px solid #ccd0d2'});
       }
  
      if(name.length==0){
         $('#name').css({'border':'1px solid red'});
         $chek=false;
       }else{
         $('#name').css({'border':'1px solid #ccd0d2'});
       }  
       
       if(patronymic.length==0){
         $('#patronymic').css({'border':'1px solid red'});
         $chek=false;
       }else{
         $('#patronymic').css({'border':'1px solid #ccd0d2'});
       }
       
       if (!validateEmail(email)) {
         $('#email').css({'border':'1px solid red'});
         $chek=false;
       }else{
         $('#email').css({'border':'1px solid #ccd0d2'});
       }
       
       if(phone.length==0){
         $('#phone').css({'border':'1px solid red'});
         $chek=false;
       }else{
         $('#phone').css({'border':'1px solid #ccd0d2'});
       }      
        medObect.phone=phone;
        /*$.ajaxSetup({
            header:$('meta[name="_token"]').attr('content')
        })*/
       $.ajaxSetup({
				headers: {
					'X-XSRF-Token': $('meta[name="_token"]').attr('content')
				}
			}); 
        
       if($chek){
             $.ajax({
                type:"POST",
                url:'/client',
                data:"surname="+surname+'&name='+name+'&patronymic='+patronymic+'&email='+email+'&phone='+phone+'&_token='+token+'&timetableId='+timetableId+'&years='+years,
                dataType: 'json',
                success: function(data){
                    $('.step2').hide();
                    $('.step3').show();
                    $('#order').text(data);
                    urlTalon="/pdf?order="+data+"&spec="+$('#speciality option:selected').text()+"&filial="+$('#med_obeject option:selected').text()+"&time="+timeReserv;
                    urlDownload="/pdfdownload?order="+data+"&spec="+$('#speciality option:selected').text()+"&filial="+$('#med_obeject option:selected').text()+"&time="+timeReserv;
                    $('.step3 .succes').html("<embed src='"+urlTalon+"' width='300' height='300' type='application/pdf'><p style='text-align: center;'><a href='"+urlDownload+"'>Скачать талон</a></p>");   
                    
                },
                error: function(data){
        
                }
            })
        }else{
            alert('Проверте форму');
        }
        return false;

 }); 
  
      
        
});  
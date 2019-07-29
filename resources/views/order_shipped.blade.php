<div class="content">
	<p>{{ $content['name'] }},</p>
	<p> {{ $content['message'] }}</p>
	<?php if($content['link'] != '') { ?>
		<p> <a href="{{$content['link']}}"> {{ $content['link'] }} </p>
	<?php } ?>
	
</div>
let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */
//.js('resources/assets/js/app.js', 'public/js')
mix.js('resources/assets/js/jquery-ui.min.js', 'public/js')
   .js('resources/assets/js/main.js', 'public/js')
   .js('resources/assets/js/jquery.mask.min.js', 'public/js')
   .copyDirectory('resources/assets/js/bootstrap.js', 'public/js')
   .copyDirectory('resources/assets/js/fullcalendar/locale', 'public/js/fullcalendar/locale')
   .copyDirectory('resources/assets/js/fullcalendar/fullcalendar.js', 'public/js/fullcalendar')
   .copyDirectory('resources/assets/js/fullcalendar/moment.min.js', 'public/js/fullcalendar')
   .copyDirectory('resources/assets/js/fullcalendar/gcal.js', 'public/js/fullcalendar')
   .copyDirectory('resources/assets/js/fullcalendar/locale-all.js', 'public/js/fullcalendar')
   .copyDirectory('resources/assets/js/jquery.datetimepicker.js', 'public/js')
   .copyDirectory('resources/assets/css/jquery-ui.min.css', 'public/css')
   .copyDirectory('resources/assets/css/jquery-ui.theme.min.css', 'public/css')
   .copyDirectory('resources/assets/css/style.css', 'public/css')
   .copyDirectory('resources/assets/css/fullcalendar.css', 'public/css')
   .copyDirectory('resources/assets/css/fullcalendar.print.css', 'public/css')
   .copyDirectory('resources/assets/css/bootstrap.css', 'public/css')
   .copyDirectory('resources/assets/css/jquery.datetimepicker.min.css', 'public/css');
  // .sass('resources/assets/sass/app.scss', 'public/css');
   
   

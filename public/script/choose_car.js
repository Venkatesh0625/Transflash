var submitted = false;

function submit_car(car_model) {
    
    if( submitted === false) {

        var form = document.createElement('form');
        form.method = 'post';
        form.action = '/choose_car';
        var field = document.createElement('input');
        field.type = 'text';
        field.name = 'car_model';
        field.value = String(car_model);
        form.appendChild(field);
        document.body.appendChild(form);
        form.submit();
    }
}
function validateBooking() 
{
    var form = new FormData(document.getElementById('booking-form'));
    var now = new Date().getTime(); 
    var start_date = new Date(form.get('startDate')).getTime();
    var end_date = new Date(form.get('endDate')).getTime();
    if(start_date < now)
    {
        alert('Booking date shouldn\'t be a past');
        return false;
    }
    else if(end_date <= start_date)
    {
        alert('End date should be after start date ');
        return false;
    }
    return true;
}
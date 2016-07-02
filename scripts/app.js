$(function(){


    // Data used to Create Seat Layout
	var settings = {

               rows: ['A','B','C','D','E','F','G','H','I','J'],
               cols: [1,2,3,4,5,6,7,8,9,10,11,12],
               seatCss: 'seat',
               selectedSeatCss: 'selectedSeat',
               selectingSeatCss: 'selectingSeat'
    };

    
    //Current Booking User Data
	var currentUser = {
		name: '',
		noOfSeats: '',
        count: '',
		selctedSeats: []
	}
    

    //Data of All Booked Users
    var bookedUsersData = [];

    //Total Seats Available
    var totalNoOfSeats = 120;

    //Variable to prevent repeated data being saved
    var confirmCounter = 0;
   
   //All Booked Seats
    var bookedSeats = [];


        //initialzing the seat layout 
       (function () {
            var str = [], seatNo, className;

             for (i = 0; i < settings.rows.length; i++) {
                for (j = 0; j < settings.cols.length; j++) {

                     seatNo = (settings.rows[i]  +settings.cols[j]);
                     className = settings.seatCss ;
                
                    if(j==0){
                        str.push('<tr>')
                    }

                    str.push('<td class="' + className + '"'  +
                              '<a title="' + seatNo + '">' + seatNo + '</a>' +
                              '</td>');

                    if(j==settings.cols.length-1){
                        str.push('</tr>')
                    }
                }

                $('#table').html(str.join(''));
            }

     }());


    //Basic Validation Function 
    var validation = function(){

        currentUser.name = $('#name').val();
        currentUser.noOfSeats = $('#seats').val();

        var seatsAvailable = totalNoOfSeats - bookedSeats.length;
        
        
        //fails if name is empty
        if(currentUser.name.length < 1){
            return console.log('Please Enter Your Name');
        }
        //fails if no of seats is not a valid number
        else if(isNaN(currentUser.noOfSeats) || currentUser.noOfSeats < 1){
            return console.log('Enter Valid no of seats');
        }
        //fails if more no of seats is inputted than what is available
        else if($('#seats').val() > seatsAvailable){
            return console.log('only ' + seatsAvailable + ' are available');
        }else{
            return true
        }
    }

    //called when seat selection button is clicked
    $('.seat').click(function () {

        var res = validation();
        if(res == true){
            console.log('Basic Validation SuccesFull');
        }else{
            return res;
        }

        //fails if all the seats are selected 
        if(currentUser.count < 1){
            return console.log('You have selected all ' + $('#seats').val() + ' seats');
        }
        //fails if seat is already booked
        if ($(this).hasClass(settings.selectedSeatCss)){
            return console.log('This seat is already reserved');
        }
        //unselects the already selected seat and removes from the selected seat data 
        else if ($(this).hasClass(settings.selectingSeatCss)){
            $(this).removeClass(settings.selectingSeatCss);
            currentUser.selctedSeats = _.without(currentUser.selctedSeats,this.title);
            console.log('unselected seat ' + this.title);
            currentUser.count++;
        }
        //selects a seat and push it to selected seats array 
        else{
            $(this).addClass(settings.selectingSeatCss);
            currentUser.selctedSeats.push(this.title);
            console.log('selected seat ' + this.title);
            currentUser.count--;
        }
    });
         
       



    $('#selection').click(function(){

       
        confirmCounter = 1;
        currentUser.count = $('#seats').val() ;

        //basic validaiton is done while select function is clicked
    	var res = validation();
        if(res == true){
            console.log('Basic Validation SuccesFull');
        }else{
            return res;
        }
    	

    });


    

    //called when confirm booking button is clicked 
    $('#confirmation').click(function(){

        //avoid repeated data being saved
        if(confirmCounter < 1){
            return console.log('You have nothing to book')
        }
        // fails if user have some remaining seats to select
        else if(currentUser.count != 0){
            return console.log('you have ' + currentUser.count + ' more seats to select before you click confirm');
        }

        confirmCounter--; 

        //pushes the current user selected seats into  global bookedSeats Data
        currentUser.selctedSeats.forEach(function (seat) {
                bookedSeats.push(seat);
        });

        //Converts selected seats into Reserved Seats 
        $('.selectingSeat').addClass(settings.selectedSeatCss);  

        //this object is pushed into global bookedUsersData array 
        var data = {
            name: currentUser.name,
            noOfSeats: currentUser.noOfSeats,
            selctedSeats: currentUser.selctedSeats.toString()
        }
        bookedUsersData.push(data);

        //making all current users data empty
        currentUser = {
            name: '',
            noOfSeats: '',
            count: '',
            selctedSeats: []
        }

        //Printing Out the Current User Data into The Table
        $('#bookedTickets').append('<tr><td>' + data.name + '</td><td>'+ data.noOfSeats + '</td><td>' + data.selctedSeats + '</td></tr>' )
    });
    
});
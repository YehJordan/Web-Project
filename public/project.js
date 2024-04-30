//Method for the date and time
function getCurrentDate(){
    let currentDate = new Date();
    let day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let month = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."]

    let currentDay = day[currentDate.getDay()];
    let currentMonth = month[currentDate.getMonth()];
    let currentYear = currentDate.getFullYear();
    let currentNumberDay = currentDate.getDate();
    let currentSeconds = currentDate.getSeconds();
    let currentMinute = currentDate.getMinutes();
    let currentHour = currentDate.getHours();

    currentSeconds = currentSeconds < 10 ? "0" + currentSeconds : currentSeconds;
    currentMinute = currentMinute < 10 ? "0" + currentMinute : currentMinute;
    document.getElementById("date").innerHTML = currentDay + ", " + currentMonth + " " + currentNumberDay + ", " + currentYear + " | " + currentHour + ":" + currentMinute + ":"  + currentSeconds;
}

//Immediately call CurrentDate
getCurrentDate();
//Then refresh every second (1000 milliseconds)
setInterval(getCurrentDate, 1000);


//Method for find cat/dog
function findPet(event){
    //prevents resetting
    event.preventDefault();

    //Radio buttons for cat and dog
    const catChoice = document.getElementById("cat");
    const dogChoice = document.getElementById("dog");
    //Selector for type of breed
    const breedChoice = document.getElementById("breed").value;
    //Selector for age range
    const ageRange = document.getElementById("ageRange").value;
    //Radio buttons for pet gender
    const maleChoice = document.getElementById("Male");
    const femaleChoice = document.getElementById("Female");
    //Checkboxes for behaviour
    const behaviourChoice = document.querySelectorAll('input[name="behaviour"]');
    let behaviourCheck = false;
    behaviourChoice.forEach(function(checkbox) {
        if (checkbox.checked) {
            behaviourCheck = true;
            return; // exit the loop early if at least one checkbox is checked
        }
    });

    if((!catChoice.checked && !dogChoice.checked) || 
        breedChoice === "select" || 
        ageRange === "select" || 
        (!maleChoice.checked && !femaleChoice.checked) || 
        !behaviourCheck){
        alert("Please fill in every field!");
    }
    else{
        document.getElementById("petForm").submit();
    }
}

//Method for GiveAway pet
function givePet(event){
    //prevents resetting
    event.preventDefault();

    //Radio buttons for cat and dog
    const catChoice = document.getElementById("cat");
    const dogChoice = document.getElementById("dog");

    //Radio buttons for pet gender
    const maleChoice = document.getElementById("Male");
    const femaleChoice = document.getElementById("Female");

    //Selector for type of breed
    const breedChoice = document.getElementById("breed").value;
    //Selector for age range
    const ageRange = document.getElementById("ageRange").value;
    //Selector for pet image
    const petImage = document.getElementById("petImage");
    const file = petImage.files[0];

    //Checkboxes for behaviour
    const behaviourChoice = document.querySelectorAll('input[name="behaviour"]');
    let behaviourCheck = false;
    behaviourChoice.forEach(function(checkbox) {
        if (checkbox.checked) {
            behaviourCheck = true;
            return; // exit the loop early if at least one checkbox is checked
        }
    });

    //Textboxes for the first name and the last name
    const firstName = document.getElementById("firstName").value;

    //Textbox for the email
    const email = document.getElementById("email").value;
    let regexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //Pattern for a proper email (text@text.text)

    if((!catChoice.checked && !dogChoice.checked) || 
    breedChoice === "select" || 
    ageRange === "select" || 
    (!maleChoice.checked && !femaleChoice.checked) || 
    !behaviourCheck ||
    firstName === "" ||
    !file ||
    !regexPattern.test(email)){
        alert("Please fill in every field!");
    }

    else{
        document.getElementById("petForm").submit();
    }
}

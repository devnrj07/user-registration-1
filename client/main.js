//get hold of input fields
const inputs = document.querySelectorAll('input');
const form = document.querySelector('.user_details')
const submitBTN = document.getElementById('submitBtn');
const message = document.getElementById('message');
const capctcha = document.getElementById('captcha_container') || null;

let captchaResponse = '';

//patterns to match against(can use map too)
const patterns = {
    username: /^[a-z\d]{5,13}$/i,
    email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,4})(\.[a-z]{2,4})?$/g,
    password: /^[\w@-]{8,20}$/g,

};

//validation function
function validate(field, regex) {
    if (regex.test(field.value)) {
        field.className = "valid";

    } else {
        field.className = "invalid";

    }
}

inputs.forEach(input => {
    input.addEventListener('keyup', e => {
        //e.target.attributes.name.value returns name of the input field
        validate(e.target, patterns[e.target.attributes.name.value])
    })
})


//check if all the inputs are validate
function isValidForm(inputs) {
    validCount = 0;
    inputs.forEach(input => {
        if (input.classList.contains('valid')) {
            validCount++;
            console.log(validCount)

        }
    })

    if (validCount === 3) {
        return true;
    }

    return false;
}

//Registration
form.addEventListener('submit', async (e) => {
    e.preventDefault()


    const userData = {
        name: form.username.value,
        password: form.password.value,
        email: form.email.value
    };

    //check if its a valid form
    const validStatus = isValidForm(inputs);
    if (!validStatus) {
        //display notification to enter correct input
        message.innerHTML = 'please enter valid inputs'
        form.reset();

    } else {
        //send the request to the server
        const url = 'http://localhost:3999/api/users/add';
        const request = {

            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(userData)

        }

        await fetch(url, request)
            .then(data => data.json())
            .then(res => {
                message.innerHTML = res;
            })
            .catch(err => {
                console.log('something went wrong :', err)
                //message.innerHTML = err;
                alert('something went wrong! Please try again!');
            })
        resetForm(8000);
    }
});

//create a script tag and insert it dynamically
const loadCaptchaToDOM = () => {
    let script = document.createElement('script');
    script.src = "https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit";
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);
    form.reset();
    renderReCaptcha();
    submitBTN.disabled = true;
}


const renderReCaptcha = () => {

    captchaContainer = null;
    onloadCallback = function () {
        captchaContainer = grecaptcha.render('captcha_container', {
            'sitekey': '6LdRwOIUAAAAAAwa_3BK3wrfYO30-PGNo0yMhJHC',
            'callback': function (response) {
                ///console.log(response);
                captchaResponse = response;
                if (!response) {
                    alert('verfiy captcha first')
                    resetForm();
                }
                if (verifyCaptcha()) {
                    submitBTN.disabled = false;
                }
            }
        });
    };
}



//hit the server to determine if capctcha is needed
const check = async () => {
    await fetch('http://localhost:3999/api/captcha/status')
        .then(data => data.json())
        .then(res => {
            console.log(res)
            if (res) {
                loadCaptchaToDOM();

            }
        }).catch(err => console.log('error getting status :', err))
}

//captcha verification form backend
const verifyCaptcha = async () => {

    let status;

    //form.addEventListener('submit', async ()=>{
    //check length
    //document.getElementById('g-recaptcha-response').addEventListener('click', async () =>{
    if (captchaResponse.length > 0) {

        //console.log(captchaResponse)
        const request = {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ token: captchaResponse })

        }
        await fetch('http://localhost:3999/api/users/captcha', request)
            .then(data => data.json())
            .then(res => {
                //console.log('response for captcha :', res)
                status = res;
            }).catch(err => console.log("Error from capctha verification", err))


    } else {
        message.innerHTML = 'only Humans can Register!'
    }
    //this.removeEventListener('click',this,false);
    return status;
}



const resetForm = (duration = 100) => {
    setTimeout(function () {
        window.location.reload();
    }, duration)
}
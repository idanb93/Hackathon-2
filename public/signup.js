
const addNewCustomer = ()=>{

    const companyName = document.getElementById('companyName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if(!email || !companyName || !password){
        alert('Please fill all the fields!');
        return;
    }

    fetch('http://localhost:8080/signup', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body:JSON.stringify({
            companyName,
            email,
            password,
        })
    })
    .then(response => response.json())
    .then(data=>{
        alert(JSON.stringify(data));
        location.href = './signin.html';
    })
    .catch(err=>{
        console.log(err);
    })
}
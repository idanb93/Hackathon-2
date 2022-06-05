
const authenticate = () => {

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if(!email || !password){
        alert('Please fill all the fields!');
        return;
    }

    fetch('http://localhost:8080/signin', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password,
        })
    })
        .then(response => response.json())
        .then(data=>{
            alert(JSON.stringify(data));
            location.href = './dashboard.html';
        })
        .catch(err => {
            console.log(err);
        })

}
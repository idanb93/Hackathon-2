const addNewMachine = () => {

    const host = document.getElementById('host').value;
    const typeOfInstance = document.getElementById('typeOfInstance').value;
    const region = document.getElementById('region').value;

    if (!host || !typeOfInstance || !region) {
        alert('Please fill all the fields!');
        return;
    }

    fetch('http://localhost:8080/admin-page', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            host,
            typeOfInstance,
            region,
        })
    })
        .then(response => response.json())
        .then(data => {
            alert(JSON.stringify(data));
            if (data.msg === 'The session has ended, please login again!'){
                location.href = '/signin.html'
            } else {
                location.href = '/dashboard.html'
            }
        })
        .catch(err => {
            alert(err);
            location.href = '/signin.html'
        })
}

const signOut = () => {
    fetch('http://localhost:8080/signout')
        .then(response => response.json())
        .then(data => {
            alert(JSON.stringify(data));
            location.href = './signin.html';
        })
        .catch(err => {
            console.log(err);
        })
}
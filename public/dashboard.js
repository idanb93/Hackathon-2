
fetch('http://localhost:8080/dashboard')
.then(response => response.json())
.then(machinesByCompany=>{

    let mainSection = document.getElementById('main-section');

    // If there is no machines yet show a message on page:
    if(machinesByCompany.length === 0){

        let newDiv = document.createElement('div');
        newDiv.className = 'no-machines';

        let p = document.createElement('p');
        p.textContent = 'You have not added any machines yet...';
        p.style.fontSize = '20px';
        p.style.color = 'whitesmoke';

        newDiv.appendChild(p);
        mainSection.appendChild(newDiv);
    }

    if (machinesByCompany){
        mainSection.removeChild(mainSection.lastChild);
        
        machinesByCompany.forEach((machine)=>{
    
            let newDiv = document.createElement('div');
            newDiv.className = 'machine';
    
            let p1 = document.createElement('p');
            p1.textContent = machine['host'];
            let p2 = document.createElement('p');
            p2.textContent = machine['typeOfInstance'];
            let p3 = document.createElement('p');
            p3.textContent = machine['region'];
            
            newDiv.appendChild(p1);
            newDiv.appendChild(p2);
            newDiv.appendChild(p3);
    
            mainSection.appendChild(newDiv);
        })
    }

})
.catch(err => {
    console.log(err);
})

const signOut = ()=>{
    fetch('http://localhost:8080/signout')
    .then(response => response.json())
    .then(data=>{
        alert(JSON.stringify(data));
        location.href = './signin.html';
    })
        .catch(err => {
            console.log(err);
        })
}
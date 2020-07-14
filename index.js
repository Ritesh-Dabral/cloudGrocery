const getData = document.getElementById('getData');
const formData = document.getElementById('formData');

function setLi(ele){
    var li = document.createElement('li');
    var name = document.createElement('span');
    var quan = document.createElement('span');
    var cross = document.createElement('div');

    li.setAttribute('id',ele.id);
    name.textContent = ele.data().name;
    quan.textContent = ele.data().quantity;
    cross.innerText = 'X';

    li.appendChild(name);
    li.appendChild(quan);
    li.appendChild(cross);

    getData.appendChild(li);

    //add event to 'X'
    cross.addEventListener('click',(e)=>{
        var id = e.target.parentElement.getAttribute('id');
        console.log(id);
        db.collection('grocery').doc(id).delete();
    });
}

//get data
db.collection('grocery').get().then((storedata)=>{
    storedata.docs.forEach(element => {
        console.log(element.data());
        setLi(element);
    });
});

//set data
formData.addEventListener('submit',(e)=>{
    e.preventDefault();
    db.collection('grocery').add({
        name: formData.name.value,
        quantity: formData.quan.value
    });
    formData.name.value='';
    formData.quan.value='';
});

//add event to firebase
db.collection('grocery').onSnapshot(snap=>{
    let changes = snap.docChanges();
    
    //check type and run func.
    changes.forEach(change=>{
        if(change.type == "added"){
            setLi(change.doc);
            //change.doc.data() would give me obj of actual data
        }
        else if(change.type == "removed"){
            //as soon as an id gets 'removed' type, get it here, and remove it from list a well
            let li = getData.querySelector(`#${change.doc.id}`);
            getData.removeChild(li);
        }
    });
});
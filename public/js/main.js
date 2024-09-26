// FRONT-END (CLIENT) JAVASCRIPT HERE
const submit = async function( event ) {
  
  event.preventDefault()
  
  const wo = document.querySelector( 'input[name="wout"]:checked' ),
        dat = document.querySelector( "#date"),
        st = document.querySelector( "#stime"),
        et = document.querySelector( "#etime"),
        form = document.querySelector("form"),
        json = { workout: wo.value, date: dat.value, stime: st.value, etime: et.value},
        body = JSON.stringify( json );
  
  
  const response = await fetch( '/submit', {
    headers: {
      'Content-Type': 'application/json'
    },
    method:'POST',
    body 
  })

  const values = await response.json();
  
  window.onload();
}

function updateTable(values){
  const tbody = document.querySelector('tbody');

  tbody.innerHTML = '';
  values.forEach(value => {
    const [sh, sm] = value.stime.split(":"),
          [eh, em] = value.etime.split(":"),
          h = eh - sh,
          m = em - sm
    
    const element = document.createElement('tr'),
          save = document.createElement('button'),
          del = document.createElement('button')
    
        
    const wtd = document.createElement('td'),
          winp = document.createElement('select')
    
    wtd.className = "border-2 border-[#224050] p-2";
    
    winp.name = 'wout';
    
    const op1 = document.createElement('option'),
          op2 = document.createElement('option'),
          op3 = document.createElement('option'),
          op4 = document.createElement('option'),
          op5 = document.createElement('option')
    
    op1.value = 'Full Body';
    op2.value = 'Upper Body';
    op3.value = 'Lower Body';
    op4.value = 'Abs';
    op5.value = 'Cardio';
    
    op1.textContent = 'Full Body';
    op2.textContent = 'Upper Body';
    op3.textContent = 'Lower Body';
    op4.textContent = 'Abs';
    op5.textContent = 'Cardio';
    
    winp.appendChild(op1);
    winp.appendChild(op2);
    winp.appendChild(op3);
    winp.appendChild(op4);
    winp.appendChild(op5);
    
    winp.value = value.workout;
    wtd.appendChild(winp);
    
    const dtd = document.createElement('td'),
          dinp = document.createElement('input')
    
    dtd.className = "border-2 border-[#224050] p-2";
    
    dinp.type = 'date';
    dinp.value = value.date;
    dtd.appendChild(dinp);
    
    const sttd = document.createElement('td'),
          stnp = document.createElement('input')
    
    sttd.className = "border-2 border-[#224050] p-2";
    
    stnp.type = 'time';
    stnp.value = value.stime;
    sttd.appendChild(stnp);
    
    const ettd = document.createElement('td'),
          etnp = document.createElement('input')
    
    ettd.className = "border-2 border-[#224050] p-2";
    
    etnp.type = 'time';
    etnp.value = value.etime;
    ettd.appendChild(etnp);
    
    element.appendChild(wtd);
    element.appendChild(dtd);
    element.appendChild(sttd);
    element.appendChild(ettd);
    
    save.innerText = 'Save';
    save.className = "bg-[#8BDAFF] p-2 border-[#224050] border-2 rounded mx-2";

    save.addEventListener("click", async function(){
      
      const newVals = {
        _id: value._id,
        workout: element.querySelector('select[name="wout"]').value,
        date: element.querySelector('input[type="date"]').value,
        stime: element.querySelector('input[type="time"]').value,
        etime: element.querySelectorAll('input[type="time"]')[1].value
      }
      const body = JSON.stringify( newVals )
      
      
      const response = await fetch('/save', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( newVals )
      })
            
      window.onload();
     
    })
    
    del.innerText = 'Delete';
    del.className = "bg-[#8BDAFF] p-2 border-[#224050] border-2 rounded mx-2";
    del.addEventListener("click", async function(){
      const response = await fetch('/delete', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(value)
      })
      
      window.onload();
     
    })
    
    const ttd = document.createElement('td');
    
    ttd.className = "border-2 border-[#224050] p-2";
    
    ttd.innerHTML = `${h * 60 + m}`;
    element.appendChild(ttd);
    
    const tdsa = document.createElement('td');
    tdsa.className = "border-2 border-[#224050] p-2 text-center";
    tdsa.appendChild(save);
    element.appendChild(tdsa);
    
    const tddel = document.createElement('td');
    tddel.className = "border-2 border-[#224050] p-2 text-center";
    tddel.appendChild(del);
    element.appendChild( tddel );    
    
    tbody.appendChild(element);
  })
  
}


window.onload = async function() {
  
  const response = await fetch( '/gets' );
  
  const values = await response.json();
  
  updateTable(values);
  
  const button = document.querySelector("button");
  button.onclick = submit;
}
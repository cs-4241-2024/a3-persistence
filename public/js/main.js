const handleSubmit = async(title, type, store, price, coh) => { 
    const body = JSON.stringify({ 
      "title": title, 
      "category": type, 
      "store": store, 
      "price": price, 
      "cashOnHand": coh
    }); 
     const getResults = await(await fetch('/addPurchase', {
      method: 'POST', 
      body
    })).json(); 
    buildTable(getResults["data"], 'dummy'); 
  }

  
  const handleDelete = async (title) => {
    
    const modal = document.getElementById('deleteDialog'); 
    const body = JSON.stringify({
      "title": title
    }); 
    const data = await(await fetch('/deletePurchase', {
      method: 'POST', 
      body
    })).json(); 
    buildTable(data["data"], "dummy");
  

    modal.close(); 
  }
  const handleUpdate = async (title, newTitle, newType, newStore, newPrice, newCoh) => { 
    const body = JSON.stringify({
      "oldTitle": title, 
      "title": newTitle, 
      "category": newType, 
      "store": newStore, 
      "price": newPrice, 
      "cashOnHand": newCoh
    }); 
    const makeRequest = await(await fetch('/updatePurchase', {
      method: 'POST', 
      body
    })).json(); 
    buildTable(makeRequest["data"], 'dummy'); 

   
  
  
  }
  const buildTable = (res, mode) => { 
    resultsTable.innerHTML = ''; 
    res.map((item, idx) => {
  
  
    
    const title = item['title']; 
    const category = item['category']; 
    const store = item['store']; 
    const price = item['price']; 
    const cashOnHand = item['cashOnHand']; 
    const affordable = item['affordable']; 
    const resultsTable = document.getElementById('resultsTable'); 
  
    
    const resultRow = document.createElement('tr'); 
  
    const resultTitle = document.createElement('td'); 
        resultTitle.innerHTML = title; 
      if(idx === 0){
  
    
       const headers = document.createElement('tr'); 
       const purchaseHeader = document.createElement('th'); 
       purchaseHeader.innerHTML = 'Purchase Title'; 
       const categoryHeader = document.createElement('th'); 
       categoryHeader.innerHTML = 'Category'; 
       const storeHeader = document.createElement('th'); 
       storeHeader.innerHTML = 'Store'; 
       const priceHeader = document.createElement('th'); 
       priceHeader.innerHTML = 'Price'; 
       
       const cohHeader = document.createElement('th'); 
       cohHeader.innerHTML = 'Cash On Hand'
       const affoardableHeader=document.createElement('th'); 
       affoardableHeader.innerHTML = 'Affordable?'; 
       const editHeader = document.createElement('th'); 
       editHeader.innerHTML = 'edit/delete'
       headers.appendChild(purchaseHeader); 
       headers.appendChild(categoryHeader); 
       headers.appendChild(storeHeader); 
       headers.appendChild(priceHeader); 
       headers.append(cohHeader); 
       headers.append(affoardableHeader); 
       headers.append(editHeader); 
       resultsTable.appendChild(headers); 
      }
  
        const resultCategory = document.createElement('td'); 
        resultCategory.innerHTML = category; 
        const resultStore = document.createElement('td'); 
        resultStore.innerHTML = store; 
        const resultPrice = document.createElement('td'); 
        resultPrice.innerHTML = price; 
        const resultCOH =  document.createElement('td');
        resultCOH.innerHTML = cashOnHand; 
        const resultAffoardable = document.createElement('td'); 
        resultAffoardable.innerHTML = affordable; 
        const editButton = document.createElement('button'); 
        editButton.innerHTML = 'update Item'; 
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'delete item'; 
        
        resultRow.appendChild(resultTitle); 
        resultRow.appendChild(resultCategory); 
        resultRow.appendChild(resultStore)
        resultRow.appendChild(resultPrice)
        resultRow.appendChild(resultCOH)
        resultRow.appendChild(resultAffoardable); 
        resultRow.appendChild(editButton); 
        resultRow.appendChild(deleteButton); 
        
        resultsTable.appendChild(resultRow); 
        editButton.addEventListener('click', (event) =>{
         
          handleEditClick(event, resultTitle.innerHTML, resultCategory.innerHTML, resultStore.innerHTML, resultPrice.innerHTML, resultCOH.innerHTML);
        }); 
        deleteButton.addEventListener('click', () => {
          handleDelete(resultTitle.innerHTML); 
          
        })
      })
  
  
  }
  const handleEditClick = (event, oldTitle, category, store, price, coh, ) => { 
    event.preventDefault(); 

    const modal = document.getElementById('deleteDialog'); 
    document.getElementById('updatetitle').value = oldTitle; 
    document.getElementById('updatetypes').value = category;
    document.getElementById('updatestore').value = store; 
    document.getElementById('updateprice').value = price; 
    document.getElementById('updatecoh').value = coh;  
    modal.showModal();
    const deleteButton = document.getElementById('deletePurchase'); 
    deleteButton.addEventListener('click', (event) => { 
      event.preventDefault(); 
      handleDelete(oldTitle); 
      modal.close(); 
    })
    const buttonUpdate = document.getElementById('submitUpdates'); 
    const runClick = (event) => {
      event.preventDefault();
              
      const newtitle = document.getElementById('updatetitle').value; 
      const newType = document.getElementById('updatetypes').value; 
      const newStore =  document.getElementById('updatestore').value; 
      const newPrice = document.getElementById('updateprice').value; 
      const newCoh = document.getElementById('updatecoh').value; 
      handleUpdate(oldTitle, newtitle, newType, newStore, newPrice, newCoh); 
      oldTitle = newtitle; 
      const updatedArr = []; 
     
     
      modal.close(); 
      buttonUpdate.removeEventListener('click', runClick); 
    }; 



    
    buttonUpdate.addEventListener('click', runClick) ; 
   

  }
  
  
  
  window.onload =  function() {
    //logic for creating a new item 
     const form = document.getElementById('budgetForm'); 
     form.addEventListener("submit", (event) => { 
      event.preventDefault(); 
      const title = document.getElementById('title').value; 
      const type = document.getElementById('types').value; 
      const store = document.getElementById('store').value; 
      const price = document.getElementById('price').value; 
      const coh = document.getElementById('coh').value; 
  
      
      form.onsubmit=  handleSubmit(title, type, store, price, coh ).then(); 
  
     }); 
  }
  
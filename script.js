const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

const currencySelect = document.getElementById('currency');
let currency  = 'TND'
currencySelect.addEventListener('change', (e)=>{
    currency = e.target.value
    updateValues();
})

//const dummyTransactions= [
//    {id: 1, text:'Flower', amount: -20},
//    {id: 2, text:'Salary', amount: 300},
//    {id: 3, text:'Book', amount: -10},
//    {id: 4, text:'Camera', amount: 150}
//];

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];


//Add transactiom
function addTransaction(e){
    e.preventDefault();

    if(text.value.trim() === '' || amount.value.trim()===''){
        alert('Please add a text and amount');
    } else {
        const transaction = { 
            id: generateID(),
            text: text.value,
            amount: +amount.value,
            createdAt: new Date()
        };

       

    transactions.push(transaction);

    addTransactionDOM(transaction);

    updateValues();

    updateLocalStorage();

    text.value= '';
    amount.value= '';
    }
}

//Generate random ID
function generateID(){
    return Math.floor(Math.random() * 100000000 );
}

//Add transactions to DOM list

function addTransactionDOM(transaction){
    //get sign
    const sign = transaction.amount < 0 ? '-' : '+';

    const item = document.createElement('li');

    //Add class based on value 

    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    let {id, text, amount, createdAt} = transaction;
    let time = new Date(createdAt);
    let timerender = time.toLocaleDateString() + " " + time.toLocaleTimeString()

    item.innerHTML = `
    ${text} <span>${sign}${Math.abs(amount)}
    </span> <span id="timestamp">${timerender}</span> <button class= "delete-btn" onclick="removeTransaction(${id})">✖</button>
    `;
    list.appendChild(item);
}

//update balance income and expense

function updateValues(){
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    const income = amounts
                            .filter(item => item > 0)
                            .reduce((acc, item) => ( acc+= item), 0)
                            .toFixed(2);

    const expense = 
                    (amounts
                    .filter(item => item < 0)
                    .reduce((acc,item) => (acc +=item), 0) * -1)
                    .toFixed(2);      
                    
    balance.innerText =  `${total} ${currency}`;
    money_plus.innerText = `${income} ${currency}`;
    money_minus.innerText = `${expense} ${currency}`;    
    
    if ( total < 0 ){
        console.log('negative')
        document.getElementById('balance').classList.add('negative');
    }

    if ( total >= 0 ){
        console.log('pos')
        document.getElementById('balance').classList.remove('negative');
    }


}

//Remove transaction by ID
function removeTransaction(id){
    transactions = transactions.filter(transaction => transaction.id !== id);
    
    updateLocalStorage();
   
    init();
    
}

//Update local storage transactions 
function updateLocalStorage(){
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

//init app 
function init(){
    list.innerHTML='';

    transactions.forEach(addTransactionDOM);
    updateValues();    
    
    
}

init();

form.addEventListener('submit', addTransaction);
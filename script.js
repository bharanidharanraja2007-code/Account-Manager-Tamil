// ===========================
// பரணி புடவை கணக்கு மேலாளர்
// பகுதி 1
// ===========================

let customers = JSON.parse(localStorage.getItem("customers")) || [];
let totalCollection = Number(localStorage.getItem("totalCollection")) || 0;
let monthHistory = JSON.parse(localStorage.getItem("monthHistory")) || [];
let editIndex = -1;

// செயலி தொடங்கும்போது
window.onload = function () {

    customers.forEach(c => {

        if (!c.status) {
            c.status = "pending";
        }

    });

    saveData();

    document.getElementById("total").innerHTML =
        "₹" + totalCollection;

    displayCustomers(customers);

};

// தரவுகளை சேமி
function saveData() {

    localStorage.setItem(
        "customers",
        JSON.stringify(customers)
    );

    localStorage.setItem(
        "totalCollection",
        totalCollection
    );

    localStorage.setItem(
        "monthHistory",
        JSON.stringify(monthHistory)
    );

}

// வாடிக்கையாளர்களை காட்டு
function displayCustomers(list = customers) {

    let customerList = document.getElementById("customerList");
    customerList.innerHTML = "";

    list.forEach((c) => {

    let index = customers.indexOf(c);

        customerList.innerHTML += `
        <div class="customer">

        <b>📅 தேதி :</b> ${c.date}<br><br>

        <b>👤 வாடிக்கையாளர் :</b> ${c.name}<br><br>

        <b>நிலை :</b>

${c.status==="visited"
?
"🟢 இந்த மாதம் சந்திக்கப்பட்டார்"
:
"🔴 இன்னும் சந்திக்கவில்லை"}

<br><br>
        <b>📞 தொலைபேசி :</b> ${c.phone}<br><br>

        <b>💰 பழைய பாக்கி :</b> ₹${c.balance}<br>

        <b>🛍 வாங்கிய தொகை :</b> ₹${c.purchase}<br>

        <b>💵 கையில் செலுத்தியது :</b> ₹${c.paymentHand}<br>

        <b>📱 GPay மூலம் செலுத்தியது :</b> ₹${c.paymentGpay}<br>

        <b>💳 மொத்தம் செலுத்தியது :</b> ₹${c.payment}<br>

        <b>🧾 புதிய பாக்கி :</b> ₹${c.newBalance}<br><br>

        <div class="actionButtons">

        <button class="editBtn"
        onclick="editCustomer(${index})">
        ✏️ திருத்து
        </button>

        <button class="deleteBtn"
        onclick="deleteCustomer(${index})">
        🗑 நீக்கு
        </button>

        <button class="shareBtn"
        onclick="shareCustomer(${index})">
        📤 WhatsApp பகிர்
        </button>

        </div>

        </div>
        `;
    });

    document.getElementById("total").innerHTML =
"₹" + totalCollection;

}

// வாடிக்கையாளரை தேடு
function searchCustomer() {

    let keyword = document
        .getElementById("search")
        .value
        .toLowerCase();

    let result = customers.filter(c =>
        c.name.toLowerCase().includes(keyword)
    );

    displayCustomers(result);

}

// ===========================
// பகுதி 2
// வாடிக்கையாளரை சேர் & திருத்து
// ===========================

function addCustomer() {

    let name = document.getElementById("name").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let balance = Number(document.getElementById("balance").value);
    let purchase = Number(document.getElementById("purchase").value);
    let paymentHand = Number(document.getElementById("paymentHand").value);
    let paymentGpay = Number(document.getElementById("paymentGpay").value);

    if (
        name == "" ||
        phone == "" ||
        isNaN(balance) ||
        isNaN(purchase) ||
        isNaN(paymentHand) ||
        isNaN(paymentGpay)
    ) {
        alert("அனைத்து விவரங்களையும் நிரப்பவும்.");
        return;
    }

    let payment = paymentHand + paymentGpay;
    let newBalance = (balance + purchase) - payment;

    let now = new Date();

    let date =
now.getFullYear() + "-" +
String(now.getMonth() + 1).padStart(2, "0") + "-" +
String(now.getDate()).padStart(2, "0") + " " +
String(now.getHours()).padStart(2, "0") + ":" +
String(now.getMinutes()).padStart(2, "0") + ":" +
String(now.getSeconds()).padStart(2, "0");

    let customer = {

        name,
        phone,
        balance,
        purchase,
        paymentHand,
        paymentGpay,
        payment,
        newBalance,

        date,

        lastVisit: date,

        status: "visited"

    };
    // திருத்தும் நிலை
    if (editIndex >= 0) {

        totalCollection -= customers[editIndex].payment;

        customers[editIndex] = customer;

        customers[editIndex].status = "visited";

        totalCollection += payment;

        editIndex = -1;

document.querySelector("button").innerHTML ="➕ வாடிக்கையாளரை சேர்";

    } else {

        customers.push(customer);

        totalCollection += payment;

    }

    saveData();

    displayCustomers();

    clearForm();

}

// ===========================
// வாடிக்கையாளரை திருத்து
// ===========================

function editCustomer(index) {

    let c = customers[index];

    document.getElementById("name").value = c.name;
    document.getElementById("phone").value = c.phone;
    document.getElementById("balance").value = c.balance;
    document.getElementById("purchase").value = c.purchase;
    document.getElementById("paymentHand").value = c.paymentHand;
    document.getElementById("paymentGpay").value = c.paymentGpay;

    editIndex = index;

    document.querySelector("button").innerHTML =
"💾 வாடிக்கையாளரை புதுப்பி";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

// ===========================
// வாடிக்கையாளரை நீக்கு
// ===========================

function deleteCustomer(index) {

    let confirmDelete = confirm(
        "இந்த வாடிக்கையாளரை நீக்க வேண்டுமா?"
    );

    if (!confirmDelete) return;

    totalCollection -= customers[index].payment;

    customers.splice(index, 1);

    saveData();

    displayCustomers();

}

// ===========================
// உள்ளீட்டு பெட்டிகளை காலி செய்
// ===========================

function clearForm() {

    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("balance").value = "";
    document.getElementById("purchase").value = "";
    document.getElementById("paymentHand").value = "";
    document.getElementById("paymentGpay").value = "";

    editIndex = -1;

    document.querySelector("button").innerHTML =
"➕ வாடிக்கையாளரை சேர்";

}
// ===========================
// அனைத்து தகவல்களையும் அழி
// ===========================

function resetAllData() {

    let ok = confirm(
        "அனைத்து வாடிக்கையாளர் பதிவுகளையும் நீக்க வேண்டுமா?\nஇந்த செயலியை திரும்பப் பெற முடியாது."
   );
    if (!ok) return;

    customers = [];
    totalCollection = 0;

    saveData();

    displayCustomers();

    clearForm();

    alert("அனைத்து வாடிக்கையாளர் பதிவுகளும் வெற்றிகரமாக நீக்கப்பட்டன.");

}

// மொத்த வசூலை புதுப்பி
document.getElementById("total").innerHTML = "₹" + totalCollection;

// ===========================
// பரணி புடவை கணக்கு மேலாளர்
// பதிப்பு 2.0
// ===========================

// WhatsApp பகிர்வு
function shareCustomer(index){

    let c = customers[index];

    let message =
`🧾 Bharani Saree Account Manager

👤 Customer : ${c.name}
📞 Phone : ${c.phone}

💰 Balance : ₹${c.balance}
🛍 Purchase : ₹${c.purchase}

💵 Hand Payment : ₹${c.paymentHand}
📱 GPay Payment : ₹${c.paymentGpay}

💳 Total Paid : ₹${c.payment}

🧾 New Balance : ₹${c.newBalance}

📅 ${c.date}`;

    if (navigator.share) {
    navigator.share({
        title: "Bharani Saree Account Manager",
        text: message
    });
} else {
    navigator.clipboard.writeText(message);
    alert("Customer details copied. Paste it in WhatsApp.");
}

}
// ===========================
// காப்பு நகல் உருவாக்கு
// ===========================

function backupData(){

    let data = {
        customers,
        totalCollection
    };

    let blob = new Blob(
        [JSON.stringify(data,null,2)],
        {type:"application/json"}
    );

    let link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

link.download = "பரணி_புடவை_கணக்கு_காப்புநகல்.json";

    link.click();

}

// ===========================
// காப்பு நகலை மீட்டமை
// ===========================

function restoreData(event){

    let file = event.target.files[0];

    if(!file) return;

    let reader = new FileReader();

    reader.onload = function(e){

        let data = JSON.parse(e.target.result);

        customers = data.customers || [];

totalCollection = data.totalCollection || 0;

        saveData();

        displayCustomers();

        alert("காப்பு நகல் வெற்றிகரமாக மீட்டமைக்கப்பட்டது.");

    };

    reader.readAsText(file);

}

// ===========================
// மாத அறிக்கை
// ===========================

function showMonthlyReport(){

    let visited = customers.filter(c => c.status === "visited");

    let totalCustomers = visited.length;

    let totalPurchase = visited.reduce((sum, c) => sum + c.purchase, 0);

    let totalHand = visited.reduce((sum, c) => sum + c.paymentHand, 0);

    let totalGPay = visited.reduce((sum, c) => sum + c.paymentGpay, 0);

    let totalCollection = visited.reduce((sum, c) => sum + c.payment, 0);

    let totalPending = customers.reduce((sum, c) => sum + c.newBalance, 0);

    alert(

`📊 மாத அறிக்கை

👥 மொத்த வாடிக்கையாளர்கள் : ${totalCustomers}

🛍 மொத்த வாங்கிய தொகை : ₹${totalPurchase}

💵 கையில் வசூலித்த தொகை : ₹${totalHand}

📱 GPay மூலம் வசூலித்த தொகை : ₹${totalGPay}

💰 மொத்த வசூல் : ₹${totalCollection}

📒 மொத்த நிலுவை : ₹${totalPending}`

    );

}
// ===========================
// தேதி மூலம் தேடுதல்
// ===========================

function filterByDateRange() {

    let from = document.getElementById("fromDate").value;
    let to = document.getElementById("toDate").value;

    if (from === "" || to === "") {
        alert("தயவுசெய்து தொடக்க தேதி மற்றும் முடிவு தேதியை தேர்வு செய்யவும்.");
        return;
    }

    let filtered = customers.filter(c => {
        let customerDate = c.date.substring(0, 10);
        return customerDate >= from && customerDate <= to;
    });

    displayCustomers(filtered);

}

// ===========================
// அனைத்து வாடிக்கையாளர்களையும் காட்டு
// ===========================

function showAllCustomers(){

    displayCustomers(customers);

    document.getElementById("search").value = "";

}

// தற்போதைய தேதி
let now = new Date();

let date =
now.getFullYear() + "-" +
String(now.getMonth() + 1).padStart(2, "0") + "-" +
String(now.getDate()).padStart(2, "0") + " " +
String(now.getHours()).padStart(2, "0") + ":" +
String(now.getMinutes()).padStart(2, "0") + ":" +
String(now.getSeconds()).padStart(2, "0");

// ===========================
// இந்த மாதம் சந்தித்த வாடிக்கையாளர்கள்
// ===========================

function showVisitedCustomers(){

    let visited = customers.filter(c => c.status === "visited");

    if(visited.length === 0){
        alert("இந்த மாதம் சந்தித்த வாடிக்கையாளர்கள் இல்லை.");
        return;
    }

    displayCustomers(visited);

}

// ===========================
// இன்னும் சந்திக்க வேண்டிய வாடிக்கையாளர்கள்
// ===========================

function showPendingCustomers(){

    let pending = customers.filter(c => c.status === "pending");

    if(pending.length === 0){
        alert("சந்திக்க வேண்டிய வாடிக்கையாளர்கள் இல்லை.");
        return;
    }

    displayCustomers(pending);

}
// ===========================
// புதிய மாதம் தொடங்கு
// ===========================
function resetMonthlyCycle(){

    let ok = confirm(
`⚠️ புதிய மாதத்தை தொடங்கவா?

இதை செய்தால்:

✅ தற்போதைய மாத வரலாறு சேமிக்கப்படும்
✅ அனைத்து வாடிக்கையாளர்களும் "நிலுவை" நிலைக்கு மாற்றப்படுவார்கள்
✅ மாதாந்திர சுருக்கம் அழிக்கப்படும்

தொடரவா?`
    );

    if(!ok) return;

    let visited = customers.filter(c => c.status === "visited");

    let pending = customers.filter(c => c.status === "pending");

    // Summary Calculation
    let totalPurchase = visited.reduce((sum, c) => sum + c.purchase, 0);

    let totalHand = visited.reduce((sum, c) => sum + c.paymentHand, 0);

    let totalGPay = visited.reduce((sum, c) => sum + c.paymentGpay, 0);

    let monthlyCollection = visited.reduce((sum, c) => sum + c.payment, 0);

    // Pending = ALL customers
    let totalPending = customers.reduce((sum, c) => sum + c.newBalance, 0);

    let now = new Date();

    monthHistory.push({

        month: now.toLocaleString("default",{
            month:"long",
            year:"numeric"
        }),

        visitedCustomers: JSON.parse(JSON.stringify(visited)),

        pendingCustomers: JSON.parse(JSON.stringify(pending)),

        totalCustomers: customers.length,

        totalPurchase: totalPurchase,

        totalHand: totalHand,

        totalGPay: totalGPay,

        totalCollection: monthlyCollection,

        totalPending: totalPending

    });

    customers.forEach(c=>{

        c.status = "pending";

        c.balance = 0;

        c.purchase = 0;
        c.paymentHand = 0;
        c.paymentGpay = 0;
        c.payment = 0;

        // newBalance reset ஆகாது
    });

    totalCollection = 0;

    saveData();

    displayCustomers();

    alert("✅ புதிய மாதம் வெற்றிகரமாக தொடங்கப்பட்டது!");

}

function showMonthHistory(){
  
   if(monthHistory.length===0){

        alert("No Month History");

        return;

    }

    let html="";

    monthHistory.forEach((m,index)=>{

        html+=`

        <div class="historyCard">

        <h3>${m.month}</h3>

        👥 மொத்த வாடிக்கையாளர்கள் :
${m.totalCustomers}<br>

✅ இந்த மாதம் சந்தித்தவர்கள் :
${m.visitedCustomers.length}<br>

📌 சந்திக்க வேண்டியவர்கள் :
${m.pendingCustomers.length}<br>

🛍️ மொத்த வாங்கிய தொகை :
₹${m.totalPurchase}<br>

💵 கையில் வசூல் :
₹${m.totalHand}<br>

📱 GPay வசூல் :
₹${m.totalGPay}<br>

💰 மொத்த வசூல் :
₹${m.totalCollection}<br>

📒 மொத்த நிலுவை :
₹${m.totalPending}<br><br>

       <button
       onclick="viewHistory(${index})">
       
       <button onclick="viewHistory(${index})">
       👁 முழு விவரம்
       </button>

       <button
onclick="shareMonthHistory(${index})">
       📤 WhatsApp பகிர்
        </button>

        </div>

        `;

    });

document.getElementById("historyList").innerHTML = html;

document.getElementById("historyScreen").style.display = "flex";

}
function closeHistory(){

document.getElementById("historyScreen").style.display="none";

}
function viewHistory(index){

    let m=monthHistory[index];

    let text=`📅 ${m.month}\n\n`;

    text+="✅ Visited Customers\n\n";

    m.visitedCustomers.forEach(c=>{

        text+=
`${c.name}
📞 ${c.phone}
💰 Balance : ₹${c.newBalance}

`;

    });

    text+="\n📌 Pending Customers\n\n";

    m.pendingCustomers.forEach(c=>{

        text+=
`${c.name}
📞 ${c.phone}
💰 Balance : ₹${c.newBalance}

`;

    });

    alert(text);

}
function viewHistory(index){

    let m = monthHistory[index];

    let html = `

    <div class="historyCard">

    <h2>📅 ${m.month}</h2>

    <h3>✅ இந்த மாதம் சந்தித்த வாடிக்கையாளர்கள்</h3>

    `;

    m.visitedCustomers.forEach(c=>{

        html += `
        <p>

        👤 ${c.name}<br>

        📞 ${c.phone}<br>

        💰 புதிய பாக்கி : ₹${c.newBalance}

        </p>

        <hr>
        `;

    });

    html += `

    <h3>📌 சந்திக்க வேண்டிய வாடிக்கையாளர்கள்</h3>

    `;

    m.pendingCustomers.forEach(c=>{

        html += `
        <p>

        👤 ${c.name}<br>

        📞 ${c.phone}<br>

        💰 புதிய பாக்கி : ₹${c.newBalance}

        </p>

        <hr>
        `;

    });

    html += `

    <br>

    <button onclick="deleteHistory(${index})">
    🗑 இந்த மாத வரலாற்றை நீக்கு
    </button>

    <br><br>

    <button onclick="showMonthHistory()">
    🔙 மாத வரலாற்றிற்கு செல்
    </button>

    </div>
    `;

document.getElementById("historyList").innerHTML = html;

}
function shareMonthHistory(index){

    let m = monthHistory[index];

    let msg =
`📊 ${m.month} மாத அறிக்கை

👥 மொத்த வாடிக்கையாளர்கள் : ${m.totalCustomers}

✅ வாங்கியவர்கள் : ${m.visitedCustomers.length}

📌 நிலுவையில் உள்ளவர்கள் : ${m.pendingCustomers.length}

🛍 மொத்த வாங்குதல் : ₹${m.totalPurchase}

💵 ரொக்க வசூல் : ₹${m.totalHand}

📱 GPay வசூல் : ₹${m.totalGPay}

💰 மொத்த வசூல் : ₹${m.totalCollection}

📒 மொத்த நிலுவை : ₹${m.totalPending}

━━━━━━━━━━━━━━━━━━
✅ வாங்கிய வாடிக்கையாளர்கள்
━━━━━━━━━━━━━━━━━━
`;

    m.visitedCustomers.forEach((c,i)=>{

        msg +=
`${i+1}. ${c.name}
📞 தொலைபேசி : ${c.phone}
💰 நிலுவை : ₹${c.newBalance}
🛍 வாங்குதல் : ₹${c.purchase}
💵 ரொக்கம் : ₹${c.paymentHand}
📱 GPay : ₹${c.paymentGpay}
💳 செலுத்தியது : ₹${c.payment}
📅 கடைசி வருகை : ${c.lastVisit}

`;

    });

    msg +=
`━━━━━━━━━━━━━━━━━━
📌 நிலுவையில் உள்ள வாடிக்கையாளர்கள்
━━━━━━━━━━━━━━━━━━
`;

    m.pendingCustomers.forEach((c,i)=>{

        msg +=
`${i+1}. ${c.name}
📞 தொலைபேசி : ${c.phone}
💰 நிலுவை : ₹${c.newBalance}
🛍 வாங்குதல் : ₹${c.purchase}
💵 ரொக்கம் : ₹${c.paymentHand}
📱 GPay : ₹${c.paymentGpay}
💳 செலுத்தியது : ₹${c.payment}
📅 கடைசி வருகை : ${c.lastVisit}

`;

    });

    window.open(
        "https://wa.me/?text=" + encodeURIComponent(msg),
        "_blank"
    );

}
function deleteHistory(index){
  
      let ok = confirm(

`Delete this month history?

This cannot be undone.`

    );

    if(!ok) return;
    
   monthHistory.splice(index,1);
   
   saveData();
   
   showMonthHistory();
   
}

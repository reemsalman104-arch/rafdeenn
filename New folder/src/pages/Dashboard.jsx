import React, { useState } from "react";
import "../foldcss/dashboard.css";

function Dashboard() {

const [tab,setTab] = useState("wheel")

const [names,setNames] = useState([])
const [inputName,setInputName] = useState("")

const [users,setUsers] = useState([
{ id:1,name:"Reem",email:"reem@mail.com",phone:"059111111",status:"لم يتم"},
{ id:2,name:"Sara",email:"sara@mail.com",phone:"059222222",status:"تم التسليم"},
])

function addName(){

if(inputName.trim()==="") return

setNames([...names,inputName])
setInputName("")

}

function deleteName(index){

const newNames=[...names]
newNames.splice(index,1)
setNames(newNames)

}

function deleteUser(id){

setUsers(users.filter(user=>user.id!==id))

}

function changeStatus(id,value){

setUsers(users.map(user=>
user.id===id ? {...user,status:value} : user
))

}

return(

<div className="dashboard">

{/* NAVBAR */}

<div className="navbar">

<button
className={`nav-btn ${tab==="wheel"?"active":""}`}
onClick={()=>setTab("wheel")}
>
تعديل الدولاب
</button>

<button
className={`nav-btn ${tab==="data"?"active":""}`}
onClick={()=>setTab("data")}
>
تعديل البيانات
</button>

<button className="logout-btn">
تسجيل خروج
</button>

</div>


{/* CONTENT */}

<div className="content">

{/* WHEEL TAB */}

{tab==="wheel" && (

<div className="wheel-edit">

<div className="add-box">
  <input
type="file"
placeholder="حمل فيديو"
accept="video/*"
value={inputName}

onChange={(e)=>setInputName(e.target.value)}
/>

<button className="button1">
اضافة
</button>

<input

type="text"
placeholder="ادخل اسم"
value={inputName}
onChange={(e)=>setInputName(e.target.value)}
/>

<button onClick={addName} className="button2">
اضافة
</button>

</div>

<div className="names-list">

{names.map((name,index)=>(

<div className="name-item" key={index}>

<span>{name}</span>

<button
className="delete-btn"
onClick={()=>deleteName(index)}
>
حذف
</button>

</div>

))}

</div>

</div>

)}


{/* DATA TAB */}

{tab==="data" && (

<div className="table-box">

<table>

<thead>

<tr>

<th>الاسم</th>
<th>البريد</th>
<th>الرقم</th>
<th>الحالة</th>
<th>Action</th>

</tr>

</thead>

<tbody>

{users.map(user=>(

<tr key={user.id}>

<td>{user.name}</td>
<td>{user.email}</td>
<td>{user.phone}</td>

<td>

<select
value={user.status}
onChange={(e)=>changeStatus(user.id,e.target.value)}
>

<option>لم يتم</option>
<option>تم التسليم</option>

</select>

</td>

<td>

<button
className="delete-btn"
onClick={()=>deleteUser(user.id)}
>
حذف
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

)}

</div>

</div>

)

}

export default Dashboard
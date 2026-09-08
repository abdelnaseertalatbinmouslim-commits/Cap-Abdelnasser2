import { db, functions } from "./firebase-config.js";
import { ref, push, get } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";
import { httpsCallable } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-functions.js";
const form=document.getElementById("registerForm"),msg=document.getElementById("registerMsg");
const normalize=p=>String(p||"").replace(/\D/g,"");
form.addEventListener("submit",async e=>{e.preventDefault();msg.textContent="جاري إرسال الطلب...";
 const name=document.getElementById("name").value.trim(),phone=document.getElementById("phone").value.trim(),grade=document.getElementById("grade").value,pin=document.getElementById("pin").value.trim(),pin2=document.getElementById("pin2").value.trim();
 if(name.length<3){msg.textContent="اكتب الاسم بالكامل.";return} if(!/^01\d{9}$/.test(normalize(phone))){msg.textContent="رقم الهاتف غير صحيح.";return} if(pin!==pin2){msg.textContent="الـPIN غير متطابق.";return} if(!/^\d{4,8}$/.test(pin)){msg.textContent="الـPIN لازم يكون من 4 إلى 8 أرقام.";return}
 try{const snap=await get(ref(db,"students"));let exists=false;snap.forEach(c=>{if(normalize(c.val()?.phone)===normalize(phone))exists=true});if(exists){msg.textContent="رقم الهاتف مسجل بالفعل.";return}
 const result=await push(ref(db,"students"),{name,phone:normalize(phone),grade,pin:Number(pin),status:"pending",createdAt:new Date().toISOString(),lastActive:null});
 msg.textContent="تم إرسال الطلب بنجاح. انتظر موافقة الإدارة.";form.reset();}
 catch(err){console.error(err);msg.textContent="تعذر إرسال الطلب. تأكد من Firebase Rules واتصال الإنترنت."}});

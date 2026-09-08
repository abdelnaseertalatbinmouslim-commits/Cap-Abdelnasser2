const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onValueCreated, onValueWritten } = require("firebase-functions/v2/database");
const admin = require("firebase-admin");
admin.initializeApp();

const normalize = p => String(p || "").replace(/\D/g, "");
async function sendTelegram(text){
  const token=process.env.TELEGRAM_BOT_TOKEN, chatId=process.env.TELEGRAM_CHAT_ID;
  if(!token || !chatId) return;
  const r=await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:chatId,text})});
  if(!r.ok) console.error("Telegram HTTP error",await r.text());
}

exports.studentLogin = onCall({ region:"us-central1", enforceAppCheck:false }, async request => {
  const phone=normalize(request.data?.phone), pin=String(request.data?.pin||"");
  if(!/^01\d{9}$/.test(phone) || !/^\d{4,8}$/.test(pin)) throw new HttpsError("invalid-argument","Invalid credentials");
  const snap=await admin.database().ref("students").get(); let found=null;
  snap.forEach(child=>{const s=child.val()||{}; if(!found && normalize(s.phone)===phone) found={id:child.key,...s};});
  if(!found || String(found.pin)!==pin) throw new HttpsError("unauthenticated","Invalid credentials");
  if(found.status!=="approved") throw new HttpsError("permission-denied",found.status==="pending"?"pending":"rejected");
  const uid=`student_${found.id}`; const token=await admin.auth().createCustomToken(uid,{role:"student",studentId:found.id});
  await admin.database().ref(`students/${found.id}`).update({lastActive:new Date().toISOString()});
  return {token,studentId:found.id,studentName:found.name||""};
});

exports.telegramNewRegistration = onValueCreated({ref:"/students/{studentId}",region:"us-central1"}, async event=>{
  const s=event.data.val()||{}; await sendTelegram(["🟡 Coach AbdelNasser","طلب تسجيل جديد",`الاسم: ${s.name||"-"}`,`الهاتف: ${s.phone||"-"}`,`الفرقة: ${s.grade||"-"}`,`الوقت: ${new Date().toLocaleString("ar-EG")}`].join("\n"));
});

exports.telegramStudentDecision = onValueWritten({ref:"/students/{studentId}/status",region:"us-central1"}, async event=>{
  if(!event.data.after.exists()) return; const before=event.data.before.val(), after=event.data.after.val(); if(before===after || !["approved","rejected"].includes(after)) return;
  const s=(await admin.database().ref(`students/${event.params.studentId}`).get()).val()||{}; await sendTelegram(["🔔 Coach AbdelNasser",after==="approved"?"تم قبول الطالب":"تم رفض الطالب",`الاسم: ${s.name||"-"}`,`الهاتف: ${s.phone||"-"}`,`الفرقة: ${s.grade||"-"}`,`الوقت: ${new Date().toLocaleString("ar-EG")}`].join("\n"));
});

// test-fetch.mjs
const res = await fetch(
  "https://kaakjseyjzwmbsdptdop.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg",
);
console.log("Status:", res.status);
console.log("OK:", res.ok);

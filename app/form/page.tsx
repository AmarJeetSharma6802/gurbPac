// "use client";

// import { useState } from "react";

// export default function LeadForm() {
//   const [form, setForm] = useState({
//     studentName: "",
//     email: "",
//     phone: "",
//     language: "",
//     courseName: "",
//     teacherName: "",
//     rating: "",
//     didntLike: "",
//   });

//   const changeHandler = (e: any) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const submitHandler = async (e: any) => {
//     e.preventDefault();

//     const payload = {
//       ...form,

//       gclid: localStorage.getItem("gclid"),
//     };

//     const response = await fetch("/api/lead", {
//       method: "POST",

//       headers: {
//         "Content-Type": "application/json",
//       },

//       body: JSON.stringify(payload),
//     });

//     const data = await response.json();

//     console.log(data);

//     setForm({
//       studentName: "",
//       email: "",
//       phone: "",
//       language: "",
//       courseName: "",
//       teacherName: "",
//       rating: "",
//       didntLike: "",
//     });
//   };

//   return (
//     <form onSubmit={submitHandler}>
//       <input
//         type="text"
//         name="studentName"
//         placeholder="Student Name"
//         onChange={changeHandler}
//       />

//       <input
//         type="email"
//         name="email"
//         placeholder="Email"
//         onChange={changeHandler}
//       />

//       <input
//         type="text"
//         name="phone"
//         placeholder="Phone"
//         onChange={changeHandler}
//       />

//       <input
//         type="text"
//         name="language"
//         placeholder="Language"
//         onChange={changeHandler}
//       />

//       <input
//         type="text"
//         name="courseName"
//         placeholder="Course Name"
//         onChange={changeHandler}
//       />

//       <input
//         type="text"
//         name="teacherName"
//         placeholder="Teacher Name"
//         onChange={changeHandler}
//       />

//       <input
//         type="text"
//         name="rating"
//         placeholder="Rating"
//         onChange={changeHandler}
//       />

//       <input
//         type="text"
//         name="didntLike"
//         placeholder="Didn't Like"
//         onChange={changeHandler}
//       />

//       <button type="submit">Submit</button>
//     </form>
//   );
// }

"use client";

import { useState } from "react";

export default function LeadForm() {
  const [form, setForm] = useState({
    studentName: "",
    email: "",
    phone: "",
    language: "",
    courseName: "",
    teacherName: "",
    rating: "",
  didntLike: "",
  });

  const changeHandler = (e: any) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e: any) => {
    e.preventDefault();

    const payload = {
      ...form,

      // Tracking
      gclid: localStorage.getItem("gclid"),

      utm_source: localStorage.getItem("utm_source"),

      utm_medium: localStorage.getItem("utm_medium"),

      utm_campaign: localStorage.getItem("utm_campaign"),

      utm_term: localStorage.getItem("utm_term"),

      platform: navigator.userAgent,

      referrer: document.referrer,
    };

    const response = await fetch("/api/lead", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    });

    const data = await response.json();

    console.log(data);
  };

  return (
    <form onSubmit={submitHandler}>
      <input
        type="text"
        name="studentName"
        placeholder="Student Name"
        onChange={changeHandler}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={changeHandler}
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone"
        onChange={changeHandler}
      />

      <input
        type="text"
        name="language"
        placeholder="Language"
        onChange={changeHandler}
      />

      <input
        type="text"
        name="courseName"
        placeholder="Course Name"
        onChange={changeHandler}
      />

      <input
        type="text"
        name="teacherName"
        placeholder="Teacher Name"
        onChange={changeHandler}
      />

      <input
        type="text"
        name="rating"
        placeholder="Rating"
        onChange={changeHandler}
      />

      <input
        type="text"
        name="didntLike"
        placeholder="Didn't Like"
        onChange={changeHandler}
      />

      <button type="submit">Submit</button>
    </form>
  );
}

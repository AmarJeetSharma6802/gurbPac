// "use client";

// import { useEffect } from "react";

// export default function GclidTracker() {

//   useEffect(() => {

//     const params = new URLSearchParams(
//       window.location.search
//     );

//     const gclid = params.get("gclid");

//     if (gclid) {

//       localStorage.setItem(
//         "gclid",
//         gclid
//       );

//     }

//   }, []);

//   return null;
// }

"use client";

import { useEffect } from "react";

export default function GclidTracker() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const trackingFields = [
      "gclid",
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
    ];

    trackingFields.forEach((field) => {
      const value = params.get(field);

      if (value) {
        localStorage.setItem(field, value);
      }
    });
  }, []);

  return null;
}

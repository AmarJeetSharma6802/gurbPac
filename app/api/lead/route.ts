import { NextRequest, NextResponse } from "next/server";

import Lead from "@/app/api/model/lead";
import DBconnect from "../DB/DBconnect";
import transporter from "../utils/nodmailer";

// export async function POST(req: NextRequest) {
//   try {
//     await DBconnect();

//     const body = await req.json();

//     await Lead.create(body);

//     await fetch(
//       `${process.env.SHEET_URL}?secret=${process.env.SECRET_KEY}`,

//       {
//         method: "POST",

//         body: JSON.stringify(body),
//       },
//     );

//     await transporter.sendMail({
//       from: process.env.EMAIL,
//       to: process.env.OWNER_EMAIL,

//       subject: "New Student Lead",

//       html: `

//         <h2>
//           New Lead
//         </h2>

//         <p>
//           Student:
//           ${body.studentName}
//         </p>

//         <p>
//           Email:
//           ${body.email}
//         </p>

//         <p>
//           Phone:
//           ${body.phone}
//         </p>

//         <p>
//           Course:
//           ${body.courseName}
//         </p>

//         <p>
//           Teacher:
//           ${body.teacherName}
//         </p>

//         <p>
//           GCLID:
//           ${body.gclid}
//         </p>

//       `,
//     });

//     return NextResponse.json({
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);

//     return NextResponse.json({
//       success: false,
//     });
//   }
// }

export async function POST(req: NextRequest) {
  try {
    await DBconnect();

    const body = await req.json();

    await Lead.create(body);

    await fetch(
      `${process.env.SHEET_URL}?secret=${process.env.SECRET_KEY}`,

      {
        method: "POST",

        body: JSON.stringify(body),
      },
    );

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.OWNER_EMAIL,

      subject: "New Student Lead",

      html: `

        <h2>
          New Lead
        </h2>

        <p>
          Student:
          ${body.studentName}
        </p>

        <p>
          Email:
          ${body.email}
        </p>

        <p>
          Phone:
          ${body.phone}
        </p>

        <p>
          Course:
          ${body.courseName}
        </p>

        <p>
          Teacher:
          ${body.teacherName}
        </p>

        <p>
          GCLID:
          ${body.gclid}
        </p>

        <p>
          Source:
          ${body.utm_source}
        </p>

        <p>
          Campaign:
          ${body.utm_campaign}
        </p>

        <p>
          Keyword:
          ${body.utm_term}
        </p>

      `,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,

      error,
    });
  }
}

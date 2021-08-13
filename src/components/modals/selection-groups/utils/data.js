export const presets = [
  {
    submission_id: 186,
    id: 1,
    preset_name: "Preset 1",
    group: [
      {
        id: 1,
        type: "publisher_employee",
        refer_id: 1, //presets
        emails: [
          {
            contact_id: 10,
            email: "wferreira.vinicius@gmail.com",
            shipping_field: "to",
          },
          {
            contact_id: 28,
            email: "mike@eagems.com",
            shipping_field: "cc",
          },
          {
            contact_id: 10,
            email: "wferreira.vinicius@gmail.com",
            shipping_field: "to",
          },
        ],
      },
      {
        id: 2,
        type: "publisher_employee",
        refer_id: 1,
        emails: [
          {
            contact_id: 10,
            email: "wferreira.vinicius@gmail.com",
            shipping_field: "cc",
          },
          {
            contact_id: 28,
            email: "mike@eagems.com",
            shipping_field: "bcc",
          },
        ],
      },
      {
        id: 3,
        type: "publisher_employee",
        refer_id: 26,
        emails: [
          {
            contact_id: 10,
            email: "wferreira.vinicius@gmail.com",
            shipping_field: "cc",
          },
          {
            contact_id: 28,
            email: "mike@eagems.com",
            shipping_field: "bcc",
          },
        ],
      },
      {
        id: 4,
        type: "press_contact",
        refer_id: 5,
        emails: [
          {
            contact_id: 2,
            email: "mike@eagems.com",
            shipping_field: "cc",
          },
          {
            contact_id: 22,
            email: "mike@eagems.com",
            shipping_field: "cc",
          },
        ],
      },
    ],
  },
  {
    submission_id: 187,
    id: 2,
    preset_name: "2D Material",
    group: [
      {
        id: 1,
        type: "publisher_employee",
        refer_id: 1,
        emails: [
          {
            contact_id: 10,
            email: "wferreira.vinicius@gmail.com",
            shipping_field: "to",
          },
          {
            contact_id: 28,
            email: "mike@eagems.com",
            shipping_field: "cc",
          },
        ],
      },
      {
        id: 2,
        type: "publisher_employee",
        refer_id: 35,
        emails: [
          {
            contact_id: 10,
            email: "wferreira.vinicius@gmail.com",
            shipping_field: "cc",
          },
          {
            contact_id: 28,
            email: "mike@eagems.com",
            shipping_field: "bcc",
          },
        ],
      },
      {
        id: 3,
        type: "publisher_employee",
        refer_id: 5,
        emails: [
          {
            contact_id: 10,
            email: "wferreira.vinicius@gmail.com",
            shipping_field: "cc",
          },
          {
            contact_id: 28,
            email: "mike@eagems.com",
            shipping_field: "bcc",
          },
        ],
      },
      {
        id: 4,
        type: "press_contact",
        refer_id: 21,
        emails: [
          {
            contact_id: 2,
            email: "mike@eagems.com",
            shipping_field: "cc",
          },
          {
            contact_id: 22,
            email: "mike@eagems.com",
            shipping_field: "cc",
          },
        ],
      },
    ],
  },
];

// [
//   {
//     submission_id: 186,
//     id: 1,
//     preset_name: "Preset 1",
//     group: [
//       {
//         id: 1,
//         type: "publisher_employee",
//         refer_id: 1, //presets
//         emails: [
//           {
//             contact_id: 10,
//             email: "wferreira.vinicius@gmail.com",
//             shipping_field: "to",
//           }
//         ],
//       }
//     ]
//   }
// ]
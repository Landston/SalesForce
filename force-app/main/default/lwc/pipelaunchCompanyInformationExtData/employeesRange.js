export default function employeesRange(num) {
  if (num < 11) {
    return "0-10";
  } else if (num < 21) {
    return "11-20";
  } else if (num < 51) {
    return "51-100";
  } else if (num < 101) {
    return "101-200";
  } else if (num < 501) {
    return "201-500";
  } else if (num < 1001) {
    return "501-1000";
  } else if (num < 2001) {
    return "1001-2000";
  } else if (num < 5001) {
    return "2001-5000";
  } else if (num < 10001) {
    return "5001-10000";
  } else {
    return "10000+";
  }
}
// export default function employeesRange(num) {
//   if (num < 11) {
//     return "[0-10]";
//   } else if (num < 21) {
//     return "[11-20]";
//   } else if (num < 51) {
//     return "[51-100]";
//   } else if (num < 101) {
//     return "[101-200]";
//   } else if (num < 501) {
//     return "[201-500]";
//   } else if (num < 1001) {
//     return "[501-1000]";
//   } else if (num < 2001) {
//     return "[1001-2000]";
//   } else if (num < 5001) {
//     return "[2001-5000]";
//   } else if (num < 10001) {
//     return "[5001-10000]";
//   } else {
//     return "[10000+]";
//   }
// }

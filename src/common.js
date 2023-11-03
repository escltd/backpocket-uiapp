import axios from 'axios';

export const HTTP = axios.create({
    baseURL: "",
    withCredentials: true,
})

export function sortObjectEntries(obj, n = 1, ascending = true ) {

    let sortedList = []

    //Sorting by values desc 
    if (!ascending) {
        sortedList = Object.entries(obj).sort((a, b) => {
            if (b[1] > a[1]) return 1;
            else if (b[1] < a[1]) return -1;
            //if values are same do edition checking if keys are in the right order
            else {
                if (a[0] > b[0]) return 1;
                else if (a[0] < b[0]) return -1;
                else return 0
            }
        })
    } else {
        sortedList = Object.entries(obj).sort((a, b) => {
            if (b[1] < a[1]) return 1;
            else if (b[1] > a[1]) return -1;
            //if values are same do edition checking if keys are in the right order
            else {
                if (a[0] < b[0]) return 1;
                else if (a[0] > b[0]) return -1;
                else return 0
            }
        })
    }
    // return first n values from sortedList
    return sortedList.map(el => el[0]).slice(0, n)
}

export function checkRedirect(respData) {
  if (respData.Body !== null) {
    if (respData.Body.Redirect !== null && respData.Body.Redirect !== undefined && respData.Body.Redirect !== "") {
      window.location.href = '/#'+respData.Body.Redirect
    }
  }
}

export function truncateNumber(value, decimal = 8)  {
    // return (Math.trunc(value * Math.pow(10, decimal)) / Math.pow(10, decimal))
    // return parseFloat((Math.trunc(value * Math.pow(10, decimal)) / Math.pow(10, decimal)).toFixed(decimal))
    // var truncatedNumber = Number(parseFloat(Math.trunc(value * Math.pow(10, decimal)) / Math.pow(10, decimal)).toFixed(decimal))

    

    var truncatedNumber = parseFloat(parseFloat(value).toFixed(decimal).replace(/(?:\.0+|(\.\d+?)0+)$/, "$1"))
    // if (truncatedNumber < 0) {
    //     truncatedNumber = 0
    // }
    return truncatedNumber
}

export function displayImage(event, app, field ) {
  var reader = new FileReader();
  var selectedFile = event.target.files[0];
  event.target.value = '';
  reader.readAsDataURL(selectedFile);
  reader.onload = function () {
    if (selectedFile.size > 10240000) {
      app.notifications.push({
        Code: 0,
        Message: "Image File must be less than 10MB"
      })
    } else {
      switch (selectedFile.type) {
        case "image/gif":
        case "image/png":
        case "image/jpg":
        case "image/jpeg":
          app.record[field] = reader.result;
          break;

        default:
          app.notifications.push({
            Code: 0,
            Message: "File Must be a valid Image"
          })
          break
      }
    }
  };
  reader.onerror = function (error) {
    app.notifications.push({Code:0,Message:"Image Error:"+error})
  };
}

export function uploadFilePDF(event, app, field) {
  var reader = new FileReader();
  var selectedFile = event.target.files[0];
  event.target.value = '';
  reader.readAsDataURL(selectedFile);
  reader.onload = function () {
    if (selectedFile.size > 10240000) {
      app.notifications.push({
        Code: 0,
        Message: "File must be less than 10MB"
      })
    } else {
      switch (selectedFile.type) {
        case "application/pdf":
          app.record[field] = reader.result;
          app.notifications.push({
            Code: 200,
            Message: "PDF file selected"
          })
          break;

        default:
          app.notifications.push({
            Code: 0,
            Message: "Only PDF Files allowed"
          })
          break
      }
    }
  };
  reader.onerror = function (error) {
    app.notifications.push({
      Code: 0,
      Message: "Image Error:" + error
    })
  };
}

export function humanNumber(nStr) {
    nStr += "";
    var x = nStr.split(".");
    var x1 = x[0];
    var x2 = x.length > 1 ? "." + x[1] : ".0";
    x2 = x2.length == 2 ? x2 + "0" : x2;
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
}

export function humanDate(dateTime) {
   if (dateTime !== "") {
       dateTime = new Date(dateTime.substring(0, 10)).toDateString().substring(0, 15) + " " + humanTime(new Date(dateTime.replace(/-/g, '-')).toTimeString().substring(0, 8));
   }
   return dateTime;
}

export function humanTime(time) {
    if (time == undefined) {
        return;
    }

    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
        time
    ];

    if (time.length > 1) {
        // If time format correct
        time = time.slice(1); // Remove full string match value
        time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original
}

export function checkIsZero(field){
  if (checkEmpty(field)) {
      return true
  }

  if(typeof field === 'number') {
      if (field === 0) {
          return true
      } else {
          return false
      }
  }
  return false
}

export function checkEmpty(field){
  
  if(typeof field === 'string') {
      if (field.trim() === '') {
          return true
      } else {
          return false
      }
  }

  if(typeof field === 'null' || typeof field === 'object' || typeof field === 'undefined') {
      return true
  }

  // if(typeof field === 'number') {
  //     if (field === 0) {
  //         return true
  //     } else {
  //         return false
  //     }
  // }
  return false
}

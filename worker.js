
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const { method, url } = request

  if (method === 'GET' && url.endsWith('/')) {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Linkd Worker</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color: #353f51;
            color: white;
            text-align: center;
          }
          textarea {
            width: 90%;
            height: 200px;
            padding: 10px;
            margin-bottom: 20px;
            font-size: 14px;
            background-color: white;
            color: black;
          }
          button {
            padding: 15px 30px;
            font-size: 16px;
            cursor: pointer;
            background-color: green;
            color: white;
            margin-bottom: 20px;
          }
          #output {
            padding: 10px;
            border: 1px solid #ccc;
            background-color: white;
            color: black;
            margin-bottom: 20px;
            font-size: 14px;
            display: inline-block;
            width: 90%;
            vertical-align: top;
            text-align: left;
            overflow-x: auto;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            background-color: white;
            color: black;
          }
          th, td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <h3>linkd.jessejesse.workers.dev</h3>
        <button onclick="parseMessage()">READ</button><br>
        <textarea id="input" placeholder="Enter recruiter message here..."></textarea><br>
        <div id="output"></div>
        <script>
          function parseRecruiterMessage(message) {
            const parsedData = {
              Remote: 'no',
              Salary: 'not mentioned',
              Role: null,
              Benefits: [],
              Notes: null,
              Experience: null,
              Recruiter: null,
              Phone: null,
              Email: null,
              Timestamp: new Date().toLocaleString() // Add timestamp
            };
          
            // Check if the message contains specific keywords and update parsedData accordingly
            if (message.toLowerCase().includes('remote')) {
              parsedData.Remote = 'yes';
            }
            if (message.toLowerCase().includes('contract')) {
              parsedData.Contract = true;
            }
          

            const roleRegex = /hiring an? ([^.]+)\./i;
            const roleMatch = message.match(roleRegex);
            if (roleMatch) {
              parsedData.Role = roleMatch[1].trim();
            }
        
            const salaryRegex = /(?:\b(?:salary|pay)\b.*?)(\d+(?:\.\d+)?)(?:\s*-\s*(\d+(?:\.\d+)?))?/i;
            const salaryMatch = message.match(salaryRegex);
            if (salaryMatch) {
              parsedData.Salary = \`$\${parseFloat(salaryMatch[1]).toFixed(2)}\`;
              if (salaryMatch[2]) {
                parsedData.Salary += \` - $\${parseFloat(salaryMatch[2]).toFixed(2)}\`;
              }
            }
          
            const recruiterRegex = /contact (\w+(?:\s\w+)*) at (\d{3}-\d{3}-\d{4}) or email (\S+@\S+)/i;

            const recruiterMatch = message.match(recruiterRegex);
            if (recruiterMatch) {
              parsedData.Recruiter = recruiterMatch[1].trim();
              parsedData.Phone = recruiterMatch[2].trim();
              parsedData.Email = recruiterMatch[3].trim();
            }
          
            return parsedData;
          }
          
          function initiateResponse(parsedData) {
            const table = document.createElement('table');
          
            const headers = Object.keys(parsedData);
            const headerRow = table.insertRow();
            headers.forEach(header => {
              const th = document.createElement('th');
              th.textContent = header.charAt(0).toUpperCase() + header.slice(1);
              headerRow.appendChild(th);
            });
          
            const dataRow = table.insertRow();
            headers.forEach(header => {
              const td = document.createElement('td');
              const value = parsedData[header];
              if (header === 'Phone' || header === 'Email') {
                td.innerHTML = value ? \`<a href="\${header === 'Phone' ? 'tel:' : 'mailto:'}\${value}">\${value}</a>\` : 'Unknown';
              } else {
                td.textContent = value === null ? 'Unknown' : value;
              }
              dataRow.appendChild(td);
            });
          
            document.getElementById('output').innerHTML = '';
            document.getElementById('output').appendChild(table);
          }
          
          function parseMessage() {
            const inputMessage = document.getElementById('input').value;
            const parsedData = parseRecruiterMessage(inputMessage);
            initiateResponse(parsedData);
          }
        </script>
      </body>
      </html>
    `

    return new Response(htmlContent, {
      headers: {
        'Content-Type': 'text/html'
      }
    })
  }

  return new Response('Not Found', { status: 404 })
}

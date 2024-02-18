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

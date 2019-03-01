# Shift Arrangement Tool — Dev Note

Shift Arrangement Website will help to show all team members shift data in a monthly calendar view. 

Users can easily access the site to modify his/her own data: morning shift, night shift, working day, vacation(annual leave, sick leave). 

For managers and TAs, they have the administrative permission to upload the draft data, view each day's on-duty percentage, export the monthly statistics . When a day is marked as Vacation, the site will notify the user to send S+ to team. 



| Feature Name                                             | Logic: Need + Method                                         |      |
| -------------------------------------------------------- | ------------------------------------------------------------ | ---- |
| 1. Add new status: "MS"(morning shift),"NS"(night shift) | Need: Illustrate the Morning Shift & Night Shift status in the calendar;                                                                                                                      Method: Add two more dayType to the option array |      |
| 2. Add a dialog for updating the status                  | Need: Replace an existing 'click' method of switch the status(dayType);                                                                                                                      Method: Set a dialog module in the PersonRow and its Children-Component  DayCell is the trigger（emit & property attributes are used） |      |
| 3. Add a Line for on-duty rate                           | Need: Make it clear about when there would be a lack of engineer;                                                                                                                      Method: Calculate the number of people whose status fits working condition & show the digits on top of the calendar together with the date |      |
| 4. Easy Authentication                                   | Need: Make this app a private tool;                                                                                                                      Method: Use "Promise" to get the authentication data and show the username in the app | ∆    |
| 5. Monthly report                                        | Need: Summary the personal monthly attendance;                                                                                                                      Method: Get JSON file from api and put personal attendance status into a table |      |



| Feature Name                                                 | Logic: Need + Method                                         |      |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ---- |
| 6. One can only change his own status;TA & Manager have higher permission to all data | Need: In case mis-operation, one can only have access to his or her status, while TA & Manager can have an admin access;                                                                                                                      Method: The permission system is build base on the Easy Authentication. The App would compare the username and the status owner. |      |
| 7. Add a new member to the calendar                          | Need: Add newComers to the tool with a default status;                                                                                                                      Method: Get the personal info from front-end and call the Insert_Record_to_DB function: incrementMonth( ) |      |
| 8. Hint one to mail team about the absence                   | Need: Hint one to mail team about the absence;                                                                                                                      Method: Add a pop dialog with the message to the choosed button | ∆    |
| 9. Init a new Calendar                                       | Need: Generate the default calendar template automaticly(To replace the last uploading .csv file feature);                                                                                                                      Method: Get last month data as a parameter for the function join with a dictionary includes the day numbers to derivate the calendar for this month; | ∆    |
| 10. Delete a member from the calendar                        | Need: Delete member from the tool;                                                                                                                      Method: use decrement function to remove a record from the db.document; |      |
| 11. Link the application with local Outlook and try to generate an email about AL/SL | Need:Open local Outlook through website;                                                                                                                      Method:use link to run the local Outlook App; |      |

## Scenario & Troubleshooting

1. Q: How to deploy a web App-Service ( Vue.js + Node.js + CosmosDB(mongodb))

   A:  

   ``` bash
   # go to the app PATH
   npm run build
   
   # Copy the resulting dist folder inside server
   # Run ```npm install``` inside the server folder
   # The mongo connection string is hardcoded inside the server.js file
   
   # Navigate to kudu console (http://yourSiteName.scm.azurewebsites.net) 
   # Click "Debug Console/CMD" & Go to PATH ./site/wwwroot/
   # Zip deploy the contents of the server folder to the App Service
   # Enable websockets
   ```

    

2. Q: 

   | StatusCode | HttpSubStatus | Time_Taken | Details |
   | ---------- | ------------- | ---------- | ------- |
   | 503        |               | 2.90s      |         |

   It turns out to be 503 Service Unavailable

   A: In this case the server is not responding. Wait and then refresh the page to get the web resource.

   LINK: https://www.csssupportwiki.com/index.php/curated:Azure_App_Service_-_Perf_-_Crash



3. Q: The WebApp is either slow or not responding at all. Symptoms are that the browser keeps on spinning and returns the page after a long time.

   A: Platform Issue includes: 

   1. CHECK_PLATFORM_OUTAGE - Any known outage or LSI happening during the time the customer reported an issue.
   2. IS_CANARY_WORKING - Platform Availability showing a number less than 100% during the time customer reported a problem
   3. CPU_AND_MEMORY_CONSUMPTION_VERY_HIGH on the App Service Plan but customer’s worker process / web jobs / child processes started by the customer’s application are not consuming HIGH CPU or HIGH MEMORY
   4. STORAGE_FAILOVERS_OR_LATENCY - Storage blips and Storage File System Failovers causing worker process restarts
   5. INSTANCE_CHANGE_EVENTS – Most likely due to UD Walks or VM failovers



## Other Resource

1. Deployment Crash
   - 400 Bad Request
   - 404 Not Found
   - 500 Internal Server Error
   - 502 Bad Gateway
   - 503 Service Unavailable

2. Easy Authentication

LINK: https://docs.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-auth-aad#call-api-securely-from-server-code

3. Studio3T trial expired

   1. Run Script (studio3t.bat)

      ``` bash
      @echo off
      FOR /f "tokens=1,2,* " %%i IN ('reg query "HKEY_CURRENT_USER\Software\JavaSoft\Prefs\3t\mongochef\enterprise" ^| find /V "installation" ^| find /V "HKEY"') DO ECHO yes | reg add "HKEY_CURRENT_USER\Software\JavaSoft\Prefs\3t\mongochef\enterprise" /v %%i /t REG_SZ /d ""
      pause>nul
      exit
      ```

      

